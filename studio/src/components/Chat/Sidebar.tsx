import React, {useEffect, useState} from 'react';
import {projectService} from "@/lib/api";
import toast from "react-hot-toast";
import {Session} from "@/rpc/protoflow_pb";
import {Button, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import {Icon} from "@fluentui/react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {CollectPanel} from "@/components/Chat/CollectPanel";
import {PromptPanel} from "@/components/Chat/PromptPanel";

interface SidebarProps {
}

export const Sidebar: React.FC<SidebarProps> = ({  }) => {
    const [selectedValue, setSelectedValue] = useState<TabValue>('collect');

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    return (
        <>
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="collect">Collect</Tab>
                <Tab value="prompts">Prompts</Tab>
            </TabList>
            <div>
                {selectedValue === 'collect' && <CollectPanel />}
                {selectedValue === 'prompts' && <PromptPanel />}
            </div>
        </>
    );
}