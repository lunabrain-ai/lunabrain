import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
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
import {Editable, ReactEditor, Slate, useFocused, useSelected, withReact} from 'slate-react'
import {BulletedListElement, CustomEditor, MentionElement} from './custom-types'
import isHotkey from 'is-hotkey'
import {serialize} from "@/util/slate";
import {Stack, TextField} from "@fluentui/react";
import {Badge, Button, Toolbar, ToolbarProps, ToolbarRadioButton, ToolbarRadioGroup} from "@fluentui/react-components";
import {BrainCircuit24Regular, Folder24Regular, TextT24Regular, Link24Regular, MusicNote224Regular} from "@fluentui/react-icons";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {textContent, urlContent} from "@/extension/util";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Portal} from "@/components/Editor/Components";
import {FileSelect} from "@/components/FileSelect";
import {VideoPlayer} from "@/components/VideoPlayer";
import {FileUpload} from "@/components/FileUpload";

const SHORTCUTS: Record<string, string> = {
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

const insertMention = (editor: CustomEditor, character: string) => {
    const mention: MentionElement = {
        type: 'mention',
        character,
        children: [{ text: '' }],
    }
    Transforms.insertNodes(editor, mention)
    Transforms.move(editor)
}

const withMentions = (editor: CustomEditor) => {
    const { isInline, isVoid, markableVoid } = editor

    editor.isInline = (element) => {
        return element.type === 'mention' ? true : isInline(element)
    }

    editor.isVoid = (element) => {
        return element.type === 'mention' ? true : isVoid(element)
    }

    editor.markableVoid = (element) => {
        return element.type === 'mention' || markableVoid(element)
    }

    return editor
}


export const MarkdownEditor: React.FC<{ initial?: Descendant[] }> = ({}) => {
    const {loadContent, content, selectedContent, tags} = useProjectContext();
    const ref = useRef<HTMLDivElement | null>()

    const [text, setText] = useState<string>('');
    const [currentInputType, setCurrentInputType] = useState<'text'|'url'|'file'>('text');

    const renderElement = useCallback((props: JSX.IntrinsicAttributes & { attributes: any; children: any; element: any; }) =>
        <Element {...props} />, [])
    const editor = useMemo(
        () => withMentions(withShortcuts(withReact(withHistory(createEditor())))),
        []
    )

    const initialValue = useMemo(
        () =>
            JSON.parse(localStorage.getItem('content') || 'null') || [{
                type: 'bulleted-list',
                children: [{
                    type: 'list-item',
                    children: [{ text: '' }],
                }],
            }],
        []
    )

    const [target, setTarget] = useState<Range | null>()
    const [index, setIndex] = useState(0)
    const [search, setSearch] = useState('')

    const chars = tags.map(t => t.name).filter(c =>
        c.toLowerCase().startsWith(search.toLowerCase())
    ).slice(0, 10)

    const onKeyDown = useCallback(
        (event: { key: any; preventDefault: () => void; }) => {
            switch (event.key) {
                case 'Tab':
                    event.preventDefault()
            }
            if (target && chars.length > 0) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault()
                        const prevIndex = index >= chars.length - 1 ? 0 : index + 1
                        setIndex(prevIndex)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        const nextIndex = index <= 0 ? chars.length - 1 : index - 1
                        setIndex(nextIndex)
                        break
                    case 'Tab':
                    case 'Enter':
                        event.preventDefault()
                        Transforms.select(editor, target)
                        insertMention(editor, chars[index])
                        setTarget(null)
                        break
                    case 'Escape':
                        event.preventDefault()
                        setTarget(null)
                        break
                }
            }
        },
        [chars, editor, index, target]
    )

    const handleDOMBeforeInput = useCallback(
        (e: InputEvent) => {
            queueMicrotask(() => {
                const pendingDiffs = ReactEditor.androidPendingDiffs(editor)

                const scheduleFlush = pendingDiffs?.some(({diff, path}) => {
                    if (!diff.text.endsWith(' ')) {
                        return false
                    }

                    const {text} = SlateNode.leaf(editor, path)
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
        {name, checkedItems}
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

    useEffect(() => {
        if (target && chars.length > 0 && ref.current) {
            const el = ref.current
            const domRange = ReactEditor.toDOMRange(editor, target)
            const rect = domRange.getBoundingClientRect()
            el.style.top = `${rect.top + window.pageYOffset + 24}px`
            el.style.left = `${rect.left + window.pageXOffset}px`
        }
    }, [chars.length, editor, index, search, target])

    const insertText = (text: string) => {
        Transforms.insertText(editor, text)
    }

    const getInputType = () => {
        if (currentInputType === 'text') {
            return <Editable
                style={{height: '100%', maxHeight: '100%', overflowY: 'auto'}}
                onDOMBeforeInput={handleDOMBeforeInput}
                onKeyDown={onKeyDown}
                renderElement={renderElement}
                placeholder="Write some markdown..."
                spellCheck
                autoFocus
            />
        }
        if (currentInputType === 'url') {
            return <TextField
                value={text}
                onChange={(e, v) => {
                    setText(v || '');
                }}
                placeholder="Enter a URL"
            />
        }
        if (currentInputType === 'file') {
            return (
                <FileUpload />
            )
        }
        return null;
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
                    if (value.length === 1 && value[0].type === 'paragraph' && value[0].children.length === 1 && value[0].children[0].type === 'text') {
                        //@ts-ignore
                        setText(value[0].children[0].text)
                    }
                }

                const { selection } = editor
                if (selection && Range.isCollapsed(selection)) {
                    const [start] = Range.edges(selection)
                    const wordBefore = Editor.before(editor, start, { unit: 'word' })
                    const before = wordBefore && Editor.before(editor, wordBefore)
                    const beforeRange = before && Editor.range(editor, before, start)
                    const beforeText = beforeRange && Editor.string(editor, beforeRange)
                    const beforeMatch = beforeText && beforeText.match(/^#(\w+)$/)
                    const after = Editor.after(editor, start)
                    const afterRange = Editor.range(editor, start, after)
                    const afterText = Editor.string(editor, afterRange)
                    const afterMatch = afterText.match(/^(\s|$)/)

                    if (beforeMatch && afterMatch) {
                        setTarget(beforeRange)
                        setSearch(beforeMatch[1])
                        setIndex(0)
                        return
                    }
                }
                setTarget(null)
            }}
        >
            <Stack>
                <Stack.Item>
                    {getInputType()}
                    {target && chars.length > 0 && (
                        <Portal>
                            <div
                                ref={ref}
                                style={{
                                    top: '-9999px',
                                    left: '-9999px',
                                    position: 'absolute',
                                    zIndex: 1,
                                    padding: '3px',
                                    background: 'white',
                                    borderRadius: '4px',
                                    boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                                }}
                                data-cy="mentions-portal"
                            >
                                {chars.map((char, i) => (
                                    <div
                                        key={char}
                                        onClick={() => {
                                            Transforms.select(editor, target)
                                            insertMention(editor, char)
                                            setTarget(null)
                                        }}
                                        style={{
                                            padding: '1px 3px',
                                            borderRadius: '3px',
                                            background: i === index ? '#B4D5FF' : 'transparent',
                                        }}
                                    >
                                        {char}
                                    </div>
                                ))}
                            </div>
                        </Portal>
                    )}
                </Stack.Item>
                {selectedContent.length > 0 && (
                    <Stack.Item>
                        Commenting on {selectedContent.map(c => c)}
                    </Stack.Item>
                )}
                <Stack.Item>
                    <Stack horizontal horizontalAlign={'space-between'} tokens={{childrenGap: 3}}>
                        <Stack.Item>
                            <Button
                                onClick={() => {
                                    setCurrentInputType('text');
                                }}
                                aria-label="Text"
                                name="textOptions"
                                icon={<TextT24Regular/>}
                            />
                            <Button
                                onClick={() => {
                                    setCurrentInputType('url');
                                }}
                                aria-label="Link"
                                name="textOptions"
                                icon={<Link24Regular/>}
                            />
                            <Button
                                onClick={() => {
                                    setCurrentInputType('file');
                                }}
                                aria-label="file"
                                name="textOptions"
                                value="file"
                                icon={<Folder24Regular/>}
                            />
                            <Button
                                onClick={() => {
                                    // setCurrentInputType('');
                                }}
                                aria-label="prompt"
                                name="textOptions"
                                value="prompt"
                                icon={<BrainCircuit24Regular/>}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Button onClick={() => {
                                // TODO breadchris I am not sure how to save different types of content
                                if (currentInputType === 'text') {
                                    void saveText(serialize(editor));
                                }
                                if (currentInputType === 'url') {
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

const withShortcuts = (editor: CustomEditor) => {
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
                    // @ts-ignore
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

const Mention = ({ attributes, character }) => {
    const selected = useSelected()
    const focused = useFocused()
    return (
        <Badge
            {...attributes}
            contentEditable={false}
            data-cy={`mention-${character.replace(' ', '-')}`}
        >
      #{character}
        </Badge>
    )
}

const Element: React.FC<{attributes: any, children: any, element: any}> = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'mention':
            return <Mention {...attributes} character={element.character}>{children}</Mention>
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