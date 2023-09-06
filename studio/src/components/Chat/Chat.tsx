import React, {useEffect, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import { Sidebar } from './Sidebar';
import { Window } from './Window';
import {FileDrop} from "@/components/FileDrop";

export const ChatPage = () => {
    return (
        <Stack horizontal styles={{root: {height: '100vh', gap: 15, width: "100%"}}}>
            <Stack.Item styles={{ root: { borderRight: '1px solid #e1e1e1', padding: 10, width: '20%' } }}>
                <Sidebar />
            </Stack.Item>

            <Stack.Item styles={{ root: { width: '80%' } }}>
                <FileDrop>
                    <Window />
                </FileDrop>
            </Stack.Item>
        </Stack>
    );
};
