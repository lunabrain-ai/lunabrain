import * as React from "react";
import { useProjectContext } from "@/react/ProjectProvider";
import { contentService } from "@/service";
import toast from "react-hot-toast";
import { TrashIcon, LinkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { truncateText } from "@/util/text";
import { IFrameSandbox } from "@/content/card/IFrameSandbox";
import { StoredContent, Segment, Content } from "@/rpc/content/content_pb";
import QRCode from "@/content/card/QRCode";
import { Display } from "@/content/card/Display";
import { AddTagBadge } from "@/tag/AddTagBadge";
import { useState } from "react";

export const Card: React.FC<{
    item: StoredContent,
}> = ({ item }) => {
    const { userSettings, loadTags, loadContent, addFilteredTag } = useProjectContext();
    const [preview, setPreview] = React.useState(false);

    const addTag = async (tag: string) => {
        const newTags = [...item.tags.map(t => t.name), tag]
        try {
            const res = await contentService.setTags({
                contentId: item.id,
                tags: newTags,
            })
            toast.success('Added tag');

            // TODO breadchris anti-pattern, this should happen inside the provider
            void loadContent();
            void loadTags();
        } catch (e: any) {
            toast.error('Failed to add tag');
            console.error(e);
        }
    }

    const removeTag = async (tag: string) => {
        const newTags = item.tags.map(t => t.name).filter(t => t !== tag);
        try {
            const res = await contentService.setTags({
                contentId: item.id,
                tags: newTags,
            })
            toast.success('Removed tag');

            // TODO breadchris anti-pattern, this should happen inside the provider
            void loadContent();
            void loadTags();
        } catch (e: any) {
            toast.error('Failed to add tag');
            console.error(e);
        }
    }

    const searchTag = (tag: string) => {
        addFilteredTag(tag);
    }

    const openURL = () => window.location.href = item.url

    const CardActions = () => {
        return (
            <div className="flex gap-3 mt-3">
                <LinkIcon className="h-6 w-6" onClick={() => setPreview(!preview)} />
            </div>
        )
    }

    return (
        <div className="card lg:card-side bg-base-100 shadow-xl items-center">
            {item.image && (
                <figure className={"max-w-xs"}>
                    <img className="cursor-pointer" onClick={openURL} src={item.image} alt="Content" />
                </figure>
            )}
            <div className="card-body">
                <h2 className="card-title">
                    {/*{item.user ? `${item.user.email}` : 'someone'} shared*/}
                    <div className="link link-hover" onClick={openURL}>{item.title || item.url}</div>
                </h2>
                {item.description && (
                    <div className="link link-hover" onClick={openURL}>
                        {item.description ? truncateText(item.description, 150) : item.url}
                    </div>
                )}
                <div className="flex">
                    <div className="flex flex-col md:flex-row gap-4">
                        {item.content && (
                            <div className="flex-1 max-h-[70vh] overflow-y-auto">
                                <Display id={item.id} content={item.content} />
                            </div>
                        )}
                        {userSettings.showPreviews && (
                            <div className="flex-1">
                                <IFrameSandbox url={item.url} />
                            </div>
                        )}
                        {userSettings.showQRCodes && (
                            <div className="flex-1">
                                <QRCode text={item.url} />
                            </div>
                        )}
                        {item.related.length > 0 && (
                            <div className="flex-1">
                                <div className="flex gap-5">
                                    {item.related.map((r) => (
                                        <div key={r.id} className="flex-none w-24">
                                            <RelatedContentCard key={r.id} content={r} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-10 overflow-x-auto">
                    <div className="flex gap-3">
                        <div className={"flex flex-wrap"}>
                            {item.tags.map((t, i) => {
                                // TODO breadchris break into its own component and useRef
                                const dialogName = `dialog-${item.id}-${i}}`;
                                return (
                                    <div key={i}>
                                        <span className={"badge"} onClick={() => (document.getElementById(dialogName) as HTMLDialogElement).showModal()}>
                                            {t.name}
                                        </span>
                                        <dialog id={dialogName}>
                                            <button onClick={() => searchTag(t.name)} aria-label={"search-tag"}>
                                                <MagnifyingGlassIcon className={"h-6 w-6"} />
                                            </button>
                                            <button onClick={() => removeTag(t.name)} aria-label={"delete-tag"}>
                                                <TrashIcon className={"h-6 w-6"} />
                                            </button>
                                        </dialog>
                                    </div>
                                )
                            })}
                            <AddTagBadge onNewTag={addTag} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const RelatedContentCard: React.FC<{
    content: Content,
}> = ({ content }) => {
    return (
        <div className="card card-bordered w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="card-title">
                    {content.type.case}
                </div>
                <div className="overflow-y-auto max-h-72">
                    <Display id={content.id} content={content} />
                </div>
                <div className="card-actions justify-end">
                    {content.tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
