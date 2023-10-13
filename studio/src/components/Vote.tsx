import React, { useState } from 'react';
import { ChevronUp20Filled, ArrowUp24Regular } from '@fluentui/react-icons';
import {contentService} from "@/service";

export const Vote: React.FC<{ contentID: string, votes: number }> = ({ contentID, votes }) => {
    const [currentVotes, setCurrentVotes] = useState(votes);

    const handleUpvote = async () => {
        const res = await contentService.vote({
            contentId: contentID,
        });
        setCurrentVotes(res.votes);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <ChevronUp20Filled onClick={handleUpvote} style={{ cursor: 'pointer' }} />
                <span>{currentVotes}</span>
            </div>
        </div>
    );
};
