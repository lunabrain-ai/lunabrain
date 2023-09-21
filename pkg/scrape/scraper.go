package scrape

import (
	"context"
	"crypto/tls"
	"github.com/chromedp/chromedp"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"strings"
	"time"
)

type Scraper interface {
	Scrape(url string) (*Response, error)
}

type scraper struct {
	httpClient     *http.Client
	browserDomains []string
	config         Config
	db             db.Store
	chromeCtx      context.Context
}

func NewScraper(config Config, db db.Store) *scraper {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{Timeout: time.Second * 5, Transport: tr}

	parsedBrowserDomains := strings.Split(strings.ReplaceAll(config.BrowserDomains, " ", ""), ",")

	o := chromedp.DefaultExecAllocatorOptions[:]
	if config.Proxy.Host != "" {
		o = append(o,
			chromedp.ProxyServer(config.Proxy.Host),
		)
	}

	o = append(o,
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
	)

	ctx, cancel := chromedp.NewExecAllocator(
		context.Background(), o...)
	defer cancel()

	chromeCtx, cancel := chromedp.NewContext(
		ctx,
		chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	return &scraper{
		config:         config,
		httpClient:     client,
		browserDomains: parsedBrowserDomains,
		db:             db,
		chromeCtx:      chromeCtx,
	}
}

func (p *scraper) Scrape(url string) (*Response, error) {
	var (
		resp *Response
		err  error
	)

	if p.config.UseCache {
		// TODO breadchris this is a hack for now until the scraping is a collector
		normalContent, err := p.db.GetNormalContentByData(url)
		if err == nil {
			for _, c := range normalContent {
				if c.NormalizerID == int32(genapi.NormalizerID_URL_HTML) {
					log.Info().Str("url", url).Msg("using cached content")
					return &Response{
						Content: c.Data,
					}, nil
				}
			}
		}
	}

	if p.config.Client == "chrome" {
		resp, err = p.scrapeWithChrome(url)
	} else if p.config.Client == "http" {
		resp, err = p.scrapeWithClient(url)
	} else {
		return nil, errors.Errorf("unknown client %s", p.config.Client)
	}

	if err == nil {
		return resp, nil
	}

	// If we failed to scrape with the configured client, try the fallback
	if p.config.Fallback && p.config.Client != "http" {
		return p.scrapeWithClient(url)
	}
	return nil, err
}

func (p *scraper) scrapeWithClient(url string) (*Response, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", url).
			Msg("Failed to create request for reference Host")
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")

	resp, err := p.httpClient.Do(req)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", url).
			Msg("Failed to fetch reference Host")
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// TODO parse header out of respBody
	return &Response{
		Title:       "",
		Content:     string(respBody),
		ContentType: resp.Header.Get("Content-Type"),
	}, nil
}

func (p *scraper) scrapeWithChrome(url string) (*Response, error) {
	//whenPromptedLoginToProxy(ctx, p.config.Proxy.Username, p.config.Proxy.Password)

	timeoutCtx, timeoutCancel := context.WithTimeout(p.chromeCtx, 10*time.Second)
	defer timeoutCancel()

	start := time.Now()

	var (
		html  string
		title string
	)
	err := chromedp.Run(timeoutCtx,
		//fetch.Enable().WithHandleAuthRequests(true),
		//navigateWithError(url),
		chromedp.Navigate(url),
		chromedp.Sleep(1*time.Second),
		chromedp.OuterHTML("html", &html),
		chromedp.Title(&title),
	)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to scrape Host with Chrome: %s", url)
	}

	log.Debug().
		Float64("duration", time.Since(start).Seconds()).
		Msg("Scraped Host with Chrome")
	return &Response{
		Title:       title,
		Content:     html,
		ContentType: "text/html",
	}, nil
}

