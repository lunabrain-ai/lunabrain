import React, {useEffect, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import {FileDrop} from "@/components/FileDrop";
import {Sidebar} from "@/pages/Chat/Sidebar";
import {Window} from "@/pages/Chat/Window";

export const ChatPage = () => {
    return (
        <Stack horizontal styles={{root: {height: '100%', gap: 15, width: "100%"}}}>
            <Stack.Item styles={{ root: { borderRight: '1px solid #e1e1e1', padding: 10, width: '20%' } }}>
                <Sidebar />
            </Stack.Item>

            <Stack.Item styles={{ root: { width: '80%', height: '100%', overflowY: 'auto' } }}>
                <FileDrop>
                    <Window />
                </FileDrop>
            </Stack.Item>
        </Stack>
    );
};
