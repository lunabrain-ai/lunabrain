package papermod

type Config struct {
	PublishDir             string                    `yaml:"publishDir"`
	BaseURL                string                    `yaml:"baseURL"`
	Title                  string                    `yaml:"title"`
	Paginate               int                       `yaml:"paginate"`
	Theme                  []string                  `yaml:"theme"`
	EnableInlineShortcodes bool                      `yaml:"enableInlineShortcodes"`
	EnableRobotsTXT        bool                      `yaml:"enableRobotsTXT"`
	BuildDrafts            bool                      `yaml:"buildDrafts"`
	BuildFuture            bool                      `yaml:"buildFuture"`
	BuildExpired           bool                      `yaml:"buildExpired"`
	EnableEmoji            bool                      `yaml:"enableEmoji"`
	PygmentsUseClasses     bool                      `yaml:"pygmentsUseClasses"`
	MainSections           []string                  `yaml:"mainsections"`
	Minify                 MinifyConfig              `yaml:"minify"`
	Languages              map[string]LanguageConfig `yaml:"languages"`
	Outputs                map[string][]string       `yaml:"outputs"`
	Params                 ParamsConfig              `yaml:"params"`
	Markup                 MarkupConfig              `yaml:"markup"`
	Services               ServicesConfig            `yaml:"services"`
}

type MinifyConfig struct {
	DisableXML bool `yaml:"disableXML"`
}

type LanguageConfig struct {
	LanguageName string                 `yaml:"languageName"`
	Weight       int                    `yaml:"weight"`
	Title        string                 `yaml:"title,omitempty"`
	Taxonomies   map[string]string      `yaml:"taxonomies"`
	Menu         map[string][]MenuItem  `yaml:"menu"`
	Params       map[string]interface{} `yaml:"params,omitempty"`
}

type MenuItem struct {
	Name   string `yaml:"name"`
	URL    string `yaml:"url"`
	Weight int    `yaml:"weight"`
}

type ParamsConfig struct {
	Env                            string               `yaml:"env"`
	Description                    string               `yaml:"description"`
	Author                         string               `yaml:"author"`
	DefaultTheme                   string               `yaml:"defaultTheme"`
	ShowShareButtons               bool                 `yaml:"ShowShareButtons"`
	ShowReadingTime                bool                 `yaml:"ShowReadingTime"`
	DisplayFullLangName            bool                 `yaml:"displayFullLangName"`
	ShowPostNavLinks               bool                 `yaml:"ShowPostNavLinks"`
	ShowBreadCrumbs                bool                 `yaml:"ShowBreadCrumbs"`
	ShowCodeCopyButtons            bool                 `yaml:"ShowCodeCopyButtons"`
	ShowRssButtonInSectionTermList bool                 `yaml:"ShowRssButtonInSectionTermList"`
	ShowAllPagesInArchive          bool                 `yaml:"ShowAllPagesInArchive"`
	ShowPageNums                   bool                 `yaml:"ShowPageNums"`
	ShowToc                        bool                 `yaml:"ShowToc"`
	Images                         []string             `yaml:"images"`
	ProfileMode                    ProfileModeConfig    `yaml:"profileMode"`
	HomeInfoParams                 HomeInfoParamsConfig `yaml:"homeInfoParams"`
	SocialIcons                    []SocialIconConfig   `yaml:"socialIcons"`
	EditPost                       EditPostConfig       `yaml:"editPost"`
	Assets                         AssetsConfig         `yaml:"assets"`
}

type ProfileModeConfig struct {
	Enabled    bool           `yaml:"enabled"`
	Title      string         `yaml:"title"`
	ImageUrl   string         `yaml:"imageUrl"`
	ImageTitle string         `yaml:"imageTitle"`
	Buttons    []ButtonConfig `yaml:"buttons"`
}

type ButtonConfig struct {
	Name string `yaml:"name"`
	URL  string `yaml:"url"`
}

type HomeInfoParamsConfig struct {
	Title   string `yaml:"Title"`
	Content string `yaml:"Content"`
}

type SocialIconConfig struct {
	Name  string `yaml:"name"`
	Title string `yaml:"title"`
	URL   string `yaml:"url"`
}

type EditPostConfig struct {
	URL            string `yaml:"URL"`
	Text           string `yaml:"Text"`
	AppendFilePath bool   `yaml:"appendFilePath"`
}

type AssetsConfig struct {
	DisableHLJS bool `yaml:"disableHLJS"`
}

type MarkupConfig struct {
	Goldmark  GoldmarkConfig  `yaml:"goldmark"`
	Highlight HighlightConfig `yaml:"highlight"`
}

type GoldmarkConfig struct {
	Renderer RendererConfig `yaml:"renderer"`
}

type RendererConfig struct {
	Unsafe bool `yaml:"unsafe"`
}

type HighlightConfig struct {
	NoClasses bool `yaml:"noClasses"`
}

type ServicesConfig struct {
	Instagram ServiceConfig `yaml:"instagram"`
	Twitter   ServiceConfig `yaml:"twitter"`
}

type ServiceConfig struct {
	DisableInlineCSS bool `yaml:"disableInlineCSS"`
}

type Option struct {
}

func New(url string) Config {
	themeName := "papermod"
	return Config{
		PublishDir:             "@breadchris",
		BaseURL:                url,
		Title:                  "Title",
		Paginate:               5,
		Theme:                  []string{themeName},
		EnableInlineShortcodes: true,
		EnableRobotsTXT:        true,
		BuildDrafts:            false,
		BuildFuture:            false,
		BuildExpired:           false,
		EnableEmoji:            true,
		PygmentsUseClasses:     true,
		MainSections:           []string{"posts", "papermod"},
		Minify: MinifyConfig{
			DisableXML: true,
		},
		Languages: map[string]LanguageConfig{
			"en": {
				LanguageName: "English",
				Weight:       1,
				Taxonomies: map[string]string{
					"category": "categories",
					"tag":      "tags",
					"series":   "series",
				},
				Menu: map[string][]MenuItem{
					"main": {
						{Name: "Tags", URL: "tags/", Weight: 10},
					},
				},
			},
		},
		Outputs: map[string][]string{
			"home": {"HTML", "RSS", "JSON"},
		},
		Params: ParamsConfig{
			Env:          "production",
			Description:  "description",
			Author:       "author",
			DefaultTheme: "auto",
			ProfileMode: ProfileModeConfig{
				Enabled: false,
			},
			HomeInfoParams: HomeInfoParamsConfig{
				Title:   "title",
				Content: "content",
			},
			SocialIcons: []SocialIconConfig{},
			EditPost:    EditPostConfig{},
		},
		Markup: MarkupConfig{
			Goldmark: GoldmarkConfig{
				Renderer: RendererConfig{
					Unsafe: true,
				},
			},
			Highlight: HighlightConfig{
				NoClasses: false,
			},
		},
		Services: ServicesConfig{
			Instagram: ServiceConfig{
				DisableInlineCSS: true,
			},
			Twitter: ServiceConfig{
				DisableInlineCSS: true,
			},
		},
	}
}
