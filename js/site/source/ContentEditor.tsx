/// <reference path="../../../node_modules/highlight.js/types/index.d.ts" />
import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useEditor, EditorContent, Editor, BubbleMenu, ReactNodeViewRenderer} from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";
import './editor.css';
import {editorContent, useContentEditor, useSources, useVoice} from "@/source/state";
import {Content, GRPCTypeInfo, Post, Section, Site, File} from "@/rpc/content/content_pb";
import {
    AdjustmentsHorizontalIcon,
    MicrophoneIcon,
    PaperAirplaneIcon,
    PlusIcon,
    StopIcon,
    TagIcon
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
import {Bold} from "@tiptap/extension-bold";
import {Italic} from "@tiptap/extension-italic";
import {Strike} from "@tiptap/extension-strike";
import {ContentDrawer} from "@/source/ContentDrawer";
import {postContent, siteContent, urlContent} from "../../extension/util";
import {Blockquote} from "@tiptap/extension-blockquote";
import {Heading} from "@tiptap/extension-heading";
import {CodeBlock} from "@tiptap/extension-code-block";
import {Code} from "@tiptap/extension-code";
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import go from 'highlight.js/lib/languages/go'
import {createLowlight} from 'lowlight'
import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
import {CodeBlockComponent} from "@/source/CodeBlockComponent";
import {Dropcursor} from "@tiptap/extension-dropcursor";
import {ResizeImage} from "@/source/ResizeImage";
import {Splide, SplideSlide} from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import {Modal} from "@/components/modal";
import {FilteredTagInput} from "@/tag/FilteredTagInput";

const lowlight = createLowlight();

lowlight.register({html})
lowlight.register({css})
lowlight.register({js})
lowlight.register({ts})
lowlight.register({go})

export const ContentEditor: React.FC<{}> = ({}) => {
    const settingsModal = useRef(null);
    const {
        editedContent: content,
        editContent, selectedContent,
        newContent,
        setNewContent,
        changeContent
    } = useContentEditor();
    const { getSources } = useSources();
    const [formControl, setFormControl] = useAtom(formControlAtom);
    const {fields, loadFormTypes} = useProtoForm();

    const fc = useForm();
    const { setValue } = fc;
    const abortControllerRef = useRef<AbortController|undefined>(undefined);

    const [relatedContent, setRelatedContent] = useState<string[]>([]);

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
        }
    }, [content]);

    const setEditorContent = (content: Content) => {
        setTimeout(() => {
            if (editor) {
                editor.commands.setContent(getContent(content));
            }
        });
    };

    useEffect(() => {
        // handle editor updates independently since content will be updated every editor change
        if (newContent) {
            if (content) {
                setEditorContent(content);
            }
            setNewContent(false);
        }
    }, [newContent, content]);

    useEffect(() => {
        if (selectedContent) {
            setValue('data', selectedContent.toJson() as any);

            // TODO breadchris we probably want to have this, but it causes the editor to lose focus
            setEditorContent(selectedContent);
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
                // for every newline in the response, add a new paragraph. split on newline and then
                // enter after each line
                const parts = exec.text?.split('\n');
                if (parts) {
                    for (let i = 0; i < parts.length; i++) {
                        editor?.chain().focus().insertContent(parts[i]).run();
                        if (i < parts.length - 1) {
                            editor?.chain().focus().enter().run();
                        }
                    }
                }
            }
        } catch (e: any) {
            toast.error(e.message);
            console.log(e);
        } finally {
            abortControllerRef.current = undefined;
        }
    }

    // https://vikramthyagarajan.medium.com/how-to-build-a-notion-like-text-editor-in-react-and-tiptap-7f394c36ed9d
    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Blockquote,
            Heading,
            Code,
            ResizeImage,
            Dropcursor,
            CodeBlockLowlight
                .extend({
                    addNodeView() {
                        return ReactNodeViewRenderer(CodeBlockComponent)
                    },
                })
                .configure({ lowlight }),
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
            localStorage.setItem(editorContent, editor.getHTML());
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

    const addImage = () => {
        const url = window.prompt('URL')

        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
            setRelatedContent([...relatedContent, url]);
        }
    }

    const getSelectedText = () => {
        if (!editor) {
            return '';
        }
        const { view, state } = editor
        const { from, to } = view.state.selection
        const text = state.doc.textBetween(from, to, '')
        // TODO breadchris puts cursor at end of selection, newline
        editor.commands.setTextSelection({from: to, to: to});
        editor.commands.enter();
        return text;
    }

    return (
        <div className={"sm:mx-4 lg:mx-16"}>
            <div className="mb-32 flex flex-col">
                <div className="flex flex-row justify-between">
                    <span>
                        {content?.tags.map((tag) => (
                            <span key={tag} className="badge badge-outline badge-sm" onClick={() => removeTag(tag)}>{tag}</span>
                        ))}
                    </span>
                    <button onClick={() => settingsModal.current?.showModal()}>
                        <AdjustmentsHorizontalIcon className="h-6 w-6" />
                    </button>
                </div>
                {editor && <ContentTypeEditor content={content} onUpdate={editContent} editor={editor} />}
                {/*<Splide aria-label="referenced content" options={{*/}
                {/*    perPage: 3,*/}
                {/*}}>*/}
                {/*    {relatedContent.map((src) => (*/}
                {/*        <SplideSlide>*/}
                {/*            <img src={src} />*/}
                {/*        </SplideSlide>*/}
                {/*    ))}*/}
                {/*</Splide>*/}
                {editor && <BubbleMenu className={"space-x-2"} editor={editor} tippyOptions={{ duration: 100 }}>
                    <button
                        onClick={() => {
                            const text = getSelectedText();
                            if (text) {
                                void inferFromSelectedText(text)
                            }
                        }}
                        className={'btn ' + editor.isActive('bold') ? 'is-active' : ''}
                    >
                        ai
                    </button>
                    <PromptBubble onPrompt={(text) => {
                        const selected = getSelectedText();
                        void inferFromSelectedText(selected + ' ' + text);
                    }} />
                    <button
                        onClick={() => {
                            // set selection to be CodeBlockLowlight
                            editor.chain().focus().toggleCode().run();
                        }}
                    >
                        code
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
            <BottomNav
                changeContent={changeContent}
                addImage={addImage}
                addTag={addTag}
                onSend={onSubmit}
                onStop={onStop}
                actionRunning={abortControllerRef.current !== undefined}
            />
        </div>
    );
};

