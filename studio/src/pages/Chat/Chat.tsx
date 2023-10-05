import React, {useEffect, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {Sidebar} from "@/pages/Chat/Sidebar";
import {MessageWindow} from "@/pages/Chat/Window";
import {AccountCard} from "@/components/AccountCard";

export const ChatPage = () => {
    return (
        <Stack styles={{root: {height: '100%', gap: 15, width: "100%"}}}>
            <Stack.Item>
                <AccountCard />
            </Stack.Item>
            <Stack.Item>
                <FileDrop>
                    <MessageWindow />
                </FileDrop>
            </Stack.Item>
        </Stack>
    );
};
