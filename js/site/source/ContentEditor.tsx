import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useEditor, EditorContent, Editor, BubbleMenu} from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import './editor.css';
import {useContentEditor, useSources, useVoice} from "@/source/state";
import {Content, GRPCTypeInfo, Post, Section, Site, File} from "@/rpc/content/content_pb";
import {
    AdjustmentsHorizontalIcon,
    MicrophoneIcon,
    PaperAirplaneIcon,
    PlusIcon,
    StopIcon
} from "@heroicons/react/24/outline";
import {contentService, projectService} from "@/service";
import toast from "react-hot-toast";
import { RichTextLink } from './rich-text-links';
import {AddTagBadge} from "@/tag/AddTagBadge";
import {URLEditor} from "@/source/URLEditor";
import History from '@tiptap/extension-history';
import {Form, formControlAtom, useProtoForm} from "@/form/Form";
import {Provider, useAtom} from "jotai";
import {useForm} from "react-hook-form";
import {cleanObject} from "@/util/form";
import {FileEditor} from "@/source/editors/FileEditor";
import {SiteEditor} from "@/source/editors/SiteEditor";
import {ChatGPTConversationEditor} from "@/source/editors/ChatGPTConversationEditor";
import {commands} from "@/source/TiptapCommands";
import {Bold} from "@tiptap/extension-bold";
import {Italic} from "@tiptap/extension-italic";
import {Strike} from "@tiptap/extension-strike";

export const ContentEditor: React.FC<{}> = ({}) => {
    const settingsModal = useRef(null);
    const { editedContent: content, editContent, selectedContent } = useContentEditor();
    const { getSources } = useSources();
    const [formControl, setFormControl] = useAtom(formControlAtom);
    const {fields, loadFormTypes} = useProtoForm();

    const fc = useForm();
    const { setValue } = fc;
    const abortControllerRef = useRef<AbortController|undefined>(undefined);

    // TODO breadchris this will become problematic with multiple forms on the page, need provider
    useEffect(() => {
        void loadFormTypes();
        setFormControl(fc);
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        // anytime the content changes outside of this editor, update the editor
        if (content) {
            setValue('data', content.toJson() as any);

            // TODO breadchris we probably want to have this, but it causes the editor to lose focus
            // if (editor) {
            //     editor.commands.setContent(getContent(content));
            // }
        }
        // editContent(new Content({
        //     type: {
        //         case: 'post',
        //         value: {
        //             title: '',
        //             content: localStorage.getItem('editorContent') || '',
        //         }
        //     },
        // }));
    }, [content]);

    useEffect(() => {
        if (selectedContent) {
            setValue('data', selectedContent.toJson() as any);

            // TODO breadchris we probably want to have this, but it causes the editor to lose focus
            if (editor) {
                editor.commands.setContent(getContent(selectedContent));
            }
            editContent(selectedContent);
        }
    }, [selectedContent]);

    const addTag = async (tag: string) => {
        if (!content) {
            return;
        }
        editContent(new Content({
            ...content,
            tags: [...content.tags, tag],
        }));
    }

    const removeTag = async (tag: string) => {
        if (!content) {
            return;
        }
        editContent(new Content({
            ...content,
            tags: content.tags.filter((t) => t !== tag),
        }));
    }

    const inferFromSelectedText = async (prompt: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            const res = contentService.infer({
                prompt,
            }, {
                timeoutMs: undefined,
                signal: controller.signal,
            })
            for await (const exec of res) {
                editor?.chain().focus().insertContent(exec.text || '').run();
            }
        } catch (e: any) {
            toast.error(e.message);
            console.log(e);
        } finally {
            abortControllerRef.current = undefined;
        }
    }

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            BulletList,
            ListItem,
            RichTextLink,
            Bold,
            Italic,
            Strike,
            History.configure({
                depth: 100,
            }),
        ],
        onUpdate: ({ editor }) => {
            localStorage.setItem('editorContent', editor.getHTML());
            if (content) {
                switch (content.type.case) {
                    case 'post':
                        content.type.value.content = editor?.getHTML() || '';
                        editContent(new Content({
                            ...content,
                            type: {
                                case: 'post',
                                value: content.type.value,
                            }
                        }));
                        break;
                }
            }
        },
        content: getContent(content),
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

    const contentFromForm = (): Content|undefined => {
        if (!formControl) {
            return undefined;
        }
        const data = cleanObject(formControl.getValues().data);
        try {
            return Content.fromJson(data);
        } catch (e) {
            console.error('failed to parse content', e, 'data', cleanObject(data));
            return content;
        }
        // TODO breadchris the editor should have ui controls in protobuf to set this
    }

    const onSubmit = async () => {
        try {
            // TODO breadchris save content to group
            const resp = await contentService.save({
                content: contentFromForm(),
                related: []
            });
            void getSources();
            toast.success('Saved content');
        } catch (e) {
            toast.error('Failed to save content');
            console.error('failed to save', e)
        }
    }

    const onStop = () => {
        abortControllerRef.current?.abort();
    }

    const resetContent = () => {
        if (editor) {
            editor.commands.setContent('');
        }
    }

    return (
        <div>
            <div className={""}>
                {editor && <ContentTypeEditor content={content} onUpdate={editContent} editor={editor} />}
                {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <button
                        onClick={() => {
                            const { view, state } = editor
                            const { from, to } = view.state.selection
                            const text = state.doc.textBetween(from, to, '')
                            editor.commands.setTextSelection({from: to, to: to});
                            editor.commands.enter();
                            if (text) {
                                void inferFromSelectedText(text)
                            }
                        }}
                        className={'btn ' + editor.isActive('bold') ? 'is-active' : ''}
                    >
                        ai
                    </button>
                </BubbleMenu>}
                <dialog id="my_modal_1" className="modal" ref={settingsModal}>
                    <div className="modal-box">
                        {fields && <Form fields={fields} />}
                        <form method="dialog">
                            <div className="modal-action">
                                <button className="btn" onClick={() => {
                                    editContent(contentFromForm());
                                }}>save</button>
                            </div>
                        </form>
                    </div>
                </dialog>
            </div>
            <div className={"flex justify-between w-full"}>
                <div className={"flex flex-row space-x-2"}>
                    <AddTagBadge onNewTag={addTag} />
                    <span>
                        <button className={"btn"} onClick={() => settingsModal.current?.showModal()}>
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </button>
                    </span>
                    {abortControllerRef.current && (
                        <button className={"btn"} onClick={onStop}>
                            <StopIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
                <button className={"btn"} onClick={onSubmit}>
                    <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </div>
            <span>
                {content?.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm" onClick={() => removeTag(tag)}>{tag}</span>
                ))}
            </span>
        </div>
    );
};

