import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {List, PrimaryButton, Spinner, SpinnerSize, Stack, TextField} from "@fluentui/react";
import {Message, messageColumns, MessageList} from "@/pages/Chat/MessageList";
import {useProjectContext} from "@/providers/ProjectProvider";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";
import YouTube from "react-youtube";
import {AudioPlayer} from "@/components/AudioPlayer";

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

const MessageWindow: React.FC = ({  }) => {
    const [inputValue, setInputValue] = useState<string | undefined>('');
    const { loading, messages, setMessages, session, inferFromMessages } = useProjectContext();

    const handleSend = () => {
        if (inputValue && inputValue.trim() !== '') {
            setInputValue('');
            inferFromMessages(inputValue);
        }
    };
    return (
        <>
            <Stack styles={{ root: { height: '100%' } }} verticalFill>
                <Stack.Item grow styles={{ root: { overflowY: 'auto' } }}>
                    {messages.length === 0 ? (
                        <>
                            {loading ? (
                                <Spinner size={SpinnerSize.large} label="Loading..." ariaLive="assertive" labelPosition="right" />
                            ) : (
                                <div style={{textAlign: 'center', color: '#0078d4', fontSize: 20, fontWeight: 'bold'}}>
                                    Welcome to LunaBrain Chat! Type, talk, or drag something! <br />Audio files must be .wav or .m4a.
                                </div>
                            )}
                        </>
                    ) : (
                        <MessageList
                            columns={messageColumns}
                            items={messages}
                        />
                    )}
                </Stack.Item>
                <Stack.Item grow disableShrink>
                    <Stack horizontal verticalAlign="end" horizontalAlign="center"
                           styles={{root: {width: '100%', gap: 15, marginBottom: 20, relative: true}}}>
                        <TextField
                            placeholder="Type a message..."
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
            </Stack>
        </>
    )
}

const EditorWindow: React.FC = ({  }) => {
    const { analyzedText } = useProjectContext();
    return (
        <>
            <Stack verticalFill verticalAlign="space-between"
                   styles={{root: {height: '90vh', overflowY: 'auto', width: '100%', margin: '0 auto', paddingTop: 10, display: 'flex', flexDirection: 'column'}}}>
                <MarkdownEditor />
            </Stack>
            <Stack horizontal verticalAlign="end" horizontalAlign="center"
                   styles={{root: {width: '100%', gap: 15, marginBottom: 20, relative: true}}}>
                {analyzedText && (
                    <>
                        <p>{analyzedText.summary}</p>
                        <p>{analyzedText.questions}</p>
                    </>
                )}
            </Stack>
        </>
    )
}

export const Window: React.FC = ({  }) => {
    return (
        <Stack style={{ overflowY: 'auto'}}>
            <MessageWindow />
        </Stack>
    )
}