const PromptBubble: React.FC<{onPrompt: (text: string) => void}> = ({ onPrompt }) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col space-y-2">
                    <div className={"flex flex-row"}>
                        <input type="text" className={"input input-bordered w-full"} value={text} onChange={(e) => setText(e.target.value)} />
                        <button className={"btn"} onClick={() => {
                            onPrompt(text);
                            setOpen(false);
                        }}>
                            ask
                        </button>
                    </div>
                    <button onClick={() => {
                        setOpen(false);
                    }}>
                        close
                    </button>
                </div>
            </Modal>
            <button onClick={() => setOpen(true)}>
                ask
            </button>
        </>
    )
}

const BottomNav: React.FC<{
    changeContent: (c: Content) => void,
    addImage: () => void,
    addTag: (tag: string) => void,
    onSend: () => void,
    onStop: () => void,
    actionRunning: boolean,
}> = ({changeContent, addImage, addTag, onSend, actionRunning, onStop}) => {
   const [newContent, setNewContent] = useState(false);
   const [addingTag, setAddingTag] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const onAddTag = (tag: string) => {
        if (tag) {
            setAddingTag(false);
            addTag(tag);
        }
    };
   const onNewClose = () => {
       setNewContent(false);
   }

   return (
       <div className="btm-nav">
           <ContentDrawer />
           <Modal open={newContent} onClose={onNewClose}>
               <div className="flex justify-end">
                   <li onClick={() => {
                       addImage();
                       setNewContent(false);
                   }}>
                       <a>image</a>
                   </li>
                   <li onClick={() => {
                       changeContent(urlContent('https://example.com', []));
                       setNewContent(false);
                   }}><a>url</a></li>
                   <li onClick={() => {
                       changeContent(postContent("Don't think, write."));
                       setNewContent(false);
                   }}>
                       <a>post</a>
                   </li>
                   <li onClick={() => {
                       changeContent(siteContent());
                       setNewContent(false);
                   }}>
                       <a>site</a>
                   </li>
                   <button className={"btn"} onClick={onNewClose}>close</button>
               </div>
           </Modal>
           <Modal open={addingTag} onClose={() => setAddingTag(false)}>
               <div className={"space-y-2"}>
                   <FilteredTagInput
                       selectedTag={selectedTag}
                       setSelectedTag={setSelectedTag}
                       onAddTag={onAddTag}
                   />
                   <button className={"btn"} onClick={() => setAddingTag(false)}>close</button>
               </div>
            </Modal>
           <button onClick={() => setNewContent(true)}>
               <PlusIcon className="h-6 w-6" />
           </button>
           <button onClick={() => setAddingTag(true)}>
               <TagIcon className="h-6 w-6" />
           </button>
           {actionRunning && (
               <button onClick={onStop}>
                   <StopIcon className="h-6 w-6" />
               </button>
           )}
           <button onClick={onSend}>
               <PaperAirplaneIcon className="h-6 w-6" />
           </button>
       </div>
   )
}

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
                        className={'space-y-2'}
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
                            <EditorContent className={""} editor={editor} />
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
        return <EditorContent className={"h-96"} editor={editor} />;
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