// TODO breadchris useful for when OS does not support voice input, browsers don't have great support
const VoiceInputButton: React.FC<{onText: (text: string) => void}> = ({onText}) => {
    const { start, stop, recording } = useVoice();
    return (
        <button className={"btn"} onClick={recording ? () => {
            stop();
        } : () => {
            start(onText);
        }}>
            {recording ? <StopIcon className={"h-6 w-6"} /> : <MicrophoneIcon className="h-6 w-6" />}
        </button>
    )
}

const ContentTypeEditor: React.FC<{
    content: Content|undefined,
    onUpdate: (content: Content) => void,
    editor: Editor,
}> = ({content, editor, onUpdate}) => {
    const getContent = (content: Content|undefined) => {
        if (content) {
            switch (content.type.case) {
                case 'chatgptConversation':
                    return <ChatGPTConversationEditor
                        className={'h-screen overflow-y-auto space-y-2'}
                        conversation={content.type.value} onUpdate={(c) => {
                        onUpdate(new Content({
                            ...content,
                            type: {
                                case: 'chatgptConversation',
                                value: c,
                            }
                        }));
                    }} />;
                case 'site':
                    return (
                        <SiteEditor site={content.type.value} onUpdate={(s) => {
                            onUpdate(new Content({
                                ...content,
                                type: {
                                    case: 'site',
                                    value: s,
                                }
                            }));
                        }} />
                    )
                case 'post':
                    const p = content.type.value;
                    return (
                        <div className={"space-y-2"}>
                            <input type="text" value={p.title} onChange={(e) => {
                                onUpdate(new Content({
                                    ...content,
                                    type: {
                                        case: 'post',
                                        value: {
                                            ...p,
                                            title: e.target.value,
                                        }
                                    }
                                }));
                            }} placeholder="title" className="input w-full max-w-xs" />
                            <EditorContent className={"max-h-72 overflow-y-auto"} editor={editor} />
                        </div>
                    )
                case 'data':
                    const d = content.type.value;
                    switch (d.type.case) {
                        case 'file':
                            return <FileEditor id={content.id} file={d.type.value} onChange={(file) => {
                                onUpdate(new Content({
                                    ...content,
                                    type: {
                                        case: 'data',
                                        value: {
                                            ...content.type.value,
                                            type: {
                                                case: 'file',
                                                value: file,
                                            }
                                        }
                                    }
                                }));
                            }} />
                        case 'url':
                            const u = d.type.value;
                            return <URLEditor id={content.id} url={u.url} onChange={(url) => {
                                onUpdate(new Content({
                                    ...content,
                                    type: {
                                        case: 'data',
                                        value: {
                                            ...content.type.value,
                                            type: {
                                                case: 'url',
                                                value: {
                                                    ...u,
                                                    url: url,
                                                }
                                            }
                                        }
                                    }
                                }));
                            }} />
                    }
            }
        }
        return <EditorContent className={"max-h-72 overflow-y-auto"} editor={editor} />;
        return null;
    }
    return (
        <div>
            {getContent(content)}
        </div>
    );
}

const getContent = (content: Content|undefined) => {
    const msg = "don't think, write."
    if (!content) {
        return msg;
    }
    switch (content.type.case) {
        case 'post':
            return content.type.value.content;
        case 'data':
            const d = content.type.value;
            switch (d.type.case) {
                case 'text':
                    return d.type.value.data.toString();
            }
            break;
    }
    return msg;
}