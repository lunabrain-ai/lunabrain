import React, {useEffect, useState} from 'react';
import {Button, Switch, Tab, TabList} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";

interface SidebarProps {
}

export const Sidebar: React.FC<SidebarProps> = ({  }) => {
    const [tab, setTab] = useState<string>('providers');

    return (
        <div>
            {/*<TabList vertical size={"medium"}>*/}
            {/*    {previousChats.map((chat) => {*/}
            {/*        return <Tab key={chat.key} value={chat.key} icon={<Icon iconName={chat.icon} />}>{chat.name}</Tab>*/}
            {/*    })}*/}
            {/*</TabList>*/}
        </div>
    );
}