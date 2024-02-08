import React, {FC, useEffect, useState} from "react";
import {Conversation} from "@/rpc/content/chatgpt/conversation_pb";
import ReactMarkdown from "react-markdown";

export const ChatGPTConversationEditor: FC<{
    conversation: Conversation;
    onUpdate: (c: Conversation) => void;
    className?: string;
}> = ({conversation, onUpdate, className}) => {
    const [visible, setVisible] = useState<string[]>([]);
    const [path, setPath] = useState<string[]>([]);
    const root = Object.keys(conversation.mapping).find((k) => !conversation.mapping[k].parent);

    const initPath = (initialKey: string, initialPath: string[]) => {
        let currentKey = initialKey;

        while (currentKey && conversation.mapping[currentKey].children.length > 0) {
            initialPath.push(currentKey);
            currentKey = conversation.mapping[currentKey].children[0]; // Select the first child
        }

        // Include the last node with no children
        if (currentKey) {
            initialPath.push(currentKey);
        }

        setPath(initialPath);
    };

    useEffect(() => {
        if (root !== undefined) {
            initPath(root, []);
        }
    }, [conversation]);

    // Function to update the path when a sibling is selected
    const handleSelectSibling = (nodeKey: string, level: number) => {
        initPath(nodeKey, path.slice(0, level));
    };

    return (
        <div className="flex flex-col gap-2">
            {path.map((nodeKey, index) => {
                const node = conversation.mapping[nodeKey];
                if (!node) {
                    console.warn(`Node ${nodeKey} not found in conversation mapping`)
                    return null;
                }
                const isVisible = visible.includes(nodeKey);
                const author = node.message?.author;
                const parentNode = conversation.mapping[node.parent ?? ''];
                const siblings = parentNode ? parentNode.children : [];
                const msg = node.message?.content?.textParts.join(' ');
                if (msg === undefined || msg === '') {
                    console.log('skipping node', nodeKey, node.message?.content)
                    return null;
                }

                return (
                    <div key={node.id}>
                        <div className={`chat ${author?.role !== 'user' ? 'chat-start' : 'chat-end'}`}>
                            <div className="chat-header">{author?.role}</div>
                            <div className={`chat-bubble overflow-x-auto ${isVisible ? 'max-h-32 overflow-hidden' : ''}`} onClick={() => {
                                // if (visible.includes(nodeKey)) {
                                //     setVisible(visible.filter((v) => v !== nodeKey));
                                // } else {
                                //     setVisible([...visible, nodeKey]);
                                // }
                            }}>
                                <ReactMarkdown className={isVisible ? 'clamp' : ''}>
                                    {msg}
                                </ReactMarkdown>
                            </div>
                        </div>
                        {author?.role === 'user' && siblings.length > 1 && (
                            <div className="flex gap-2 mt-2">
                                {siblings.map((siblingKey) => (
                                    <button
                                        key={siblingKey}
                                        className={`max-w-sm text-ellipsis px-2 py-1 text-sm rounded ${siblingKey === nodeKey ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => handleSelectSibling(siblingKey, index)}
                                    >
                                        {conversation.mapping[siblingKey].message?.content?.textParts.join(' ')}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
