import React from 'react';
import { FileDrop } from "@/file/FileDrop";
import { ContentWindow } from "@/content/ContentWindow";
import { AccountCard } from "@/auth/AccountCard";
import { useProjectContext } from "@/react/ProjectProvider";
import { GroupDialog } from "@/auth/GroupManager";
import {TagIcon} from "@heroicons/react/24/outline";

export const ContentPage = () => {
    const { groups, currentGroup, setCurrentGroup, showTagTree, setShowTagTree } = useProjectContext();

    const onTabSelect = (tabId: string) => {
        setCurrentGroup(tabId);
    };

    return (
        <div>
            <div className="flex justify-between items-center w-full overflow-x-hidden">
                <div className="flex gap-2">
                    <div className="tabs">
                        <a className={`tab tab-bordered ${currentGroup === 'home' ? 'tab-active' : ''}`}
                           onClick={() => onTabSelect('home')}>home</a>
                        {groups.map(g => (
                            <a key={g.id} className={`tab tab-bordered ${g.id === currentGroup ? 'tab-active' : ''}`}
                               onClick={() => onTabSelect(g.id)}>{g.name}</a>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className={`btn ${showTagTree ? 'btn-active' : ''}`}
                            onClick={() => setShowTagTree(!showTagTree)}>
                        <TagIcon className={"h-6 w-6"} />
                    </button>
                    <GroupDialog />
                    <AccountCard />
                </div>
            </div>
            <div className="flex-grow">
                <FileDrop>
                    <ContentWindow />
                </FileDrop>
            </div>
        </div>
    );
};
