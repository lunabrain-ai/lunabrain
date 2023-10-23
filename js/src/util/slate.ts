import { Descendant, Text } from 'slate';

export const serialize = (node: Descendant): string => {
    if (Text.isText(node)) {
        return node.text;
    }
    return node.children.map(serializeNode).join('\n');
}

const serializeNode = (node: Descendant): string => {
    if (Text.isText(node)) {
        return node.text;
    }

    const children = node.children.map(serializeNode).join('');

    switch (node.type) {
        case 'block-quote':
            return `> ${children}\n`;
        case 'paragraph':
            return `${children}\n`;
        case 'link':
            return `[${children}](${node.url})`;
        case 'bulleted-list':
            return `${children.replace(/^/gm, '* ')}`;
        default:
            return children;
    }
}
