import React, {useCallback, useMemo, useState} from 'react'
import {
    createEditor,
    Descendant,
    Editor,
    Element as SlateElement,
    Node as SlateNode,
    Point,
    Range,
    Transforms,
} from 'slate'
import { Content } from '@/rpc/content/content_pb';
import { withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { BulletedListElement } from './custom-types'
import isHotkey from 'is-hotkey'
import {serialize} from "@/util/slate";
import {Stack, TextField} from "@fluentui/react";
import {Button, Toolbar, ToolbarProps, ToolbarRadioButton, ToolbarRadioGroup} from "@fluentui/react-components";
import {BrainCircuit24Regular, TextT24Regular, Link24Regular, MusicNote224Regular} from "@fluentui/react-icons";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {textContent, urlContent} from "@/extension/util";
import {useProjectContext} from "@/providers/ProjectProvider";

const SHORTCUTS = {
    '*': 'list-item',
    '-': 'list-item',
    '+': 'list-item',
    '>': 'block-quote',
    '#': 'heading-one',
    '##': 'heading-two',
    '###': 'heading-three',
    '####': 'heading-four',
    '#####': 'heading-five',
    '######': 'heading-six',
}

const useOnKeydown = (editor: Editor) => {
    const onKeyDown: React.KeyboardEventHandler = useCallback(
        e => {
            if (isHotkey('tab', e)) {
                // handle tab key, insert spaces
                e.preventDefault()

                Editor.insertText(editor, '  ')
            }
        },
        [editor]
    )

    return onKeyDown
}

export const MarkdownEditor: React.FC<{initial?: Descendant[]}> = ({
}) => {
    const { loadContent } = useProjectContext();

    const [text, setText] = useState<string>('');
    const [currentInputType, setCurrentInputType] = useState<string>('text');

    const renderElement = useCallback(props => <Element {...props} />, [])
    const editor = useMemo(
        () => withShortcuts(withReact(withHistory(createEditor()))),
        []
    )
    const initialValue = useMemo(
        () =>
            JSON.parse(localStorage.getItem('content') || 'null') || [],
        []
    )

    const handleDOMBeforeInput = useCallback(
        (e: InputEvent) => {
            queueMicrotask(() => {
                const pendingDiffs = ReactEditor.androidPendingDiffs(editor)

                const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
                    if (!diff.text.endsWith(' ')) {
                        return false
                    }

                    const { text } = SlateNode.leaf(editor, path)
                    const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1)
                    if (!(beforeText in SHORTCUTS)) {
                        return
                    }

                    const blockEntry = Editor.above(editor, {
                        at: path,
                        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
                    })
                    if (!blockEntry) {
                        return false
                    }

                    const [, blockPath] = blockEntry
                    return Editor.isStart(editor, Editor.start(editor, path), blockPath)
                })

                if (scheduleFlush) {
                    ReactEditor.androidScheduleFlush(editor)
                }
            })
        },
        [editor]
    )

    const onChange: ToolbarProps["onCheckedValueChange"] = (
        e,
        { name, checkedItems }
    ) => {
        setCurrentInputType(checkedItems[0]);
    };

    const saveContent = async (content: Content) => {
        try {
            const resp = await contentService.save({
                content: content,
                related: []
            });
            console.log(resp);
            toast.success('Saved content');
            void loadContent();
        } catch (e) {
            toast.error('Failed to save content');
            console.error('failed to save', e)
        }
    }

    const saveURL = async (url: string) => {
        const u = new URL(url);
        await saveContent(urlContent(url, ['app/input']));
    }

    const saveText = async (text: string) => {
        await saveContent(textContent(text, ['app/input']));
        void loadContent();
    }

    return (
        <Slate
            editor={editor}
            initialValue={initialValue}
            onChange={(value: Descendant[]) => {
                const isAstChange = editor.operations.some(
                    (op: { type: string }) => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    // Save the value to Local Storage.
                    const content = JSON.stringify(value)
                    localStorage.setItem('content', content)
                    //@ts-ignore
                    if (value.length === 1 && value[0].type === 'paragraph') {
                        //@ts-ignore
                        setText(value[0].children[0].text)
                    }
                }
            }}
        >
            <Stack>
                <Stack.Item>
                    <Editable
                        style={{height: '100%', maxHeight: '100%', overflowY: 'auto'}}
                        onDOMBeforeInput={handleDOMBeforeInput}
                        renderElement={renderElement}
                        placeholder="Write some markdown..."
                        spellCheck
                        autoFocus
                    />
                </Stack.Item>
                <Stack.Item>
                    <Stack horizontal horizontalAlign={'space-between'} tokens={{childrenGap: 3}}>
                        <Stack.Item>
                            <Toolbar
                                aria-label="with Radio Buttons"
                                defaultCheckedValues={{
                                    textOptions: ["text"],
                                }}
                                onCheckedValueChange={onChange}
                            >
                                <ToolbarRadioGroup>
                                    <ToolbarRadioButton
                                        aria-label="Text"
                                        name="textOptions"
                                        value="text"
                                        icon={<TextT24Regular />}
                                    />
                                    <ToolbarRadioButton
                                        aria-label="Link"
                                        name="textOptions"
                                        value="link"
                                        icon={<Link24Regular />}
                                    />
                                    <ToolbarRadioButton
                                        aria-label="prompt"
                                        name="textOptions"
                                        value="prompt"
                                        icon={<BrainCircuit24Regular />}
                                    />
                                </ToolbarRadioGroup>
                            </Toolbar>
                        </Stack.Item>
                        <Stack.Item>
                            <Button onClick={() => {
                                // TODO breadchris I am not sure how to save different types of content
                                if (currentInputType === 'text') {
                                    void saveText(serialize(editor));
                                }
                                if (currentInputType === 'link') {
                                    void saveURL(text);
                                }
                            }}>Save</Button>
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </Slate>
    )
}

