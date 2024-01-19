import {Content, DisplayContent, Segment} from "@/rpc/content/content_pb";
import React from "react";
import ReactMarkdown from "react-markdown";
import {VideoPlayer} from "@/media/VideoPlayer";
import {useContentEditor} from "@/source/state";

interface ContentCardProps {
    displayContent: DisplayContent;
}

export const ContentCard: React.FC<ContentCardProps> = ({ displayContent }) => {
    const {selected, select} = useContentEditor();
    const handleCheckboxChange = (isChecked: boolean) => {
        if (isChecked && displayContent.content) {
            select(displayContent.content);
        }
        if (!isChecked) {
            select(undefined);
        }
    };
    return (
        <div className="card">
            <div className="top-2 right-2">
                <input
                    type="checkbox"
                    className="checkbox checkbox-accent"
                    checked={selected?.id === displayContent.content?.id}
                    onChange={(e) => handleCheckboxChange(e.target.checked)}
                />
            </div>
            <div className="card-body">
                {displayContent.title !== '' && (
                    <h2 className="card-title">{displayContent.title}</h2>
                )}
                <p className="max-h-72 truncate text-gray-500 font-normal">{displayContent.description}</p>
                <p className="max-h-72 truncate text-gray-700 text-xs font-normal">{displayContent.type}</p>
                <div className="flex gap-3">
                    {displayContent.content?.tags.map((tag) => (
                        <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
