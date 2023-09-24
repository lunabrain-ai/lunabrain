import React, {useEffect, useState} from 'react';
import {Button, Divider, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import {CollectPanel} from "@/pages/Chat/CollectPanel";
import {PromptPanel} from "@/pages/Chat/PromptPanel";
import {AccountCard} from "@/components/AccountCard";

interface SidebarProps {
}

export const Sidebar: React.FC<SidebarProps> = ({  }) => {
    const [selectedValue, setSelectedValue] = useState<TabValue>('collect');

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    return (
        <>
            <AccountCard />
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="collect">Collect</Tab>
                <Tab value="prompts">Prompts</Tab>
            </TabList>
            <div style={{marginTop: "10px", height: '100vh', overflowY: 'auto'}}>
                {selectedValue === 'collect' && <CollectPanel />}
                {selectedValue === 'prompts' && <PromptPanel />}
            </div>
        </>
    );
}