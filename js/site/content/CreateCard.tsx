import {
    FolderIcon,
    LinkIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import React, {useState} from "react";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {useProjectContext} from "@/react/ProjectProvider";
import {textContent, urlContent} from "../../extension/util";
import { Content } from "@/rpc/content/content_pb";
import {FileUpload} from "@/file/FileUpload";
import {Editor} from "@/content/Editor";
import {AddTagBadge} from "@/tag/AddTagBadge";

export const CreateCard = () => {
    const [text, setText] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentInputType, setCurrentInputType] = useState<'text'|'url'|'file'>('text');
    const { currentGroup, loadContent, selectedContent, setSelectedContent } = useProjectContext();

    const saveURL = async (url: string) => {
        const u = new URL(url);
        await saveContent(urlContent(url, ['app/input']));
    }

    const saveText = async (text: string) => {
        await saveContent(textContent(text, ['app/input']));
        void loadContent();
    }

    const deleteContent = async () => {
        try {
            const res = await contentService.delete({
                contentIds: selectedContent
            });
            toast.success('Deleted content');
            setSelectedContent([]);
            loadContent();
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to delete content');
        }
    }

    const saveContent = async (content: Content) => {
        try {
            // TODO breadchris save content to group
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

    const InputType: React.FC = () => {
        if (currentInputType === 'url') {
            return <input
                type={"text"}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
                placeholder="Enter a URL"
            />
        }
        if (currentInputType === 'file') {
            return (
                <FileUpload />
            )
        }
        // TODO breadchris add slate editor
        return (
            // <textarea className="textarea" placeholder="note" onChange={(e) => {
            //     setText(e.target.value);
            // }}></textarea>
            <Editor />
        )
    }

    const addTag = async (tag: string) => {
        setTags([...tags, tag]);
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <InputType />
                <AddTagBadge onNewTag={addTag} />
                <div>
                    <div className="flex justify-between gap-3">
                        <div className={"space-x-2"}>
                            <button
                                className={"btn"}
                                onClick={() => {
                                    setCurrentInputType('text');
                                }}
                                aria-label="Text"
                            >
                                <PencilSquareIcon className="h-6 w-6" />
                            </button>
                            <button
                                className={"btn"}
                                onClick={() => {
                                    setCurrentInputType('url');
                                }}
                                aria-label="Link"
                            >
                                <LinkIcon className="h-6 w-6" />
                            </button>
                            <button
                                className={"btn"}
                                onClick={() => {
                                    setCurrentInputType('file');
                                }}
                                aria-label="file"
                                value="file"
                            >
                                <FolderIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div>
                            <button className={"btn"} onClick={() => {
                                if (currentInputType === 'text') {
                                    void saveText(text);
                                }
                                if (currentInputType === 'url') {
                                    void saveURL(text);
                                }
                            }}>
                                <PaperAirplaneIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
                {selectedContent.length > 0 && (
                    <div className="flex justify-end gap-3">
                        <button
                            className="btn btn-error"
                            disabled={selectedContent.length === 0}
                            onClick={deleteContent}
                        >
                            <TrashIcon className={"h-6 w-6"} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