const withShortcuts = editor => {
    const { deleteBackward, insertText } = editor

    editor.insertText = text => {
        const { selection } = editor

        if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
            const { anchor } = selection
            const block = Editor.above(editor, {
                match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
            })
            const path = block ? block[1] : []
            const start = Editor.start(editor, path)
            const range = { anchor, focus: start }
            const beforeText = Editor.string(editor, range) + text.slice(0, -1)
            const type = SHORTCUTS[beforeText]

            if (type) {
                Transforms.select(editor, range)

                if (!Range.isCollapsed(range)) {
                    Transforms.delete(editor)
                }

                const newProperties: Partial<SlateElement> = {
                    type,
                }
                Transforms.setNodes<SlateElement>(editor, newProperties, {
                    match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
                })

                if (type === 'list-item') {
                    const list: BulletedListElement = {
                        type: 'bulleted-list',
                        children: [],
                    }
                    Transforms.wrapNodes(editor, list, {
                        match: n =>
                            !Editor.isEditor(n) &&
                            SlateElement.isElement(n) &&
                            n.type === 'list-item',
                    })
                }

                return
            }
        }
        insertText(text)
    }

    editor.deleteBackward = (...args) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const match = Editor.above(editor, {
                match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
            })

            if (match) {
                const [block, path] = match
                const start = Editor.start(editor, path)

                if (
                    !Editor.isEditor(block) &&
                    SlateElement.isElement(block) &&
                    block.type !== 'paragraph' &&
                    Point.equals(selection.anchor, start)
                ) {
                    const newProperties: Partial<SlateElement> = {
                        type: 'paragraph',
                    }
                    Transforms.setNodes(editor, newProperties)

                    if (block.type === 'list-item') {
                        Transforms.unwrapNodes(editor, {
                            match: n =>
                                !Editor.isEditor(n) &&
                                SlateElement.isElement(n) &&
                                n.type === 'bulleted-list',
                            split: true,
                        })
                    }

                    return
                }
            }

            deleteBackward(...args)
        }
    }

    return editor
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        default:
            return <p {...attributes}>{children}</p>
    }
}