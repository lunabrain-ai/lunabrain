import React, {useEffect, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from '@fluentui/react';
import { Sidebar } from './Sidebar';
import { Window } from './Window';

export const ChatPage = () => {
    return (
        <Stack horizontal styles={{root: {height: '100vh', gap: 15, width: "100%"}}}>
            <Stack.Item
                grow={1}
                styles={{root: {borderRight: '1px solid #e1e1e1', padding: 10}}}>
                <Sidebar {...{
                }} />
            </Stack.Item>

            <Stack.Item grow={100}>
                <Window {...{
                }}/>
            </Stack.Item>
        </Stack>
    );
};
