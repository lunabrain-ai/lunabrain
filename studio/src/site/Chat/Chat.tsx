import React, {useEffect, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {Sidebar} from "@/site/Chat/Sidebar";
import {MessageWindow} from "@/site/Chat/Window";
import {AccountCard} from "@/components/AccountCard";
import {ContentSidebar} from "@/site/Chat/ContentSidebar";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Button} from "@fluentui/react-components";

export const ChatPage = () => {
    const {setSidebarIsOpen} = useProjectContext();
    return (
        <Stack styles={{root: {height: '100%', gap: 15, width: "100%"}}}>
            <ContentSidebar />
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between" styles={{root: {width: '100%'}}}>
                    <Button onClick={() => setSidebarIsOpen(true)}>Sidebar</Button>
                    <AccountCard />
                </Stack>
            </Stack.Item>
            <Stack.Item>
                <FileDrop>
                    <MessageWindow />
                </FileDrop>
            </Stack.Item>
        </Stack>
    );
};
