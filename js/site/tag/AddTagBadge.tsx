import * as React from "react";
import {useEffect, useState} from "react";
import { FilteredTagInput } from "@/tag/FilteredTagInput";
import {MinusCircleIcon, HashtagIcon} from "@heroicons/react/24/outline";

export const AddTagBadge: React.FC<{ onNewTag: (tag: string) => void }> = ({ onNewTag }) => {
    const [addingTag, setAddingTag] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const onAddTag = (tag: string) => {
        if (tag) {
            setAddingTag(false);
            onNewTag(tag);
        }
    };

    return (
        <div className={"flex flex-row"}>
            <button
                className="flex"
                onClick={() => setAddingTag(!addingTag)}
            >
                {addingTag ? <MinusCircleIcon className={"h-6 w-6"} /> : <HashtagIcon className={"h-6 w-6"} />}
            </button>
            {addingTag && (
                <FilteredTagInput
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                    onAddTag={onAddTag}
                />
            )}
        </div>
    );
};
