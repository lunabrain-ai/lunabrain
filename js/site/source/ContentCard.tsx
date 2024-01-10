import {Content, DisplayContent, Segment} from "@/rpc/content/content_pb";
import React from "react";
import ReactMarkdown from "react-markdown";
import {VideoPlayer} from "@/media/VideoPlayer";
import {useContentEditor} from "@/source/state";

interface ContentCardProps {
    displayContent: DisplayContent;
}

export const ContentCard: React.FC<ContentCardProps> = ({ displayContent }) => {
    const {selected, setSelected} = useContentEditor();
    const handleCheckboxChange = (isChecked: boolean) => {
        if (isChecked && displayContent.content) {
            setSelected(displayContent.content);
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
                <p className={"max-h-72 overflow-y-auto"}>{displayContent.description}</p>
                <div className="flex gap-3">
                    {displayContent.content?.tags.map((tag) => (
                        <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
