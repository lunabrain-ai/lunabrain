import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import './editor.css';

export const Editor = () => {
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            BulletList.configure({
                // HTMLAttributes: {
                //     class: 'list-disc',
                // },
            }),
            ListItem,
        ],
        content: '<ul><li>Test</li></ul>',
        editorProps: {
            handleKeyDown: (view, event) => {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    if (editor === null) {
                        return false;
                    }
                    event.preventDefault();
                    if (event.shiftKey) {
                        editor.chain().focus().liftListItem('listItem').run();
                    } else {
                        editor.chain().focus().sinkListItem('listItem').run();
                    }
                    return true;
                }
                return false;
            },
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editor) {
            console.log(editor.getHTML());
        }
    };

    return (
        <div>
            {editor && <EditorContent editor={editor} />}
        </div>
    );
};
