import React, {useEffect, useRef, useState} from "react";
import {AddIcon, Avatar, Chat, MenuButton } from '@fluentui/react-northstar'
import {ShorthandCollection} from "@fluentui/react-northstar/dist/es/types";
import {ChatItemProps} from "@fluentui/react-northstar/dist/es/components/Chat/ChatItem";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Spinner, SpinnerSize} from "@fluentui/react";

const actionItems = [
    {
        key: 'add',
        icon: <AddIcon />,
        title: 'Add',
    },
]
const actionMenu = {
    iconOnly: true,
    items: actionItems,
}

const defaultItems: ShorthandCollection<ChatItemProps> = [
    {
        message: (
            <Chat.Message
                actionMenu={actionMenu}
                author="LunaBrain"
                content="Hello! Welcome to LunaBrain chat. Try typing something or uploading a file. Get other people to join the chat by sharing the link above."
                timestamp="Yesterday, 10:15 PM"
            />
        ),
        key: 'message-1',
        unstable_overflow: true,
    },
]

export const ContentChat: React.FC = ({  }) => {
    const { loading, messages } = useProjectContext();
    const [items, setItems] = useState<ShorthandCollection<ChatItemProps>>(defaultItems)
    useEffect(() => {
        if (!messages || messages.length === 0) {
            return;
        }
        const items: ShorthandCollection<ChatItemProps> = messages.map((m, idx) => {
            return {
                message: (
                    <Chat.Message
                        actionMenu={actionMenu}
                        author={m.sender}
                        content={m.text}
                        mine
                        timestamp={`Yesterday, 10:15 PM`}
                        unstable_overflow={true}
                    />
                ),
                key: `message-${idx}`,
            }
        })
        setItems(items)
    }, [messages]);
    return (
        <div style={{ overflow: 'scroll', height: '750px' }}>
            {loading && (
                <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" labelPosition="right" />
            )}
            <Chat
                items={items}
            />
        </div>
    )
}
