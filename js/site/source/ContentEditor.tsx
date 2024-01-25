import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import './editor.css';
import {useContentEditor, useSources, useVoice} from "@/source/state";
import {Content, GRPCTypeInfo, Post, Section, Site, TypesResponse} from "@/rpc/content/content_pb";
import {
    AdjustmentsHorizontalIcon,
    MicrophoneIcon,
    PaperAirplaneIcon,
    PlusIcon,
    StopIcon
} from "@heroicons/react/24/outline";
import {postContent, textContent, urlContent} from "../../extension/util";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import { RichTextLink } from './rich-text-links';
import {AddTagBadge} from "@/tag/AddTagBadge";
import {SectionEditor} from "@/source/SectionEditor";
import {URLEditor} from "@/source/URLEditor";
import History from '@tiptap/extension-history';
import {Form, formControlAtom, useProtoForm} from "@/form/Form";
import {Provider, useAtom} from "jotai";
import {useForm} from "react-hook-form";
import {cleanObject} from "@/util/form";

export const ContentEditor: React.FC<{}> = ({}) => {
    const settingsModal = useRef(null);
    const { editedContent: content, editContent } = useContentEditor();
    const { getSources } = useSources();
    const [formControl, setFormControl] = useAtom(formControlAtom);
    const {fields, loadFormTypes} = useProtoForm();

    const fc = useForm();
    const { setValue } = fc;

    // TODO breadchris this will become problematic with multiple forms on the page, need provider
    useEffect(() => {
        void loadFormTypes();
        setFormControl(fc);
    }, []);

    useEffect(() => {
        // anytime the content changes outside of this editor, update the editor
        if (content) {
            setValue('data', content.toJson() as any);
            if (editor) {
                editor.commands.setContent(getContent(content));
            }
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

    const editor = useEditor({
        extensions: [
            Document,
            Paragraph,
            Text,
            BulletList,
            ListItem,
            RichTextLink,
            History.configure({
                depth: 100,
            })
        ],
        onUpdate: ({ editor }) => {
            localStorage.setItem('editorContent', editor.getHTML());
            if (content) {
                switch (content.type.case) {
                    case 'post':
                        content.type.value.content = editor?.getHTML() || '';
                        editContent(content);
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
            console.log(resp);
            void getSources();
            toast.success('Saved content');
        } catch (e) {
            toast.error('Failed to save content');
            console.error('failed to save', e)
        }
    }

    return (
        <div>
            <div className={""}>
                {editor && <ContentTypeEditor content={content} onUpdate={editContent} editor={editor} />}
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
                <div className={"flex space-x-2"}>
                    <details className={"dropdown"}>
                        <summary className={"btn"}><PlusIcon className={"h-6 w-6"} /></summary>
                        <ul className={"p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"}>
                            <li onClick={() => {
                                editContent(urlContent('https://example.com', []));
                            }}>url</li>
                            <li onClick={() => {
                                editContent(postContent("Don't think, write."));
                            }}>
                                post
                            </li>
                        </ul>
                    </details>
                    <VoiceInputButton onText={(text) => {
                        if (editor) {
                            editor.chain().focus().insertContent(text).run();
                        }
                    }} />
                    <AddTagBadge onNewTag={addTag} />
                    <span>
                        <button className={"btn"} onClick={() => settingsModal.current?.showModal()}>
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </button>
                    </span>
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
    if (content) {
        switch (content.type.case) {
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
                    case 'url':
                        const u = d.type.value;
                        return <URLEditor url={u.url} onChange={(url) => {
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

const SiteEditor: React.FC<{site: Site, onUpdate: (s: Site) => void}> = ({site, onUpdate}) => {
    const [sectionIdx, setSectionIdx] = useState<number>(0);
    const deleteSection = () => {
        onUpdate(new Site({
            ...site,
            sections: site.sections.filter((_, i) => i !== sectionIdx),
        }));
    }
    useEffect(() => {
        if (site.sections.length === 0) {
            setSectionIdx(0);
            onUpdate(new Site({}));
        }
    }, [site]);
    return (
        <>
            <div className="text-gray-600 px-3 py-2">
                <h4 className="text-lg font-semibold">site: {site.hugoConfig?.title || 'untitled'}</h4>
            </div>
            <button className={"btn"} onClick={() => {
                onUpdate(new Site({
                    ...site,
                    sections: [...site.sections, new Section({})],
                }));
            }}>
                <PlusIcon className="h-6 w-6" />
            </button>
            <div className="tabs tabs-bordered my-6">
                {site.sections.map((section, idx) => (
                    <a
                        className={`tab ${idx === sectionIdx ? 'tab-active' : ''}`}
                        key={idx}
                        onClick={() => setSectionIdx(idx)}
                    >
                        {section.menu?.name || 'untitled'}
                    </a>
                ))}
            </div>
            <SectionEditor section={site.sections[sectionIdx]} onUpdate={(s: Section) => {
                onUpdate(new Site({
                    ...site,
                    sections: site.sections.map((section, idx) => {
                        if (idx === sectionIdx) {
                            return s;
                        }
                        return section;
                    })
                }));
            }} onDelete={deleteSection} />
        </>
    )
}
