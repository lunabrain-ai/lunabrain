package normalize

import (
	"encoding/json"
	"fmt"
	"github.com/dominikbraun/graph"
	"github.com/gocolly/colly/v2"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/pkg/errors"
	"github.com/samber/lo"
	"log/slog"
	"strings"
)

func (s *Normalize) chatgpt(url string) (*ChatGPTResponse, error) {
	var (
		jsonData ChatGPTResponse
		cbErr    error
	)

	c := colly.NewCollector()

	c.OnHTML("script#__NEXT_DATA__", func(e *colly.HTMLElement) {
		if cbErr = json.Unmarshal([]byte(e.Text), &jsonData); cbErr != nil {
			slog.Error("Failed to unmarshal JSON: %v", cbErr)
			return
		}
	})

	c.OnError(func(r *colly.Response, e error) {
		cbErr = e
	})

	err := c.Visit(url)
	if err != nil || cbErr != nil {
		return nil, err
	}
	return &jsonData, cbErr
}

func (s *Normalize) chatgptContent(url string) ([]*content.Content, error) {
	var nCnt []*content.Content

	data, err := s.chatgpt(url)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to get chatgpt data from %s", url)
	}
	sr := data.Props.PageProps.ServerResponse

	g, c, err := convertToGraph(sr.Data)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to convert chatgpt data to graph")
	}

	rootNodes, err := getRootNodes(g)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to get root nodes from graph")
	}

	var conv []string
	var exerpt string
	for _, rootNode := range rootNodes {
		err = graph.DFS(g, rootNode, func(id string) bool {
			if c[id] == nil {
				return false
			}
			slog.Debug("processing node", "node", c[id].Content.Parts)
			conv = append(conv, c[id].Content.Parts...)
			if exerpt == "" {
				exerpt = strings.Join(c[id].Content.Parts, ", ")
			}
			return false
		})
		if err != nil {
			return nil, errors.Wrapf(err, "failed to traverse graph")
		}
	}

	nCnt = append(nCnt, &content.Content{
		Tags: []string{},
		Type: &content.Content_Normalized{
			Normalized: &content.Normalized{
				Type: &content.Normalized_Article{
					Article: &content.Article{
						Title:   sr.Data.Title,
						Excerpt: exerpt,
						Text:    strings.Join(lo.Map(conv, func(s string, i int) string { return fmt.Sprintf("- %s", s) }), "\n"),
					},
				},
			},
		},
	})
	return nCnt, nil
}

func getRootNodes(g graph.Graph[string, string]) ([]string, error) {
	m, err := g.PredecessorMap()
	if err != nil {
		return nil, err
	}

	var rootNodes []string
	for id, edges := range m {
		if len(edges) == 0 {
			rootNodes = append(rootNodes, id)
		}
	}
	return rootNodes, nil
}

type Conversation map[string]*LinearConversationMessage

func convertToGraph(data Data) (graph.Graph[string, string], Conversation, error) {
	g := graph.New(graph.StringHash, graph.Directed(), graph.PreventCycles())
	c := Conversation{}

	for _, lc := range data.LinearConversation {
		err := g.AddVertex(lc.ID)
		if err != nil {
			return nil, nil, err
		}
	}

	for _, lc := range data.LinearConversation {
		c[lc.ID] = lc.Message
		for _, child := range lc.Children {
			err := g.AddEdge(lc.ID, child)
			if err != nil {
				return nil, nil, err
			}
		}
	}
	return g, c, nil
}
