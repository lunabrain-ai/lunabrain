package normalize

import (
	"bytes"
	"context"
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/pkg/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/reactivex/rxgo/v2"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"os"
)

func (s *Normalize) ProcessText(ctx context.Context, file *content.File) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		seg := genapi.Segment{
			Num:  0,
			Text: string(file.Data),
		}
		next <- rxgo.Of(&seg)
	}}, rxgo.WithContext(ctx))
}

func (s *Normalize) ProcessPDF(ctx context.Context, file *content.File) rxgo.Observable {
	r := bytes.NewReader(file.Data)
	pd := NewPDF(r, int64(len(file.Data)))
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		pages, err := pd.Load(ctx)
		if err != nil {
			next <- rxgo.Error(err)
			return
		}

		for i, page := range pages {
			seg := genapi.Segment{
				Num:  uint32(i),
				Text: page.PageContent,
			}
			next <- rxgo.Of(&seg)
		}
	}}, rxgo.WithContext(ctx))
}

func (s *Normalize) ProcessAudio(
	ctx context.Context,
	file *content.File,
	id uuid.UUID,
	convert bool,
) (*content.Transcript, rxgo.Observable, error) {
	if convert {
		converted := file.Url + ".wav"

		err := ffmpeg.Input(file.Url).
			Output(converted, ffmpeg.KwArgs{"ar": "16000", "ac": "1", "f": "wav"}).
			OverWriteOutput().ErrorToStdOut().Run()
		if err != nil {
			return nil, nil, err
		}

		// TODO breadchris moving the file back to the original file name until
		// file chain of custody is implemented
		err = os.Rename(converted, file.Url)
		if err != nil {
			return nil, nil, err
		}
	}
	c := &content.Transcript{
		Id:   id.String(),
		Name: file.File,
	}
	return c, s.whisper.Transcribe(ctx, id.String(), file.Url, 0), nil
}

func newTranscriptContent(cntID uuid.UUID, t *content.Transcript) *content.Content {
	return &content.Content{
		Id: cntID.String(),
		Type: &content.Content_Normalized{
			Normalized: &content.Normalized{
				Type: &content.Normalized_Transcript{
					Transcript: t,
				},
			},
		},
	}
}

//func GenerateImages(ctx context.Context, c *connect_go.Request[genapi.GenerateImagesRequest]) (*connect_go.Response[genapi.GenerateImagesResponse], error) {
//	images, err := p.openai.GenerateImages(ctx, c.Msg.Prompt)
//	if err != nil {
//		return nil, err
//	}
//	return connect_go.NewResponse(&genapi.GenerateImagesResponse{
//		Images: images,
//	}), nil
//}

//func OCR(ctx context.Context, c *connect_go.Request[genapi.FilePath]) (*connect_go.Response[genapi.OCRText], error) {
//	log.Info().Str("file", c.Msg.File).Msg("ocr")
//	client := gosseract.NewClient()
//	defer client.Close()
//
//	err := client.SetImage(c.Msg.File)
//	if err != nil {
//		return nil, err
//	}
//
//	text, err := client.Text()
//	if err != nil {
//		return nil, err
//	}
//
//	return connect_go.NewResponse(&genapi.OCRText{
//		Text: text,
//	}), nil
//}
