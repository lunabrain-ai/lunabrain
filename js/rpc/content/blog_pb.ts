// @generated by protoc-gen-es v1.6.0 with parameter "target=ts"
// @generated from file content/blog.proto (package content, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message content.HugoConfig
 */
export class HugoConfig extends Message<HugoConfig> {
  /**
   * @generated from field: string publish_dir = 1;
   */
  publishDir = "";

  /**
   * @generated from field: string base_url = 2;
   */
  baseUrl = "";

  /**
   * @generated from field: string title = 3;
   */
  title = "";

  /**
   * @generated from field: int32 paginate = 4;
   */
  paginate = 0;

  /**
   * @generated from field: repeated string theme = 5;
   */
  theme: string[] = [];

  /**
   * @generated from field: bool enable_inline_shortcodes = 6;
   */
  enableInlineShortcodes = false;

  /**
   * @generated from field: bool enable_robots_txt = 7;
   */
  enableRobotsTxt = false;

  /**
   * @generated from field: bool build_drafts = 8;
   */
  buildDrafts = false;

  /**
   * @generated from field: bool build_future = 9;
   */
  buildFuture = false;

  /**
   * @generated from field: bool build_expired = 10;
   */
  buildExpired = false;

  /**
   * @generated from field: bool enable_emoji = 11;
   */
  enableEmoji = false;

  /**
   * @generated from field: bool pygments_use_classes = 12;
   */
  pygmentsUseClasses = false;

  /**
   * @generated from field: repeated string main_sections = 13;
   */
  mainSections: string[] = [];

  /**
   * @generated from field: content.MinifyConfig minify = 14;
   */
  minify?: MinifyConfig;

  /**
   * @generated from field: map<string, content.LanguageConfig> languages = 15;
   */
  languages: { [key: string]: LanguageConfig } = {};

  /**
   * @generated from field: map<string, content.repeated_string> outputs = 16;
   */
  outputs: { [key: string]: repeated_string } = {};

  /**
   * @generated from field: content.ParamsConfig params = 17;
   */
  params?: ParamsConfig;

  /**
   * @generated from field: content.MarkupConfig markup = 18;
   */
  markup?: MarkupConfig;

  /**
   * @generated from field: content.ServicesConfig services = 19;
   */
  services?: ServicesConfig;

