import React, { useState } from 'react';
import { useProjectContext } from "@/react/ProjectProvider";
import { ContentList } from "@/content/ContentList";
import { TagManager } from "@/tag/TagManager";
import {CreateCard} from "@/content/CreateCard";

export const ContentWindow: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string | undefined>('');
    const { content, showTagTree, setShowTagTree, loadContent, selectedContent, setSelectedContent } = useProjectContext();

    const SearchStack = () => {
        return (
            <div className="flex items-center justify-center w-full gap-4 p-4 mb-5">
                <input
                    type="text"
                    placeholder="Search..."
                    className="input input-bordered w-full"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button className="btn" onClick={() => {}}>Search</button>
            </div>
        )
    }

    return (
        <div className="p-5 h-[95vh] flex flex-col">
            <div className="flex-grow">
                <div className="mb-4">
                    <CreateCard />
                </div>
                <div>
                    <ContentList content={content} />
                    {showTagTree && (
                        <div className="mt-2">
                            <SearchStack />
                            <TagManager />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
