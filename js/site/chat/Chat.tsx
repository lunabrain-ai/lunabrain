import {useAuth} from "@/auth/state";
import {useChat} from "@/chat/state";
import React, {useEffect, useState} from "react";
import {chatService} from "@/service";
import toast from "react-hot-toast";
import {unixToHumanReadable} from "@/util/time";
import {AuthForm} from "@/auth/AuthForm";

export const Chat = () => {
    const {user, logout} = useAuth();
    const {messages, getMessages} = useChat();
    const [message, setMessage] = useState<string>("");

    useEffect(getMessages, []);

    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const openModal = () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    };

    const sendMsg = async () => {
        const res = await chatService.sendMessage({
            message,
        });
        setMessage("");
    }
    return (
        <div className={"bg-opacity-0"}>
            <div className={"flex flex-row gap-2"}>
                {user ? (
                    <button className="btn" onClick={logout}>logout</button>
                ) : (
                    <button className="btn" onClick={openModal}>login</button>
                )}
                <dialog className="modal" ref={dialogRef}>
                    <div className="modal-box">
                        <AuthForm allowRegister={true} next={'/app/chat'} />
                        <div className="modal-action">
                            <form method="dialog">
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <a className="btn"
                   href={"https://paypal.me/ineedafix"}
                >
                    donate
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </a>
                <a className="btn"
                   href={"https://github.com/lunabrain-ai/lunabrain"}
                >
                    code
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                </a>
            </div>
            <div className={"flex flex-row gap-2"}>
                <input type="text" placeholder="Type here" value={message}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               void sendMsg();
                           }
                       }}
                       onChange={(e) => setMessage(e.target.value)} className="input input-bordered w-full max-w-xs" />
                <button className="btn" onClick={sendMsg}>Send</button>
            </div>
            <div className={"w-full"}>
                {messages.map((m, i) => (
                    <div className={"chat chat-start"} key={i}>
                        <div className="chat-header">
                            <span className={"mx-1"}>{m.user}</span>
                            <time className="text-xs opacity-50">{unixToHumanReadable(m.timestamp)}</time>
                        </div>
                        <div className={"chat-bubble"}>{m.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}