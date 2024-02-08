import React from "react";
import {useContentEditor, useSources} from "@/source/state";
import {ListBulletIcon, TrashIcon} from "@heroicons/react/24/outline";
import {AddTagBadge} from "@/tag/AddTagBadge";
import {Content, DisplayContent} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {notEmpty} from "@/util/predicates";

export const ContentDrawer: React.FC<{}> = () => {
    const {
        selected,
        setTypes,
        setTags,
        tags,
    } = useSources();

    const toggleType = (type: string) => async () => {
        setTypes((types) => {
            if (types.includes(type)) {
                return types.filter((t) => t !== type);
            }
            return [...types, type];
        });
    }
    return (
        <div className="drawer z-50">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <label htmlFor="my-drawer" className="drawer-button">
                    <ListBulletIcon className="h-6 w-6" />
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                {selected && (
                    // <ContentCards displayContent={selected.displayContent} />
                    <div className={"flex flex-col p-4 w-80 min-h-full bg-base-200 text-base-content"}>
                        <div className={"flex flex-row space-y-2"}>
                            <div>
                                <details className={"dropdown"}>
                                    <summary className={"btn"}>type</summary>
                                    <ul className={"p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"}>
                                        <li onClick={toggleType('site')}>site</li>
                                        <li onClick={toggleType('post')}>post</li>
                                    </ul>
                                </details>
                            </div>
                            <AddTagBadge onNewTag={(t) => {
                                setTags((tags) => {
                                    if (tags.includes(t)) {
                                        return tags;
                                    }
                                    return [...tags, t];
                                });
                            }} />
                            {tags.map((tag) => (
                                <span key={tag} className="badge badge-outline badge-sm" onClick={() => {
                                    setTags((tags) => tags.filter((t) => t !== tag));
                                }}>{tag}</span>
                            ))}
                        </div>
                        <div className={"overflow-x-auto"}>
                            <ContentTable displayContent={selected.displayContent} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const ContentTable: React.FC<{displayContent: DisplayContent[]}> = ({displayContent}) => {
    const {selectedContent, selectContent} = useContentEditor();
    const { getSources } = useSources();
    const handleCheckboxChange = (content: Content|undefined, isChecked: boolean) => {
        if (isChecked && content) {
            selectContent(content);
        }
        if (!isChecked) {
            selectContent(undefined);
        }
    };

    const handleDelete = async () => {
        if (!selectedContent) {
            return;
        }
        try {
            // TODO breadchris save content to group
            const resp = await contentService.delete({
                contentIds: [selectedContent.id],
            });
            void getSources();
            toast.success('Deleted content');
        } catch (e) {
            toast.error('Failed to delete content');
            console.error('failed to delete', e)
        }
    }
    const cnt = selectedContent ? [
        displayContent.find((c) => c.content?.id === selectedContent.id),
        ...displayContent.filter((c) => c.content?.id !== selectedContent.id)
    ] : displayContent;
    return (
        <table className="table w-full">
            <thead>
            <tr>
                <th>{selectedContent && (
                    <TrashIcon onClick={handleDelete} className="h-5 w-5" />
                )}</th>
                <th>title</th>
                <th>tags</th>
            </tr>
            </thead>
            <tbody>
            {cnt.filter(notEmpty).map((item, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-accent"
                            checked={selectedContent?.id === item.content?.id}
                            onChange={(e) => handleCheckboxChange(item.content, e.target.checked)}
                        />
                    </td>
                    <td>{item.title}</td>
                    <td>
                        <div className="gap-3">
                            {item.content?.tags.map((tag) => (
                                <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
                            ))}
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

