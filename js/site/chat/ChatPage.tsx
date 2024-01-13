import React, {useEffect, useState} from "react";
import {chatService} from "@/service";
import {Message} from "@/rpc/chat/chat_pb";
import toast from "react-hot-toast";
import {atom, useAtom} from "jotai";

function unixToHumanReadable(unixTimestamp: bigint): string {
    const date = new Date(Number(unixTimestamp) * 1000);
    return date.toLocaleString();
}

const messagesAtom = atom<Message[]>([]);

export const ChatPage: React.FC<{}> = () => {
    const [user, setUser] = useState<string>("normie-"+Math.random());
    const [message, setMessage] = useState<string>("");

    const [messages, setMessages] = useAtom(messagesAtom);

    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            try {
                const res = chatService.receiveMessages({},{
                    signal: abortController.signal,
                });
                for await (const exec of res) {
                    setMessages((prev) => [exec, ...prev]);
                    console.log(messages)
                }
            } catch (e: any) {
                console.log(e);
                toast.error('Failed to receive messages');
            }
        })();
        return () => {
            abortController.abort();
        }
    }, []);

    const sendMsg = async () => {
        const res = await chatService.sendMessage({
            user,
            message,
        });
        setMessage("");
    }
    return (
        <div className={"bg-opacity-0"}>
            <div className={"flex flex-row gap-2"}>
                <input type="text" placeholder="username" value={user} onChange={(e) => setUser(e.target.value)} className="input input-bordered w-full max-w-xs" />
                <input type="text" placeholder="Type here" value={message} onChange={(e) => setMessage(e.target.value)} className="input input-bordered w-full max-w-xs" />
                <button className="btn" onClick={sendMsg}>Send</button>
            </div>
            <div className={"w-full"}>
                {messages.map((m, i) => (
                    <div className={"chat chat-start"} key={i}>
                        <div className="chat-header">
                            <span className={"mx-1"}>{m.user}</span>
                            <time className="text-xs opacity-50">{unixToHumanReadable(m.timestamp)}</time>
                        </div>
                        <div className={"chat-bubble" + " " + m.css}>{m.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}