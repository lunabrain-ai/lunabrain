import React from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {ContentWindow} from "@/components/Content/ContentWindow";
import {AccountCard} from "@/components/AccountCard";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Button, SelectTabData, SelectTabEvent, Tab, TabList, ToggleButton} from "@fluentui/react-components";
import {GroupDialog} from "@/components/GroupManager";
import {Tag24Regular} from "@fluentui/react-icons";

export const ContentPage = () => {
    const {groups, currentGroup, setCurrentGroup, showTagTree, setShowTagTree} = useProjectContext();
    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setCurrentGroup(data.value as string);
    };
    return (
        <Stack style={{height: '100vh', gap: 15, width: "100%"}}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%'}}}>
                    <TabList selectedValue={currentGroup} onTabSelect={onTabSelect}>
                        <Tab value={"home"}>my shit</Tab>
                        {groups.map((g) => {
                            return <Tab key={g.id} value={g.id}>{g.name}</Tab>;
                        })}
                    </TabList>
                    <Stack horizontal tokens={{ childrenGap: 5}}>
                        <ToggleButton checked={showTagTree} onClick={() => setShowTagTree(!showTagTree)} icon={<Tag24Regular />} />
                        <GroupDialog />
                        <AccountCard />
                    </Stack>
                </Stack>
            </Stack.Item>
            <Stack.Item>
                <FileDrop>
                    <ContentWindow />
                </FileDrop>
            </Stack.Item>
        </Stack>
    );
};
