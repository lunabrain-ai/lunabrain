import React, { useState, useEffect } from 'react';
import { useProjectContext } from "@/react/ProjectProvider";
import { Tag } from "@/rpc/content/content_pb";
import { useDebounce } from "@uidotdev/usehooks";
import {HashtagIcon, PlusIcon} from "@heroicons/react/24/outline";
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

    return (
        <div className="flex items-center gap-2">
            <TagInput value={selectedTag} onChange={onChange} matchingOptions={matchingOptions} />
            <button onClick={() => onAddTag(selectedTag)} className="btn btn-square btn-primary">
                <HashtagIcon className={"h-6 w-6"} />
            </button>
        </div>
    )
}

export const TagInput: React.FC<{
    onChange: (tag: string) => void,
    value: string,
    matchingOptions: string[],
}> = ({
          onChange,
          value,
          matchingOptions,
      }) => {
    const debouncedOptions = useDebounce(matchingOptions, 300);

    return (
        <div className="max-w-md">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="search by tag..."
                className="input input-bordered w-full"
                list="tags"
            />
            {debouncedOptions.length > 0 && (
                <datalist id="tags">
                    {debouncedOptions.map((option) => (
                        <option key={option} onClick={() => onChange(option)}>
                            {option}
                        </option>
                    ))}
                </datalist>
            )}
        </div>
    );
};