//func (p *scraper) scrapeVulnerabilityReference(ref *ReferenceInfo) *model.ReferenceContent {
//	pRef := model.ReferenceContent{
//		ReferenceID: ref.ID,
//	}
//
//	resp, err := p.scrapeContent(ref.Host)
//	if err != nil {
//		log.Error().Err(err).Str("url", ref.Host).Msg("failed to scrape Content")
//		return &pRef
//	}
//
//	pRef.LastSuccessfulFetch = util.Ptr(time.Now())
//	pRef.Content = resp.Content
//	pRef.Title = resp.Title
//	pRef.ContentType = resp.ContentType
//
//	// TODO break this out into its own step so that normalization is done completely after scraping
//	normalContent, err := normalizeReferenceContent(resp.Content)
//	if err != nil {
//		log.Error().
//			Err(err).
//			Str("url", ref.Host).
//			Msg("failed to normalize Content")
//		return &pRef
//	}
//
//	pRef.NormalizedContent = normalContent
//
//	// TODO (cthompson) store the cleaned content in the database
//	_, err = p.deps.LangChain.CleanWebpage(context.Background(), &gen.CleanWebpageRequest{
//		Content:     normalContent,
//		Description: ref.VulnDesc,
//	})
//	if err != nil {
//		return &pRef
//	}
//
//	return &pRef
//}
//
//func (p *scraper) processVulnerabilityWorker(
//	wg *sync.WaitGroup,
//	refScrapeChan <-chan *ReferenceInfo,
//	saveRefChan chan<- *model.ReferenceContent,
//) error {
//	for ref := range refScrapeChan {
//		scrapedRef := p.scrapeVulnerabilityReference(ref)
//		saveRefChan <- scrapedRef
//	}
//	wg.Done()
//	return nil
//}
//
//func (p *scraper) referenceContentAlreadyExists(referenceID string) error {
//	referenceUUID, err := uuid.Parse(referenceID)
//	if err != nil {
//		return err
//	}
//
//	rc := table.ReferenceContent
//	selectExistingRef := rc.LEFT_JOIN(
//		table.Reference, table.Reference.ID.EQ(rc.ReferenceID),
//	).SELECT(
//		table.Reference.ID,
//	).WHERE(
//		table.Reference.ID.EQ(postgres.UUID(referenceUUID)),
//	)
//
//	var existingVulnRef model.ReferenceContent
//	return selectExistingRef.Query(p.deps.DB, &existingVulnRef)
//}
//
//func (p *scraper) updateOrCreateRefContentWorker(
//	saveWg *sync.WaitGroup,
//	saveRefChan <-chan *model.ReferenceContent,
//) {
//	saveWg.Add(1)
//	defer saveWg.Done()
//
//	for ref := range saveRefChan {
//		rc := table.ReferenceContent
//		upsertRefContent := rc.INSERT(
//			rc.ReferenceID,
//			rc.ContentType,
//			rc.Content,
//			rc.NormalizedContent,
//			rc.Title,
//			rc.LastSuccessfulFetch,
//		).MODEL(ref).ON_CONFLICT(
//			rc.ReferenceID,
//		).DO_UPDATE(
//			postgres.SET(
//				rc.ContentType.SET(
//					rc.EXCLUDED.ContentType,
//				),
//				rc.Content.SET(
//					rc.EXCLUDED.Content,
//				),
//				rc.NormalizedContent.SET(
//					rc.EXCLUDED.NormalizedContent,
//				),
//				rc.Title.SET(
//					rc.EXCLUDED.Title,
//				),
//				rc.LastSuccessfulFetch.SET(
//					rc.EXCLUDED.LastSuccessfulFetch,
//				),
//			),
//		)
//
//		_, err := upsertRefContent.Exec(p.deps.DB)
//		if err != nil {
//			log.Error().
//				Err(err).
//				Msg("failed to upsert reference Content")
//			continue
//		}
//	}
//}
//
//func (p *scraper) ScrapeVulnerabilities(ecosystem, vulnID string, onlyUnfetchedContent bool) error {
//	query := table.Vulnerability.SELECT(
//		table.Vulnerability.ID.AS("VulnerabilityID"),
//		table.Vulnerability.Details.AS("Details"),
//		table.Vulnerability.Summary.AS("Summary"),
//		table.Reference.ID.AS("ReferenceID"),
//		table.Reference.Host.AS("ReferenceURL"),
//	).FROM(
//		table.Vulnerability.INNER_JOIN(
//			table.Reference, table.Reference.VulnerabilityID.EQ(table.Vulnerability.ID),
//		).INNER_JOIN(
//			table.Affected, table.Affected.VulnerabilityID.EQ(table.Vulnerability.ID),
//		).INNER_JOIN(
//			packschem.Package, packschem.Package.ID.EQ(table.Affected.PackageID),
//		).LEFT_JOIN(
//			table.ReferenceContent, table.ReferenceContent.ReferenceID.EQ(table.Reference.ID),
//		),
//	).ORDER_BY(table.Vulnerability.SourceID.DESC())
//
//	var whereClauses []postgres.BoolExpression
//	if ecosystem != "" {
//		whereClauses = append(whereClauses, packschem.Package.PackageManager.EQ(postgres.NewEnumValue(ecosystem)))
//	}
//	if vulnID != "" {
//		whereClauses = append(whereClauses, table.Vulnerability.SourceID.EQ(postgres.String(vulnID)))
//	}
//	if onlyUnfetchedContent {
//		whereClauses = append(whereClauses, table.ReferenceContent.LastSuccessfulFetch.IS_NOT_NULL())
//	}
//
//	if len(whereClauses) > 0 {
//		log.Info().Any("vulnid", vulnID).Msg("building query filter")
//
//		whereClause := whereClauses[0]
//		for i := 1; i < len(whereClauses); i++ {
//			whereClause = whereClause.AND(whereClauses[i])
//		}
//		query = query.WHERE(whereClause)
//	}
//
//	log.Info().Msg("filtering query")
//
//	var results []struct {
//		//VulnerabilityInfo
//		ReferenceID     uuid.UUID
//		ReferenceURL    string
//		Details         string
//		Summary         string
//		VulnerabilityId uuid.UUID
//	}
//	err := query.Query(p.deps.DB, &results)
//	if err != nil {
//		log.Error().Err(err).Msg("failed to get vulnerability rows")
//		return err
//	}
//
//	log.Info().Int("number_of_references", len(results)).Msg("fetched references")
//
//	bar := progressbar.Default(int64(len(results)))
//
//	refScrapeChan := make(chan *ReferenceInfo, 100)
//	saveRefChan := make(chan *model.ReferenceContent, 100)
//
//	var (
//		wg     sync.WaitGroup
//		saveWg sync.WaitGroup
//	)
//
//	for i := 0; i < p.deps.Workers; i++ {
//		wg.Add(1)
//		go func() {
//			err := p.processVulnerabilityWorker(&wg, refScrapeChan, saveRefChan)
//			if err != nil {
//				log.Error().Err(err).Msg("failed to process vulnerability worker")
//			}
//		}()
//	}
//
//	go p.updateOrCreateRefContentWorker(&saveWg, saveRefChan)
//
//	for _, vulnInfo := range results {
//		bar.Add(1)
//
//		err = p.referenceContentAlreadyExists(vulnInfo.ReferenceID.String())
//		if err == nil {
//			var (
//				title   string
//				content string
//			)
//
//			if vulnInfo.Summary != "" {
//				title = vulnInfo.Summary
//			}
//			if vulnInfo.Details != "" {
//				content = vulnInfo.Details
//			}
//
//			vulnRef := model.ReferenceContent{
//				ReferenceID: vulnInfo.ReferenceID,
//				Title:       title,
//				Content:     content,
//			}
//			saveRefChan <- &vulnRef
//		}
//
//		// TODO check the error to make sure it is just a "not found" error
//		// "operator does not exist: uuid = text at character"
//
//		// send this reference to be scraped
//		refScrapeChan <- &ReferenceInfo{
//			Reference: model.Reference{
//				ID:  vulnInfo.ReferenceID,
//				Host: vulnInfo.ReferenceURL,
//			},
//			VulnDesc: vulnInfo.Details,
//		}
//	}
//
//	close(refScrapeChan)
//	log.Info().Msg("waiting for workers to finish")
//	wg.Wait()
//
//	close(saveRefChan)
//	log.Info().Msg("waiting for references to finish saving")
//	saveWg.Wait()
//
//	return nil
//}
//
//func (p *scraper) LoadAndOutputToDir(cache string, outputDir string, markdown bool) error {
//	db, err := loadGormDB(cache)
//	if err != nil {
//		return err
//	}
//
//	err = os.MkdirAll(outputDir, 0755)
//	if err != nil {
//		return err
//	}
//
//	rows, err := db.Table("processed_references").Rows()
//	if err != nil {
//		return err
//	}
//	defer rows.Close()
//
//	for rows.Next() {
//		var ref ProcessedReference
//		err = db.ScanRows(rows, &ref)
//		if err != nil {
//			log.Error().Err(err).Msg("failed to scan reference")
//			continue
//		}
//
//		var (
//			content []byte
//			ext     string
//		)
//
//		contentReader := strings.NewReader(ref.Content)
//
//		parsedUrl, err := url.Parse(ref.Host)
//		if err != nil {
//			continue
//		}
//
//		article, err := readability.FromReader(contentReader, parsedUrl)
//		if err != nil {
//			log.Error().Err(err).Msg("failed to parse html body")
//			continue
//		}
//
//		if markdown {
//			ext = ".md"
//
//			strContent, err := formatContentAsMarkdown(ref.Content, ref.Host)
//			if err != nil {
//				log.Warn().Err(err).Msg("failed to convert reference to markdown")
//				content = []byte("# " + ref.Title + "\n\n" + "## Vulnerability" + "\n[[" + ref.VulnerabilityID + "]]\n\n" + article.TextContent)
//			} else {
//				content = []byte(strContent)
//			}
//		} else {
//			ext = ".json"
//
//			ref.Title = article.Title
//			ref.Content = article.TextContent
//
//			content, err = json.Marshal(ref)
//			if err != nil {
//				log.Error().Err(err).Msg("failed to serialize reference")
//				continue
//			}
//		}
//
//		err = os.WriteFile(path.Join(outputDir, slugify.Slugify(ref.Host)+ext), content, 0644)
//		if err != nil {
//			log.Error().Err(err).Msg("failed to write reference")
//			continue
//		}
//	}
//	return nil
//}
