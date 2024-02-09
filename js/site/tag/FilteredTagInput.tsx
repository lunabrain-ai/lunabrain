import React, { useState, useEffect } from 'react';
import { useProjectContext } from "@/react/ProjectProvider";
import { Tag } from "@/rpc/content/content_pb";
import { useDebounce } from "@uidotdev/usehooks";
import {HashtagIcon, PlusIcon, TagIcon} from "@heroicons/react/24/outline";
import {useTags} from "@/tag/state";

function flattenTag(tag: Tag): string[] {
    let names: string[] = [tag.name];

    for (let subTag of tag.subTags) {
        names = names.concat(`${tag.name}/${flattenTag(subTag)}`);
    }

    return names;
}

function normalizeTags(tags: Tag[]): string[] {
    let names: string[] = [];
    for (let tag of tags) {
        names = names.concat(flattenTag(tag));
    }
    return names;
}

export const FilteredTagInput: React.FC<{
    selectedTag: string,
    setSelectedTag: (tag: string) => void,
    onAddTag: (tag: string) => void,
}> = ({
          selectedTag,
          setSelectedTag,
          onAddTag,
      }) => {
    const { tags, getTags } = useTags();

    useEffect(() => {
        void getTags();
    }, []);

    const normalizedTags = normalizeTags(tags);

    const filterOptions = (tag: string) => {
        return normalizedTags.filter(
            (option) => option.toLowerCase().indexOf(tag.toLowerCase()) === 0
        );
    }

    const [matchingOptions, setMatchingOptions] = useState(filterOptions(selectedTag));

    const onChange = (tag: string) => {
        setMatchingOptions(filterOptions(tag));
        setSelectedTag(tag);
    }
    const debouncedOptions = useDebounce(matchingOptions, 300);

    return (
        <div className={"flex flex-col space-y-2"}>
            <div className={"flex flex-row space-x-2"}>
                <input
                    type="text"
                    value={selectedTag}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="search by tag..."
                    className="input input-bordered w-full"
                />
                <button onClick={() => onAddTag(selectedTag)} className="btn btn-square btn-primary">
                    <TagIcon className={"h-6 w-6"} />
                </button>
            </div>
            {debouncedOptions.length > 0 && (
                <ul className={"p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"}>
                    {debouncedOptions.map((option) => (
                        <li key={option}>
                            <a onClick={() => {
                                onChange(option)
                            }}>{option}</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
