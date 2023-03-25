package scrape

import (
	"crypto/tls"
	"github.com/google/wire"
	"net/http"
	"strings"
	"time"
)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewScraper,
	wire.Bind(new(Scraper), new(*scraper)),
)

type Scraper interface {
	ScrapeWithChrome(url string) (*Response, error)
}

type scraper struct {
	httpClient     *http.Client
	browserDomains []string
	config         Config
}

func NewScraper(config Config) *scraper {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{Timeout: time.Second * 5, Transport: tr}

	parsedBrowserDomains := strings.Split(strings.ReplaceAll(config.BrowserDomains, " ", ""), ",")

	return &scraper{
		config:         config,
		httpClient:     client,
		browserDomains: parsedBrowserDomains,
	}
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
