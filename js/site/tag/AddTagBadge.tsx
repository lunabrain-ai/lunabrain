import * as React from "react";
import { useState } from "react";
import { FilteredTagInput } from "@/tag/FilteredTagInput";
import {MinusCircleIcon, HashtagIcon} from "@heroicons/react/24/outline";

export const AddTagBadge: React.FC<{ onNewTag: (tag: string) => void }> = ({ onNewTag }) => {
    const [addingTag, setAddingTag] = useState(false);
    const icon = addingTag ? <MinusCircleIcon className={"h-6 w-6"} /> : <HashtagIcon className={"h-6 w-6"} />;
    const [selectedTag, setSelectedTag] = useState<string>('');
    const onAddTag = (tag: string) => {
        if (tag) {
            setAddingTag(false);
            onNewTag(tag);
        }
    };

    return (
        <span>
            <button
                className="btn"
                onClick={() => setAddingTag(!addingTag)}
            >
                {icon}
            </button>
            {addingTag && (
                <FilteredTagInput
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    onAddTag={onAddTag}
                />
            )}
        </span>
    );
};
