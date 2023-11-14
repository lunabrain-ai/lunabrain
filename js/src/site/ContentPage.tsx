import React, {useEffect} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {ContentWindow} from "@/components/Content/ContentWindow";
import {AccountCard} from "@/components/AccountCard";
import {useProjectContext} from "@/providers/ProjectProvider";
import {
    Button, Overflow,
    OverflowItem,
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    ToggleButton
} from "@fluentui/react-components";
import {GroupDialog} from "@/components/GroupManager";
import {Tag24Regular} from "@fluentui/react-icons";
import {OverflowMenu} from "@/components/OverflowMenu";

export const ContentPage = () => {
    const {groups, currentGroup, setCurrentGroup, showTagTree, setShowTagTree} = useProjectContext();
    const onTabSelect = (tabId: string) => {
        setCurrentGroup(tabId);
    };
    return (
        <Stack style={{height: '100vh', gap: 15, width: "100%"}}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%', overflowX: 'hidden'}}}>
                    <Overflow minimumVisible={1}>
                        <TabList selectedValue={currentGroup} onTabSelect={(_, d) => onTabSelect(d.value as string)}>
                            <OverflowItem id={'home'} priority={'home' === currentGroup ? 2 : 1}>
                                <Tab value={"home"}>my shit</Tab>
                            </OverflowItem>
                            {groups.map((g) => {
                                return (
                                    <OverflowItem key={g.id} id={g.id} priority={g.id === currentGroup ? 2 : 1}>
                                        <Tab key={g.id} value={g.id}>{g.name}</Tab>
                                    </OverflowItem>
                                )
                            })}
                            <OverflowMenu tabs={groups} onTabSelect={onTabSelect} />
                        </TabList>
                    </Overflow>
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
