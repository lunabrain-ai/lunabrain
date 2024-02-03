package normalize

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/content/store"
	genapi "github.com/lunabrain-ai/lunabrain/pkg/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/reactivex/rxgo/v2"
	"log/slog"
	ghttp "net/http"
	"net/url"
	"path"
	"sync"
)

type Normalize struct {
	bucket *bucket.Builder
	// TODO breadchris use just builder instead
	fileStore *bucket.Bucket
	whisper   *whisper.Client
	content   *store.EntStore
}

func New(
	b *bucket.Builder,
	fileStore *bucket.Bucket,
	whisper *whisper.Client,
	content *store.EntStore,
) *Normalize {
	return &Normalize{
		bucket:    b,
		fileStore: fileStore,
		whisper:   whisper,
		content:   content,
	}
}

func (s *Normalize) Normalize(ctx context.Context, uid uuid.UUID, c *content.Content) ([]*content.Content, []string, error) {
	var (
		nCnt []*content.Content
		err  error
		obs  rxgo.Observable
		id   = uuid.New()
	)
	switch t := c.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_File:
			var ct *content.Transcript

			name := u.File.File

			contentType := ghttp.DetectContentType(u.File.Data)
			switch contentType {
			case "audio/wave":
				ct, obs, err = s.ProcessAudio(context.TODO(), u.File, id, false)
			//case "application/pdf":
			//	obs = s.ProcessPDF(ctx, u.File)
			//case "text/plain; charset=utf-8":
			//	obs = s.ProcessText(ctx, u.File)
			default:
				// TODO breadchris m4a is not a mime type in the golang mime package
				if path.Ext(name) == ".m4a" {
					ct, obs, err = s.ProcessAudio(context.TODO(), u.File, id, true)
				} else {
					return nil, nil, nil
				}
			}
			if err != nil {
				return nil, nil, err
			}

			if ct != nil && obs != nil {
				nCnt = append(nCnt, newTranscriptContent(id, ct))
				s.observeSegments(obs, uid, id, ct)
			}
		case *content.Data_Url:
			ul := u.Url.Url
			pUrl, err := url.Parse(ul)
			if err != nil {
				return nil, nil, err
			}

			sub, err := util.RemoveSubdomains(pUrl.Host)
			if err != nil {
				return nil, nil, err
			}

			tags := []string{
				pUrl.Host,
			}

			switch sub {
			case "chat.openai.com":
				cnt, err := s.chatgptContent(ul)
				if err != nil {
					return nil, nil, err
				}
				return cnt, tags, nil
			case "github.com":
				cnt, err := s.gitURL(ul)
				if err != nil {
					return nil, nil, err
				}
				return cnt, tags, nil
			case "youtube.com":
				slog.Debug("downloading youtube video", "host", pUrl.Host, "id", pUrl.Query().Get("v"))
				r, err := s.DownloadYouTubeVideo(ctx, &connect_go.Request[genapi.YouTubeVideo]{
					Msg: &genapi.YouTubeVideo{
						Id:   pUrl.Query().Get("v"),
						File: id.String(),
					},
				})
				if err != nil {
					return nil, nil, err
				}
				if r.Msg.Transcript == nil {
					var ct *content.Transcript
					ct, obs, err = s.ProcessAudio(ctx, &content.File{
						File: r.Msg.FilePath.File,
					}, id, true)
					nCnt = append(nCnt, newTranscriptContent(id, ct))
					s.observeSegments(obs, uid, id, ct)
				} else {
					nCnt = append(nCnt, newTranscriptContent(id, &content.Transcript{
						Id:       id.String(),
						Name:     r.Msg.Title,
						Segments: r.Msg.Transcript,
					}))
				}
				return nCnt, tags, nil
			}

			// TODO breadchris some domain specific logic is a nice to have
			//if strings.HasSuffix(parsed.Path, ".git") {
			//	return s.gitURL(ul)
			//}

			cnt, err := s.articleURL(ul)
			if err != nil {
				return nil, nil, err
			}
			return cnt, tags, nil
		}
	}
	return nCnt, []string{}, nil
}

func (s *Normalize) observeSegments(
	obs rxgo.Observable,
	userID uuid.UUID,
	cntID uuid.UUID,
	ct *content.Transcript,
) {
	var mutex sync.Mutex
	obs.ForEach(func(item any) {
		t, ok := item.(*content.Segment)
		if !ok {
			return
		}

		ct.Segments = append(ct.Segments, t)
		mutex.Lock()
		defer mutex.Unlock()
		_, err := s.content.SaveContent(context.TODO(), userID, uuid.Nil, newTranscriptContent(cntID, ct), nil)
		if err != nil {
			slog.Error("error saving content", "error", err)
		}
	}, func(err error) {
		slog.Error("error in observable", "error", err)
	}, func() {
		slog.Info("transcription complete")
	})
}

//func ExtractTextFromImage(imagePath string) (string, error) {
//	client := gosseract.NewClient()
//	defer client.Close()
//
//	err := client.SetImage(imagePath)
//	if err != nil {
//		return "", err
//	}
//
//	text, err := client.Text()
//	if err != nil {
//		return "", err
//	}
//
//	return text, nil
//}