  constructor(data?: PartialMessage<HugoConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.HugoConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "publish_dir", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "base_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "paginate", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: "theme", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 6, name: "enable_inline_shortcodes", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "enable_robots_txt", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 8, name: "build_drafts", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 9, name: "build_future", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 10, name: "build_expired", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 11, name: "enable_emoji", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 12, name: "pygments_use_classes", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 13, name: "main_sections", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 14, name: "minify", kind: "message", T: MinifyConfig },
    { no: 15, name: "languages", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: LanguageConfig} },
    { no: 16, name: "outputs", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: repeated_string} },
    { no: 17, name: "params", kind: "message", T: ParamsConfig },
    { no: 18, name: "markup", kind: "message", T: MarkupConfig },
    { no: 19, name: "services", kind: "message", T: ServicesConfig },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HugoConfig {
    return new HugoConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HugoConfig {
    return new HugoConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HugoConfig {
    return new HugoConfig().fromJsonString(jsonString, options);
  }

  static equals(a: HugoConfig | PlainMessage<HugoConfig> | undefined, b: HugoConfig | PlainMessage<HugoConfig> | undefined): boolean {
    return proto3.util.equals(HugoConfig, a, b);
  }
}

/**
 * @generated from message content.MinifyConfig
 */
export class MinifyConfig extends Message<MinifyConfig> {
  /**
   * @generated from field: bool disable_xml = 1;
   */
  disableXml = false;

  constructor(data?: PartialMessage<MinifyConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.MinifyConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "disable_xml", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MinifyConfig {
    return new MinifyConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MinifyConfig {
    return new MinifyConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MinifyConfig {
    return new MinifyConfig().fromJsonString(jsonString, options);
  }

  static equals(a: MinifyConfig | PlainMessage<MinifyConfig> | undefined, b: MinifyConfig | PlainMessage<MinifyConfig> | undefined): boolean {
    return proto3.util.equals(MinifyConfig, a, b);
  }
}

/**
 * @generated from message content.LanguageConfig
 */
export class LanguageConfig extends Message<LanguageConfig> {
  /**
   * @generated from field: string language_name = 1;
   */
  languageName = "";

  /**
   * @generated from field: int32 weight = 2;
   */
  weight = 0;

  /**
   * @generated from field: string title = 3;
   */
  title = "";

  /**
   * @generated from field: map<string, string> taxonomies = 4;
   */
  taxonomies: { [key: string]: string } = {};

  /**
   * @generated from field: map<string, content.repeated_menu_item> menu = 5;
   */
  menu: { [key: string]: repeated_menu_item } = {};

  /**
   * @generated from field: map<string, string> params = 6;
   */
  params: { [key: string]: string } = {};

  constructor(data?: PartialMessage<LanguageConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.LanguageConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "language_name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "weight", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 3, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "taxonomies", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
    { no: 5, name: "menu", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "message", T: repeated_menu_item} },
    { no: 6, name: "params", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LanguageConfig {
    return new LanguageConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LanguageConfig {
    return new LanguageConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LanguageConfig {
    return new LanguageConfig().fromJsonString(jsonString, options);
  }

  static equals(a: LanguageConfig | PlainMessage<LanguageConfig> | undefined, b: LanguageConfig | PlainMessage<LanguageConfig> | undefined): boolean {
    return proto3.util.equals(LanguageConfig, a, b);
  }
}

/**
 * @generated from message content.MenuItem
 */
export class MenuItem extends Message<MenuItem> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string url = 2;
   */
  url = "";

  /**
   * @generated from field: int32 weight = 3;
   */
  weight = 0;

  constructor(data?: PartialMessage<MenuItem>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.MenuItem";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "weight", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MenuItem {
    return new MenuItem().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MenuItem {
    return new MenuItem().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MenuItem {
    return new MenuItem().fromJsonString(jsonString, options);
  }

  static equals(a: MenuItem | PlainMessage<MenuItem> | undefined, b: MenuItem | PlainMessage<MenuItem> | undefined): boolean {
    return proto3.util.equals(MenuItem, a, b);
  }
}

/**
 * @generated from message content.EditPostConfig
 */
export class EditPostConfig extends Message<EditPostConfig> {
  /**
   * @generated from field: string url = 1;
   */
  url = "";

  /**
   * @generated from field: string text = 2;
   */
  text = "";

  /**
   * @generated from field: bool append_file_path = 3;
   */
  appendFilePath = false;

  constructor(data?: PartialMessage<EditPostConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.EditPostConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "text", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "append_file_path", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EditPostConfig {
    return new EditPostConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EditPostConfig {
    return new EditPostConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EditPostConfig {
    return new EditPostConfig().fromJsonString(jsonString, options);
  }

  static equals(a: EditPostConfig | PlainMessage<EditPostConfig> | undefined, b: EditPostConfig | PlainMessage<EditPostConfig> | undefined): boolean {
    return proto3.util.equals(EditPostConfig, a, b);
  }
}

/**
 * @generated from message content.AssetsConfig
 */
export class AssetsConfig extends Message<AssetsConfig> {
  /**
   * @generated from field: bool disable_hljs = 1;
   */
  disableHljs = false;

  constructor(data?: PartialMessage<AssetsConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.AssetsConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "disable_hljs", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): AssetsConfig {
    return new AssetsConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): AssetsConfig {
    return new AssetsConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): AssetsConfig {
    return new AssetsConfig().fromJsonString(jsonString, options);
  }

  static equals(a: AssetsConfig | PlainMessage<AssetsConfig> | undefined, b: AssetsConfig | PlainMessage<AssetsConfig> | undefined): boolean {
    return proto3.util.equals(AssetsConfig, a, b);
  }
}

/**
 * @generated from message content.MarkupConfig
 */
export class MarkupConfig extends Message<MarkupConfig> {
  /**
   * @generated from field: content.GoldmarkConfig goldmark = 1;
   */
  goldmark?: GoldmarkConfig;

  /**
   * @generated from field: content.HighlightConfig highlight = 2;
   */
  highlight?: HighlightConfig;

  constructor(data?: PartialMessage<MarkupConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.MarkupConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "goldmark", kind: "message", T: GoldmarkConfig },
    { no: 2, name: "highlight", kind: "message", T: HighlightConfig },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): MarkupConfig {
    return new MarkupConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): MarkupConfig {
    return new MarkupConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): MarkupConfig {
    return new MarkupConfig().fromJsonString(jsonString, options);
  }

  static equals(a: MarkupConfig | PlainMessage<MarkupConfig> | undefined, b: MarkupConfig | PlainMessage<MarkupConfig> | undefined): boolean {
    return proto3.util.equals(MarkupConfig, a, b);
  }
}

/**
 * @generated from message content.GoldmarkConfig
 */
export class GoldmarkConfig extends Message<GoldmarkConfig> {
  /**
   * @generated from field: content.RendererConfig renderer = 1;
   */
  renderer?: RendererConfig;

  constructor(data?: PartialMessage<GoldmarkConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.GoldmarkConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "renderer", kind: "message", T: RendererConfig },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GoldmarkConfig {
    return new GoldmarkConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GoldmarkConfig {
    return new GoldmarkConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GoldmarkConfig {
    return new GoldmarkConfig().fromJsonString(jsonString, options);
  }

  static equals(a: GoldmarkConfig | PlainMessage<GoldmarkConfig> | undefined, b: GoldmarkConfig | PlainMessage<GoldmarkConfig> | undefined): boolean {
    return proto3.util.equals(GoldmarkConfig, a, b);
  }
}

/**
 * @generated from message content.RendererConfig
 */
export class RendererConfig extends Message<RendererConfig> {
  /**
   * @generated from field: bool unsafe = 1;
   */
  unsafe = false;

  constructor(data?: PartialMessage<RendererConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.RendererConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "unsafe", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): RendererConfig {
    return new RendererConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): RendererConfig {
    return new RendererConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): RendererConfig {
    return new RendererConfig().fromJsonString(jsonString, options);
  }

  static equals(a: RendererConfig | PlainMessage<RendererConfig> | undefined, b: RendererConfig | PlainMessage<RendererConfig> | undefined): boolean {
    return proto3.util.equals(RendererConfig, a, b);
  }
}

/**
 * @generated from message content.HighlightConfig
 */
export class HighlightConfig extends Message<HighlightConfig> {
  /**
   * @generated from field: bool no_classes = 1;
   */
  noClasses = false;

  constructor(data?: PartialMessage<HighlightConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.HighlightConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "no_classes", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HighlightConfig {
    return new HighlightConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HighlightConfig {
    return new HighlightConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HighlightConfig {
    return new HighlightConfig().fromJsonString(jsonString, options);
  }

  static equals(a: HighlightConfig | PlainMessage<HighlightConfig> | undefined, b: HighlightConfig | PlainMessage<HighlightConfig> | undefined): boolean {
    return proto3.util.equals(HighlightConfig, a, b);
  }
}

/**
 * @generated from message content.ServicesConfig
 */
export class ServicesConfig extends Message<ServicesConfig> {
  /**
   * @generated from field: content.ServiceConfig instagram = 1;
   */
  instagram?: ServiceConfig;

  /**
   * @generated from field: content.ServiceConfig twitter = 2;
   */
  twitter?: ServiceConfig;

  constructor(data?: PartialMessage<ServicesConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ServicesConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "instagram", kind: "message", T: ServiceConfig },
    { no: 2, name: "twitter", kind: "message", T: ServiceConfig },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ServicesConfig {
    return new ServicesConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ServicesConfig {
    return new ServicesConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ServicesConfig {
    return new ServicesConfig().fromJsonString(jsonString, options);
  }

  static equals(a: ServicesConfig | PlainMessage<ServicesConfig> | undefined, b: ServicesConfig | PlainMessage<ServicesConfig> | undefined): boolean {
    return proto3.util.equals(ServicesConfig, a, b);
  }
}

/**
 * @generated from message content.ServiceConfig
 */
export class ServiceConfig extends Message<ServiceConfig> {
  /**
   * @generated from field: bool disable_inline_css = 1;
   */
  disableInlineCss = false;

  constructor(data?: PartialMessage<ServiceConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ServiceConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "disable_inline_css", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ServiceConfig {
    return new ServiceConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ServiceConfig {
    return new ServiceConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ServiceConfig {
    return new ServiceConfig().fromJsonString(jsonString, options);
  }

  static equals(a: ServiceConfig | PlainMessage<ServiceConfig> | undefined, b: ServiceConfig | PlainMessage<ServiceConfig> | undefined): boolean {
    return proto3.util.equals(ServiceConfig, a, b);
  }
}

/**
 * @generated from message content.repeated_string
 */
export class repeated_string extends Message<repeated_string> {
  /**
   * @generated from field: repeated string values = 1;
   */
  values: string[] = [];

  constructor(data?: PartialMessage<repeated_string>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.repeated_string";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "values", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): repeated_string {
    return new repeated_string().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): repeated_string {
    return new repeated_string().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): repeated_string {
    return new repeated_string().fromJsonString(jsonString, options);
  }

  static equals(a: repeated_string | PlainMessage<repeated_string> | undefined, b: repeated_string | PlainMessage<repeated_string> | undefined): boolean {
    return proto3.util.equals(repeated_string, a, b);
  }
}

/**
 * @generated from message content.repeated_menu_item
 */
export class repeated_menu_item extends Message<repeated_menu_item> {
  /**
   * @generated from field: repeated content.MenuItem items = 1;
   */
  items: MenuItem[] = [];

  constructor(data?: PartialMessage<repeated_menu_item>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.repeated_menu_item";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "items", kind: "message", T: MenuItem, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): repeated_menu_item {
    return new repeated_menu_item().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): repeated_menu_item {
    return new repeated_menu_item().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): repeated_menu_item {
    return new repeated_menu_item().fromJsonString(jsonString, options);
  }

  static equals(a: repeated_menu_item | PlainMessage<repeated_menu_item> | undefined, b: repeated_menu_item | PlainMessage<repeated_menu_item> | undefined): boolean {
    return proto3.util.equals(repeated_menu_item, a, b);
  }
}

/**
 * @generated from message content.ParamsConfig
 */
export class ParamsConfig extends Message<ParamsConfig> {
  /**
   * @generated from field: string env = 1;
   */
  env = "";

  /**
   * @generated from field: string description = 2;
   */
  description = "";

  /**
   * @generated from field: string author = 3;
   */
  author = "";

  /**
   * @generated from field: string default_theme = 4;
   */
  defaultTheme = "";

  /**
   * @generated from field: bool show_share_buttons = 5;
   */
  showShareButtons = false;

  /**
   * @generated from field: bool show_reading_time = 6;
   */
  showReadingTime = false;

  /**
   * @generated from field: bool display_full_lang_name = 7;
   */
  displayFullLangName = false;

  /**
   * @generated from field: bool show_post_nav_links = 8;
   */
  showPostNavLinks = false;

  /**
   * @generated from field: bool show_bread_crumbs = 9;
   */
  showBreadCrumbs = false;

  /**
   * @generated from field: bool show_code_copy_buttons = 10;
   */
  showCodeCopyButtons = false;

  /**
   * @generated from field: bool show_rss_button_in_section_term_list = 11;
   */
  showRssButtonInSectionTermList = false;

  /**
   * @generated from field: bool show_all_pages_in_archive = 12;
   */
  showAllPagesInArchive = false;

  /**
   * @generated from field: bool show_page_nums = 13;
   */
  showPageNums = false;

  /**
   * @generated from field: bool show_toc = 14;
   */
  showToc = false;

  /**
   * @generated from field: repeated string images = 15;
   */
  images: string[] = [];

  /**
   * @generated from field: content.ProfileModeConfig profile_mode = 16;
   */
  profileMode?: ProfileModeConfig;

  /**
   * @generated from field: content.HomeInfoParamsConfig home_info_params = 17;
   */
  homeInfoParams?: HomeInfoParamsConfig;

  /**
   * @generated from field: repeated content.SocialIconConfig social_icons = 18;
   */
  socialIcons: SocialIconConfig[] = [];

  /**
   * @generated from field: content.EditPostConfig edit_post = 19;
   */
  editPost?: EditPostConfig;

  /**
   * @generated from field: content.AssetsConfig assets = 20;
   */
  assets?: AssetsConfig;

  constructor(data?: PartialMessage<ParamsConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ParamsConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "env", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "author", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "default_theme", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "show_share_buttons", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "show_reading_time", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "display_full_lang_name", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 8, name: "show_post_nav_links", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 9, name: "show_bread_crumbs", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 10, name: "show_code_copy_buttons", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 11, name: "show_rss_button_in_section_term_list", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 12, name: "show_all_pages_in_archive", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 13, name: "show_page_nums", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 14, name: "show_toc", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 15, name: "images", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 16, name: "profile_mode", kind: "message", T: ProfileModeConfig },
    { no: 17, name: "home_info_params", kind: "message", T: HomeInfoParamsConfig },
    { no: 18, name: "social_icons", kind: "message", T: SocialIconConfig, repeated: true },
    { no: 19, name: "edit_post", kind: "message", T: EditPostConfig },
    { no: 20, name: "assets", kind: "message", T: AssetsConfig },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ParamsConfig {
    return new ParamsConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ParamsConfig {
    return new ParamsConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ParamsConfig {
    return new ParamsConfig().fromJsonString(jsonString, options);
  }

  static equals(a: ParamsConfig | PlainMessage<ParamsConfig> | undefined, b: ParamsConfig | PlainMessage<ParamsConfig> | undefined): boolean {
    return proto3.util.equals(ParamsConfig, a, b);
  }
}

/**
 * @generated from message content.ProfileModeConfig
 */
export class ProfileModeConfig extends Message<ProfileModeConfig> {
  /**
   * @generated from field: bool enabled = 1;
   */
  enabled = false;

  /**
   * @generated from field: string title = 2;
   */
  title = "";

  /**
   * @generated from field: string image_url = 3;
   */
  imageUrl = "";

  /**
   * @generated from field: string image_title = 4;
   */
  imageTitle = "";

  /**
   * @generated from field: repeated content.ButtonConfig buttons = 5;
   */
  buttons: ButtonConfig[] = [];

  constructor(data?: PartialMessage<ProfileModeConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ProfileModeConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "image_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "image_title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "buttons", kind: "message", T: ButtonConfig, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ProfileModeConfig {
    return new ProfileModeConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ProfileModeConfig {
    return new ProfileModeConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ProfileModeConfig {
    return new ProfileModeConfig().fromJsonString(jsonString, options);
  }

  static equals(a: ProfileModeConfig | PlainMessage<ProfileModeConfig> | undefined, b: ProfileModeConfig | PlainMessage<ProfileModeConfig> | undefined): boolean {
    return proto3.util.equals(ProfileModeConfig, a, b);
  }
}

/**
 * @generated from message content.ButtonConfig
 */
export class ButtonConfig extends Message<ButtonConfig> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string url = 2;
   */
  url = "";

  constructor(data?: PartialMessage<ButtonConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.ButtonConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ButtonConfig {
    return new ButtonConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ButtonConfig {
    return new ButtonConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ButtonConfig {
    return new ButtonConfig().fromJsonString(jsonString, options);
  }

  static equals(a: ButtonConfig | PlainMessage<ButtonConfig> | undefined, b: ButtonConfig | PlainMessage<ButtonConfig> | undefined): boolean {
    return proto3.util.equals(ButtonConfig, a, b);
  }
}

/**
 * @generated from message content.HomeInfoParamsConfig
 */
export class HomeInfoParamsConfig extends Message<HomeInfoParamsConfig> {
  /**
   * @generated from field: string title = 1;
   */
  title = "";

  /**
   * @generated from field: string content = 2;
   */
  content = "";

  constructor(data?: PartialMessage<HomeInfoParamsConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.HomeInfoParamsConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "content", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): HomeInfoParamsConfig {
    return new HomeInfoParamsConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): HomeInfoParamsConfig {
    return new HomeInfoParamsConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): HomeInfoParamsConfig {
    return new HomeInfoParamsConfig().fromJsonString(jsonString, options);
  }

  static equals(a: HomeInfoParamsConfig | PlainMessage<HomeInfoParamsConfig> | undefined, b: HomeInfoParamsConfig | PlainMessage<HomeInfoParamsConfig> | undefined): boolean {
    return proto3.util.equals(HomeInfoParamsConfig, a, b);
  }
}

/**
 * @generated from message content.SocialIconConfig
 */
export class SocialIconConfig extends Message<SocialIconConfig> {
  /**
   * @generated from field: string name = 1;
   */
  name = "";

  /**
   * @generated from field: string title = 2;
   */
  title = "";

  /**
   * @generated from field: string url = 3;
   */
  url = "";

  constructor(data?: PartialMessage<SocialIconConfig>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "content.SocialIconConfig";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SocialIconConfig {
    return new SocialIconConfig().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SocialIconConfig {
    return new SocialIconConfig().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SocialIconConfig {
    return new SocialIconConfig().fromJsonString(jsonString, options);
  }

  static equals(a: SocialIconConfig | PlainMessage<SocialIconConfig> | undefined, b: SocialIconConfig | PlainMessage<SocialIconConfig> | undefined): boolean {
    return proto3.util.equals(SocialIconConfig, a, b);
  }
}

