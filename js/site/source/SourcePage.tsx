import React, {useEffect, useState} from "react";
import {useSources} from "@/source/state";
import {Content, DisplayContent, EnumeratedSource} from "@/rpc/content/content_pb";
import {ContentCard} from "@/source/ContentCard";
import {CreateCard} from "@/source/CreateCard";
import {contentService} from "@/service";
import toast from "react-hot-toast";

export const SourcePage: React.FC = () => {
    const {sources, selected, setSelected} = useSources();

    const handleSelectSource = (source: EnumeratedSource) => {
        setSelected(source);
    };

    const handlePublish = async () => {
        try {
            // TODO breadchris save content to group
            const resp = await contentService.publish({});
            console.log(resp);
            toast.success('Published content');
        } catch (e) {
            toast.error('Failed to publish content');
            console.error('failed to publish', e)
        }
    }

    if (!sources) {
        return (
            <div className="loading loading-lg"></div>
        );
    }
    return (
        <div className="p-5 h-[95vh] flex flex-col">
            <div className="flex-grow">
                <div>
                    <button className={"btn"} onClick={handlePublish}>Publish</button>
                    <CreateCard />
                    <Tabs sources={sources} selected={selected} onSelectSource={handleSelectSource} />
                    {selected && (
                        <>
                            <ContentCards displayContent={selected.displayContent} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

interface TabsProps {
    sources: EnumeratedSource[];
    selected: EnumeratedSource|null;
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