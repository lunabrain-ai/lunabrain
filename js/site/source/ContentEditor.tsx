import React, {useEffect, useRef, useState} from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import Text from '@tiptap/extension-text';
import Paragraph from '@tiptap/extension-paragraph';
import Document from "@tiptap/extension-document";
import './editor.css';
import {useContentEditor, useSources} from "@/source/state";
import {Content, GRPCTypeInfo, Post} from "@/rpc/content/content_pb";
import {AdjustmentsHorizontalIcon, PaperAirplaneIcon} from "@heroicons/react/24/outline";
import {textContent} from "../../extension/util";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {useForm} from "react-hook-form";
import {GRPCInputFormProps, ProtobufMessageForm} from "@/form/ProtobufMessageForm";
import { RichTextLink } from './rich-text-links';
import {AddTagBadge} from "@/tag/AddTagBadge";
import {act} from "react-dom/test-utils";
import {SitePostSearch} from "@/source/SitePostSearch";

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

export const ContentEditor: React.FC<{}> = ({}) => {
    const {selected} = useContentEditor();
    const { getSources } = useSources();
    const [postType, setPostType] = useState<GRPCTypeInfo|null>(null);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        resetField,
    } = useForm({
        values: {
            data: selected ? selected.toJson() : {},
            // data: selected || new Content({
            //     type: {
            //         case: 'post',
            //         value: new Post({
            //             title: '',
            //             content: '',
            //         }),
            //     }
            // }).toJson() as any,
        },
    });
    //console.log(selected?.toJson());
    const [tags, setTags] = useState<string[]>(selected?.tags || []);

    const addTag = async (tag: string) => {
        setTags([...tags, tag]);
    }

    const removeTag = async (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    }

    useEffect(() => {
        (async () => {
            try {
                const t = await contentService.types({});
                setPostType(t);
            } catch (e) {
                console.error('failed to get types', e);
            }
        })()
    }, [setPostType]);

    const form = () => {
        if (!postType) {
            return null;
        }

        const inputFormProps: GRPCInputFormProps = {
            grpcInfo: postType,
            // some random key to separate data from the form
            baseFieldName: 'data',
            //@ts-ignore
            register,
            setValue,
            // TODO breadchris without this ignore, my computer wants to take flight https://github.com/react-hook-form/react-hook-form/issues/6679
            //@ts-ignore
            control,
            fieldPath: postType.packageName || '',
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
            BulletList.configure({
                // HTMLAttributes: {
                //     class: 'list-disc',
                // },
            }),
            ListItem,
            RichTextLink,
        ],
        onUpdate: ({ editor }) => {
            localStorage.setItem('editorContent', editor.getHTML());
        },
        content: selected ? getContent(selected) : localStorage.getItem('editorContent') || '',
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
        if (editor && selected) {
            editor.commands.setContent(getContent(selected));
            switch (selected.type.case) {
                case 'post':
                    setValue('data', selected.type.value.toJson());
                    break;
            }
        }
    }, [editor, selected]);

    const onSubmit = async (data: any) => {
        // TODO breadchris the editor should handle this
        const c = removeUndefinedFields(data.data);
        console.log(c);
        let content = Content.fromJson(c);

        // TODO breachris the editor should have ui controls in protobuf to set this
        switch (content.type.case) {
            case 'post':
                content.type.value.content = editor?.getHTML() || '';
                break;
        }
        content.tags = tags;
        content.id = selected?.id || '';
        void saveContent(content);
    }

    const myModal = useRef(null);

    const getEditor = (content: Content|null) => {
        if (!content) {
            return null;
        }
        switch (content.type.case) {
            case 'site':
                // TODO breadchris only show oneof from this type to make the form smaller
                return (
                    <div role={"tablist"} className={"tabs tabs-lifted w-full"}>
                        <input checked type={"radio"} name={"site_tabs"} role={"tab"} className={"tab"} aria-label={"posts"} />
                        <div role={"tabpanel"} className={"tab-content"}>
                            <SitePostSearch site={content.type.value} />
                        </div>
                        <input type={"radio"} name={"site_tabs"} role={"tab"} className={"tab"} aria-label={"config"} />
                        <div role={"tabpanel"} className={"tab-content"}>
                            {form()}
                        </div>
                    </div>
                )
        }
        if (editor) {
            return (
                <>
                    <EditorContent className={"max-h-72 overflow-y-auto"} editor={editor} />
                    <dialog id="my_modal_1" className="modal" ref={myModal}>
                        <div className="modal-box">
                            {form()}
                            <form method="dialog">
                                <div className="modal-action">
                                    <button className="btn">Close</button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </>
            );
        }
        return null;
    }

    return (
        <div>
            <div className={"max-h-[300px] overflow-y-auto"}>
                {getEditor(selected)}
            </div>
            <span>
                {tags.map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm" onClick={() => removeTag(tag)}>{tag}</span>
                ))}
            </span>
            <div className={"flex justify-between w-full"}>
                <div className={"flex space-x-2"}>
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
