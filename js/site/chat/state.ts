import {atom, useAtom} from "jotai/index";
import {Message} from "@/rpc/chat/chat_pb";
import {chatService} from "@/service";
import toast from "react-hot-toast";

const messagesAtom = atom<Message[]>([]);

export const useChat = () => {
    const [messages, setMessages] = useAtom(messagesAtom);
    const getMessages = () => {
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
    }
    return {messages, setMessages, getMessages};
}
