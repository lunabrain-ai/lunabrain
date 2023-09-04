import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {projectService} from "@/lib/api";
import {Message} from "@/components/Chat/MessageList";
import {Code, ConnectError} from "@bufbuild/connect";
import toast from "react-hot-toast";
import {TabValue} from "@fluentui/react-components";

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
};

export default function ProjectProvider({children}: ProjectProviderProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<TabValue>('');

    useEffect(() => {
        if (selectedValue !== '') {
            (async () => {
                const res = await projectService.getSession({
                    id: selectedValue as string,
                })
                setMessages(res.session?.segments.map((m) => ({text: m.text || '', sender: 'bot', segment: m})) || []);
            })();
        }
    }, [selectedValue]);

    useEffect(() => {
        if (!isRecording) {
            return;
        }
        (async () => {
            try {
                const res = projectService.chat({});
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
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
