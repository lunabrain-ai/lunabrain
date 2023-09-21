import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {List, PrimaryButton, Spinner, SpinnerSize, Stack, TextField} from "@fluentui/react";
import { Segment } from '@/rpc/protoflow_pb';
import {Message, messageColumns, MessageList} from "@/pages/Chat/MessageList";
import {useProjectContext} from "@/providers/ProjectProvider";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";

interface WindowProps {
}

const MessageWindow: React.FC = ({  }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
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
            <Stack verticalFill verticalAlign="space-between"
                   styles={{root: {height: '90vh', overflowY: 'auto', width: '100%', margin: '0 auto', paddingTop: 10, display: 'flex', flexDirection: 'column'}}}>
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
                        style={{ maxHeight: '90vh' }}
                        columns={messageColumns}
                        items={messages}
                        audioRef={audioRef}
                    />
                )}
            </Stack>
            <Stack>
                {session && (
                    <audio
                        ref={audioRef}
                        src={`/media/${session.id}`}
                        controls
                    />
                )}
            </Stack>
            <Stack horizontal verticalAlign="end" horizontalAlign="center"
                   styles={{root: {width: '100%', gap: 15, marginBottom: 20, relative: true}}}>
                <>
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
                </>
            </Stack>
        </>
    )
}

export const Window: React.FC<WindowProps> = ({  }) => {
    const { analyzedText } = useProjectContext();
    return (
        <Stack style={{ overflowY: 'auto'}}>
            {/*<MessageWindow />*/}
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
        </Stack>
    )
}
