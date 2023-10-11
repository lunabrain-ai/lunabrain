import React, { useState } from 'react';
import { ChevronUp20Filled, ChevronDown20Filled } from '@fluentui/react-icons';

interface IRedditRowProps {
}

export const Vote: React.FC<IRedditRowProps> = ({ }) => {
    const [votes, setVotes] = useState(0);

    const handleUpvote = () => {
        setVotes(votes + 1);
    };

    const handleDownvote = () => {
        setVotes(votes - 1);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <ChevronUp20Filled onClick={handleUpvote} style={{ cursor: 'pointer' }} />
                <span>{votes}</span>
            </div>
        </div>
    );
};
