import React, {useEffect, useState} from "react";
import {useContentEditor, useSources} from "@/source/state";
import {Content, DisplayContent, EnumeratedSource} from "@/rpc/content/content_pb";
import {ContentCard} from "@/source/ContentCard";
import {contentService, userService} from "@/service";
import toast from "react-hot-toast";
import {useParams} from "react-router";
import {PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import {notEmpty} from "@/util/predicates";
import {ContentEditor} from "@/source/ContentEditor";
import {useAuth} from "@/auth/state";

export const SourcePage: React.FC = () => {
    const {sources, types, selected, setSelected, setTypes, getSources} = useSources();
    const {selected: selectedContent, select: setSelectedContent} = useContentEditor();
    const { id } = useParams();
    const { logout } = useAuth();

    useEffect(() => {
        void getSources();
    }, [types]);

    useEffect(() => {
        if (!id) {
            return;
        }
        (async () => {
            try {
                const res = await contentService.search({
                    contentID: id,
                })
                if (res.storedContent.length === 0) {
                    return;
                }
                //setSelectedContent(res.storedContent[0].content || null);
            } catch (e) {
                console.error('failed to get sources', e);
            }
        })();
    }, [id]);

    const handleSelectSource = (source: EnumeratedSource) => {
        setSelected(source);
    };

    const handlePublish = async () => {
        try {
            // TODO breadchris save content to group
            const resp = await contentService.publish({});
            toast.success('Published content');
        } catch (e) {
            toast.error('Failed to publish content');
            console.error('failed to publish', e)
        }
    }

    const toggleType = (type: string) => async () => {
        setTypes((types) => {
            if (types.includes(type)) {
                return types.filter((t) => t !== type);
            }
            return [...types, type];
        });
    }

    if (!sources) {
        return (
            <div className="loading loading-lg"></div>
        );
    }
    return (
        <div className="p-5 h-[95vh] flex flex-col">
            <div className={"navbar bg-base-100"}>
                <div className="flex-1">
                    <p className="text-xl">just share.</p>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li><a onClick={handlePublish}>publish</a></li>
                        <li><a onClick={logout}>logout</a></li>
                    </ul>
                </div>
            </div>
            <div className="flex-grow">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <ContentEditor content={selectedContent} onUpdate={(c) => {
                            setSelectedContent(c);
                        }} />
                    </div>
                </div>
                <Tabs sources={sources} selected={selected} onSelectSource={handleSelectSource} />
                {selected && (
                    // <ContentCards displayContent={selected.displayContent} />
                    <div className={"overflow-x-auto"}>
                        <details className={"dropdown"}>
                            <summary className={"btn"}>type</summary>
                            <ul className={"p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52"}>
                                <li onClick={toggleType('site')}>site</li>
                                <li onClick={toggleType('post')}>post</li>
                            </ul>
                        </details>
                        <ContentTable displayContent={selected.displayContent} />
                    </div>
                )}
            </div>
        </div>
    );
}

const ContentTable: React.FC<{displayContent: DisplayContent[]}> = ({displayContent}) => {
    const {selected, select} = useContentEditor();
    const { getSources } = useSources();
    const handleCheckboxChange = (content: Content|undefined, isChecked: boolean) => {
        if (isChecked && content) {
            select(content);
        }
        if (!isChecked) {
            select(undefined);
        }
    };

    const handleDelete = async () => {
        if (!selected) {
            return;
        }
        try {
            // TODO breadchris save content to group
            const resp = await contentService.delete({
                contentIds: [selected.id],
            });
            void getSources();
            toast.success('Deleted content');
        } catch (e) {
            toast.error('Failed to delete content');
            console.error('failed to delete', e)
        }
    }
    const cnt = selected ? [
        displayContent.find((c) => c.content?.id === selected.id),
        ...displayContent.filter((c) => c.content?.id !== selected.id)
    ] : displayContent;
    return (
        <table className="table w-full">
            <thead>
            <tr>
                <th>{selected && (
                    <TrashIcon onClick={handleDelete} className="h-5 w-5" />
                )}</th>
                <th>title</th>
                <th>tags</th>
                <th>description</th>
            </tr>
            </thead>
            <tbody>
            {cnt.filter(notEmpty).map((item, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-accent"
                            checked={selected?.id === item.content?.id}
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
                    <td className="max-w-xs truncate text-gray-500 font-normal">{item.description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

interface TabsProps {
    sources: EnumeratedSource[];
    selected: EnumeratedSource|undefined;
    onSelectSource: (source: EnumeratedSource) => void;
}

const Tabs: React.FC<TabsProps> = ({ sources, selected, onSelectSource }) => {
    return (
        <div className="tabs tabs-bordered my-6">
            {sources.map((source, index) => (
                <a
                    className={`tab ${selected?.source?.name === source.source?.name ? 'tab-active' : ''}`}
                    key={index}
                    onClick={() => onSelectSource(source)}
                >
                    {source.source?.name}
                </a>
            ))}
        </div>
    );
};

interface ContentCardsProps {
    displayContent: DisplayContent[];
}

const ContentCards: React.FC<ContentCardsProps> = ({ displayContent }) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {displayContent.map((item, index) => (
                <ContentCard key={index} displayContent={item} />
            ))}
        </div>
    );
};