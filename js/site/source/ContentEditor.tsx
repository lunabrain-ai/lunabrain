import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import './editor.css';
import {useSources, useVoice} from "@/source/state";
import {Content, GRPCTypeInfo, Post, Site, TypesResponse} from "@/rpc/content/content_pb";
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
import {useForm} from "react-hook-form";
import {GRPCInputFormProps, ProtobufMessageForm} from "@/form/ProtobufMessageForm";
import { RichTextLink } from './rich-text-links';
import {AddTagBadge} from "@/tag/AddTagBadge";
import {SitePostSearch} from "@/source/SitePostSearch";
import {URLEditor} from "@/source/URLEditor";
import History from '@tiptap/extension-history';
import {callbacks, FormField, walkDescriptor} from "@/form/walk";
import {string} from "slate";
import {Form} from "@/form/Form";
import {transformObject} from "@/util/form";

function removeUndefinedFields<T extends object>(obj: T): T {
    Object.keys(obj).forEach(key => {
        if (obj[key as keyof T] === undefined) {
            delete obj[key as keyof T];
        }
    });
    return obj;
}

const getContent = (content: Content) => {
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
    return null;
}

export const ContentEditor: React.FC<{content: Content|undefined, onUpdate: (content: Content) => void}> = ({content, onUpdate}) => {
    const { getSources } = useSources();
    const { start, stop, recording } = useVoice();
    const [formTypes, setFormTypes] = useState<TypesResponse|undefined>(undefined);
    const [editedContent, setEditedContent] = useState<Content>(content || new Content({
        type: {
            case: 'post',
            value: new Post({
                title: '',
                content: '',
            }),
        }
    }));
    const {
        register,
        handleSubmit,
        control,
        setValue,
        resetField,
    } = useForm({
        values: {
            data: editedContent.toJson() as any,
        },
    });

    useEffect(() => {
        void getSources();
    }, []);

    useEffect(() => {
        if (content) {
            setValue('data', content.toJson() as any);
            setEditedContent(content);
        }
    }, [content]);

    const startRecording = async () => {
        start((text) => {
            if (editor) {
                editor.chain().focus().insertContent(text).run();
            }
        });
    }

    const stopRecording = async () => {
        stop();
    }

    const addTag = async (tag: string) => {
        setEditedContent(new Content({
            ...editedContent,
            tags: [...editedContent.tags, tag],
        }));
    }

    const removeTag = async (tag: string) => {
        setEditedContent(new Content({
            ...editedContent,
            tags: editedContent.tags.filter((t) => t !== tag),
        }));
    }

    useEffect(() => {
        (async () => {
            const t = await contentService.types({});
            // TODO breadchris fix maps
            setFormTypes(t);
        })()
    }, [setFormTypes]);

    const form = (type: GRPCTypeInfo) => {
        if (!formTypes) {
            return null;
        }

        const inputFormProps: GRPCInputFormProps = {
            grpcInfo: type,
            // some random key to separate data from the form
            baseFieldName: 'data',
            //@ts-ignore
            register,
            setValue,
            // TODO breadchris without this ignore, my computer wants to take flight https://github.com/react-hook-form/react-hook-form/issues/6679
            //@ts-ignore
            control,
            fieldPath: type.packageName || '',
            resetField,
        }
        return (
            <ProtobufMessageForm {...inputFormProps} />
        );
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
        },
        content: content ? getContent(content) : localStorage.getItem('editorContent') || '',
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

    const saveContent = async (content: Content) => {
        try {
            // TODO breadchris save content to group
            const resp = await contentService.save({
                content: content,
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

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(getContent(content));
            switch (content.type.case) {
                case 'post':
                    setValue('data', content.type.value.toJson());
                    break;
            }
        }
    }, [editor, content]);

    const onSubmit = async (data: any) => {
        // TODO breadchris the editor should handle this
        let c = removeUndefinedFields(data.data);
        c = transformObject(c);
        console.log(c);
        let content = Content.fromJson(c);

        // TODO breachris the editor should have ui controls in protobuf to set this
        switch (content.type.case) {
            case 'post':
                content.type.value.content = editor?.getHTML() || '';
                break;
        }
        content.tags = editedContent.tags;
        content.id = content?.id || '';
        void saveContent(content);
    }

    const myModal = useRef(null);

    const getEditor = (content: Content|null) => {
        const dialog = (
            <dialog id="my_modal_1" className="modal" ref={myModal}>
                <div className="modal-box">
                    {formTypes?.content && form(formTypes.content)}
                    <form method="dialog">
                        <div className="modal-action">
                            <button className="btn">Close</button>
                        </div>
                    </form>
                </div>
            </dialog>
        );
        if (content) {
            switch (content.type.case) {
                case 'site':
                    // TODO breadchris only show oneof from this type to make the form smaller
                    return (
                        <>
                            <SitePostSearch onUpdate={(s: Site) => {
                                const c = new Content({
                                    ...content,
                                    type: {
                                        case: 'site',
                                        value: s,
                                    }
                                });
                                setEditedContent(c);
                                setValue('data', c.toJson());}
                            } site={content.type.value} />
                            {dialog}
                        </>
                    )
                case 'post':
                    const p = content.type.value;
                    return (
                        <div className={"space-y-2"}>
                            <input type="text" value={p.title} onChange={(e) => {
                                const c = new Content({
                                    ...content,
                                    type: {
                                        case: 'post',
                                        value: {
                                            ...p,
                                            title: e.target.value,
                                        }
                                    }
                                });
                                setEditedContent(c);
                                setValue('data', c.toJson());
                            }} placeholder="title" className="input w-full max-w-xs" />
                            <EditorContent className={"max-h-72 overflow-y-auto"} editor={editor} />
                            {dialog}
                        </div>
                    )
                case 'data':
                    const d = content.type.value;
                    switch (d.type.case) {
                        case 'url':
                            const u = d.type.value;
                            return <URLEditor url={u.url} onChange={(url) => {
                                const c = new Content({
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
                                });
                                setEditedContent(c);
                                setValue('data', c.toJson());
                            }} />
                    }
            }
        }
        if (editor) {
            return (
                <>
                    <EditorContent className={"max-h-72 overflow-y-auto"} editor={editor} />
                    {dialog}
                </>
            );
        }
        return null;
    }

    return (
        <div>
            {/*{fields && <Form fields={fields} />}*/}
            <div className={""}>
                {getEditor(editedContent)}
            </div>
            <span>
                {editedContent.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm" onClick={() => removeTag(tag)}>{tag}</span>
                ))}
            </span>
            <div className={"flex justify-between w-full"}>
                <div className={"flex space-x-2"}>
                    <details className={"dropdown"}>
                        <summary className={"btn"}><PlusIcon className={"h-6 w-6"} /></summary>
                        <ul className={"p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"}>
                            <li onClick={() => {
                                const c = urlContent('https://example.com', []);
                                setEditedContent(c);
                                setValue('data', c.toJson());
                                if (editor) {
                                    editor.commands.setContent(getContent(c));
                                }
                            }}>url</li>
                            <li onClick={() => {
                                const c = postContent("Don't think, write.");
                                setEditedContent(c);
                                setValue('data', c.toJson());
                                if (editor) {
                                    editor.commands.setContent(getContent(c));
                                }
                            }}>
                                post
                            </li>
                        </ul>
                    </details>
                    <button className={"btn"} onClick={recording ? stopRecording : startRecording}>
                        {recording ? <StopIcon className={"h-6 w-6"} /> : <MicrophoneIcon className="h-6 w-6" />}
                    </button>
                    <AddTagBadge onNewTag={addTag} />
                    <span>
                        <button className={"btn"} onClick={() => myModal.current?.showModal()}>
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </button>
                    </span>
                </div>
                <button className={"btn"} onClick={handleSubmit(onSubmit)}>
                    <PaperAirplaneIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};
