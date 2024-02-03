export interface Conversation {
    title: string;
    create_time: number;
    update_time: number;
    mapping: { [key: string]: Node };
    moderation_results: any[]; // Replace 'any' with a more specific type if available
    current_node: string;
    plugin_ids: null; // Replace 'null' with the actual type if it can be something other than null
    conversation_id: string;
    conversation_template_id: null; // Replace 'null' with the actual type if it can be something other than null
    gizmo_id: null; // Replace 'null' with the actual type if it can be something other than null
    is_archived: boolean;
    safe_urls: any[]; // Replace 'any' with a more specific type if available
}

interface Node {
    id: string;
    message: Message | undefined;
    parent: string | undefined;
    children: string[];
}

interface Message {
    id: string;
    author: Author;
    create_time: number | undefined;
    update_time: number | undefined;
    content: TextContent | CodeContent | MultimodalContent | undefined;
    status: string;
    end_turn: boolean | undefined;
    weight: number;
    metadata: Metadata;
    recipient: string;
}

interface Author {
    role: string;
    name: string | undefined;
    metadata: any; // Replace 'any' with a more specific type if available
}

interface CodeContent {
    content_type: 'code';
    language: string;
    text: string;
}

interface TextContent {
    content_type: 'text';
    parts: string[];
}

interface MultimodalContent {
    content_type: 'multimodal_text';
    parts: ImageAsset[];
}

interface ImageAsset {
    content_type: 'image_asset_pointer';
    asset_pointer: string;
    size_bytes: number;
    width: number;
    height: number;
    fovea: number;
    metadata: Metadata;
}

interface Metadata {
    [key: string]: any;
}