import React from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {ContentWindow} from "@/site/Content/ContentWindow";
import {AccountCard} from "@/components/AccountCard";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Button, SelectTabData, SelectTabEvent, Tab, TabList} from "@fluentui/react-components";

export const ContentPage = () => {
    const {groups, currentGroup, setCurrentGroup} = useProjectContext();
    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setCurrentGroup(data.value as string);
    };
    return (
        <Stack styles={{root: {height: '100%', gap: 15, width: "100%"}}}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%'}}}>
                    <TabList selectedValue={currentGroup} onTabSelect={onTabSelect}>
                        <Tab value={"home"}>my shit</Tab>
                        {groups.map((g) => {
                            return <Tab key={g.id} value={g.id}>{g.name}</Tab>;
                        })}
                    </TabList>
                    <AccountCard />
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
