import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {List, PrimaryButton, Spinner, SpinnerSize, Stack, TextField} from "@fluentui/react";
import {Message, messageColumns, MessageList} from "@/site/Chat/MessageList";
import {useProjectContext} from "@/providers/ProjectProvider";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";
import YouTube from "react-youtube";
import {AudioPlayer} from "@/components/AudioPlayer";
import {ContentList} from "@/site/Chat/ContentList";
import {contentService} from "@/service";
import {urlContent} from "@/extension/util";

const MediaViewer: React.FC = ({  }) => {
    const { media } = useProjectContext();
    if (!media) {
        return null;
    }
    const u = new URL(media.url);
    if (media.type === 'youtube') {
        const id = u.searchParams.get('v')
        if (!id) {
            return null;
        }
        return <YouTube videoId={id} />;
    }
    if (media.type === 'audio') {
       return <AudioPlayer url={media.url} />;
    }
    return null;
}

const saveURL = async (url: string) => {
    try {
        const u = new URL(url);
    } catch (e) {
        console.error('invalid url', e);
        return;
    }
    try {
        const resp = await contentService.save({
            content: urlContent(url, ['app/input']),
            related: []
        });
        console.log(resp);
    } catch (e) {
        console.error('failed to save', e)
    }
}

export const MessageWindow: React.FC = ({  }) => {
    const [inputValue, setInputValue] = useState<string | undefined>('');
    const { content } = useProjectContext();

    const handleSend = () => {
        if (inputValue && inputValue.trim() !== '') {
            void saveURL(inputValue);
            setInputValue('');
        }
    };
    return (
        <Stack styles={{ root: { height: '100vh' } }} verticalFill>
            <Stack.Item grow disableShrink>
                <Stack horizontal verticalAlign="end" horizontalAlign="center"
                       styles={{root: {width: '100%', gap: 15, marginBottom: 20, relative: true}}}>
                    <TextField
                        placeholder="Enter a URL..."
                        value={inputValue}
                        onChange={(e, newValue) => setInputValue(newValue)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        underlined
                        styles={{root: {width: '100%'}}}
                    />
                    <PrimaryButton text="Send" onClick={handleSend}/>
                </Stack>
            </Stack.Item>
            <Stack.Item grow styles={{ root: { overflowY: 'auto' } }}>
                <Stack horizontal>
                    <Stack.Item>
                        <ContentList content={content} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    )
}

const EditorWindow: React.FC = ({  }) => {
    return (
        <>
            <Stack verticalFill verticalAlign="space-between"
                   styles={{root: {height: '90vh', overflowY: 'auto', width: '100%', margin: '0 auto', paddingTop: 10, display: 'flex', flexDirection: 'column'}}}>
                <MarkdownEditor />
            </Stack>
        </>
    )
}
