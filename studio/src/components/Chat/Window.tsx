import React, {useEffect, useRef, useState} from 'react';
import {List, PrimaryButton, Stack, TextField} from "@fluentui/react";
import {projectService} from "@/lib/api";
import {Switch} from "@fluentui/react-components";
import {Code, ConnectError} from "@bufbuild/connect";
import toast from "react-hot-toast";
import { Segment } from '@/rpc/protoflow_pb';
import {SubtleSelection, testColumns, testItems} from "@/components/Chat/MessageList";

export interface Message {
    text: string;
    sender: 'user' | 'bot';
    segment: Segment;
}

interface WindowProps {
}

export const Window: React.FC<WindowProps> = ({  }) => {
    const [inputValue, setInputValue] = useState<string | undefined>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const shouldStop = useRef(false);
    const abort = new AbortController();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    console.log(messages)

    useEffect(() => {
        if (shouldStop.current) {
            return;
        }
        (async () => {
            abort.signal.addEventListener('abort', () => {
                console.log('aborted');
            });
            try {
                const res = projectService.chat({}, { signal: abort.signal });
                for await (const exec of res) {
                    if (shouldStop.current) {
                        break;
                    }
                    setMessages((prev) => {
                        if (!exec.segment) {
                            return prev;
                        }
                        const newMsg: Message = {text: exec.segment?.text || '', sender: 'bot', segment: exec.segment};
                        const i = prev.findIndex((m) => m.segment.num === exec.segment?.num);
                        if (i !== -1) {
                            let newPrev = [...prev];
                            newPrev[i] = newMsg;
                            return newPrev;
                        }
                        return [...prev, newMsg];
                    });
                }
            } catch (e) {
                if (e instanceof ConnectError && e.code != Code.Canceled) {
                    toast.error(e.message);
                    console.log(e);
                }
            }
        })();
        return () => {
            shouldStop.current = false;
        }
    }, [setMessages, shouldStop.current]);

    const toggleChat = () => {
        shouldStop.current = !shouldStop.current;
        abort.abort()
    }

    const handleSend = () => {
        if (inputValue && inputValue.trim() !== '') {
            setMessages([...messages, {text: inputValue, sender: 'user', segment: new Segment({})}]);
            setInputValue('');
        }
    };

    return (
        <>
            <Stack verticalFill verticalAlign="space-between"
                   styles={{root: {height: '100vh', width: '100%', margin: '0 auto', paddingTop: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}}>
                {messages.length === 0 && (
                    <div style={{textAlign: 'center', color: '#0078d4', fontSize: 20, fontWeight: 'bold'}}>
                        Welcome to LunaBrain Chat! Type, talk, or drag something!
                    </div>
                )}
                <SubtleSelection
                    style={{ overflowY: 'auto', maxHeight: '90vh', flexGrow: 1 }}
                    columns={testColumns}
                    items={testItems}
                />
                {/*<List*/}
                {/*    style={{ overflowY: 'auto', maxHeight: '90vh', flexGrow: 1 }}*/}
                {/*    items={[...messages, undefined]}*/}
                {/*    onRenderCell={(message, idx) => {*/}
                {/*        console.log(message, idx, messages.length)*/}
                {/*        if (!message) {*/}
                {/*            return <div ref={messagesEndRef}></div>;*/}
                {/*        }*/}
                {/*        return (*/}
                {/*            <Stack horizontalAlign="stretch" styles={{root: {maxWidth: '100%'}}}>*/}
                {/*                <div style={{*/}
                {/*                    backgroundColor: message.sender === 'user' ? '#e1e1e1' : '#0078d4',*/}
                {/*                    padding: 10,*/}
                {/*                    borderRadius: 5,*/}
                {/*                    color: message.sender === 'user' ? 'black' : 'white',*/}
                {/*                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'*/}
                {/*                }}>*/}
                {/*                    {message.text}*/}
                {/*                </div>*/}
                {/*            </Stack>*/}
                {/*        )*/}
                {/*    }}*/}
                {/*/>*/}
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
                        <Switch label="Mute" onClick={toggleChat} checked={shouldStop.current.valueOf()} />
                    </>
                </Stack>
            </Stack>
        </>
    )
}
