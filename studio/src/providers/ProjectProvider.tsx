import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {projectService} from "@/lib/api";
import {Message} from "@/pages/Chat/MessageList";
import {Code, ConnectError} from "@bufbuild/connect";
import toast from "react-hot-toast";
import {TabValue} from "@fluentui/react-components";
import {AnalyzeConversationResponse, ChatResponse, Segment, Session, User} from "@/rpc/protoflow_pb";

const ProjectContext = createContext<ProjectContextType>({} as any);
export const useProjectContext = () => useContext(ProjectContext);

type ProjectProviderProps = {
    children: React.ReactNode;
};

type ProjectContextType = {
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    isRecording: boolean;
    setIsRecording: (isRecording: boolean) => void;
    selectedValue: TabValue;
    setSelectedValue: (selectedValue: TabValue) => void;
    streamMessages: (res: AsyncIterable<ChatResponse>) => void;
    session: Session | undefined;
    inferFromMessages: (prompt: string) => void;
    inference: string;
    user?: User;
    setUser: (user?: User) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    analyzedText?: AnalyzeConversationResponse;
    setAnalyzedText: (analyzedText?: AnalyzeConversationResponse) => void;
};

export default function ProjectProvider({children}: ProjectProviderProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<TabValue>('');
    const [session, setSession] = useState<Session|undefined>(undefined);
    const [inference, setInference] = useState<string>('');
    const [user, setUser] = useState<User|undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [analyzedText, setAnalyzedText] = useState<AnalyzeConversationResponse|undefined>(undefined);

    const inferFromMessages = useCallback(async (prompt: string) => {
        const mIdx = messages.length + 1;
        const m: Message = {text: prompt, sender: 'user', segment: new Segment()};
        setMessages((prev) => [...prev, m]);
        let i = '';
        try {
            const res = projectService.infer( {
                text: messages.map((m) => m.text),
                prompt,
            })
            for await (const exec of res) {
                setInference((prev) => exec.text || '');
                i = exec.text || '';
            }
        } catch (e: any) {
            toast.error(e.message);
            console.log(e);
        }
        setInference('');
        setMessages((prev) => [...prev, m, {...m, text: i}]);
    }, [messages, setMessages]);

    useEffect(() => {
        if (selectedValue !== '') {
            (async () => {
                const res = await projectService.getSession({
                    id: selectedValue as string,
                })
                setSession(res.session);
                // TODO breadchris components should use the session directly
                setMessages(res.session?.segments.map((m) => ({text: m.text || '', sender: 'bot', segment: m})) || []);
            })();
        }
    }, [selectedValue]);

    async function streamMessages(res: AsyncIterable<ChatResponse>) {
        setMessages([]);
        for await (const exec of res) {
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
        setLoading(false);
    }

    useEffect(() => {
        if (!isRecording) {
            return;
        }
        (async () => {
            try {
                const res = projectService.chat({}, {
                    timeoutMs: undefined,
                });
                await streamMessages(res);
            } catch (e) {
                if (e instanceof ConnectError && e.code != Code.Canceled) {
                    toast.error(e.message);
                    console.log(e);
                }
            }
        })();
    }, [isRecording]);

    return (
        <ProjectContext.Provider
            value={{
                messages,
                setMessages,
                isRecording,
                setIsRecording,
                selectedValue,
                setSelectedValue,
                streamMessages,
                session,
                inferFromMessages,
                inference,
                user,
                setUser,
                loading,
                setLoading,
                analyzedText,
                setAnalyzedText,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
