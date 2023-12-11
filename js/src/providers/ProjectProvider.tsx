import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {contentService, projectService, userService} from "@/service";
import {Message} from "@/components/Content/MessageList";
import {Code, ConnectError} from "@bufbuild/connect";
import toast from "react-hot-toast";
import {TabValue} from "@fluentui/react-components";
import {ChatResponse, Segment, Session} from "@/rpc/protoflow_pb";
import { Content, StoredContent, Tag } from "@/rpc/content/content_pb";
import {Group, User } from "@/rpc/user/user_pb";

const ProjectContext = createContext<ProjectContextType>({} as any);
export const useProjectContext = () => useContext(ProjectContext);

export type UserSettings = {
    showPreviews: boolean;
    showQRCodes: boolean;
    showRelatedContent: boolean;
}

type ProjectProviderProps = {
    children: React.ReactNode;
};

type Media = {
    type: 'audio' | 'youtube';
    url: string;
}

type ProjectContextType = {
    messages: Message[];
    setMessages: (messages: Message[]) => void;

    content: StoredContent[];
    setContent: (content: StoredContent[]) => void;
    deleteContent: (ids: string[]) => void;

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
    media?: Media;
    setMedia: (media?: Media) => void;

    groups: Group[];
    currentGroup: string;
    setCurrentGroup: (groupID: string) => void;
    tags: Tag[];

    filteredTags: string[];
    addFilteredTag: (tag: string) => void;
    removeFilteredTag: (tag: string) => void;

    showTagTree: boolean;
    setShowTagTree: (showTagTree: boolean) => void;
    loadGroups: () => void;
    loadContent: () => void;
    loadTags: () => void;

    selectedContent: string[];
    setSelectedContent: (content: string[]) => void;

    userSettings: UserSettings;
    setUserSettings: (userSettings: UserSettings) => void;
};

export function groupURL(groupID: string) {
    return `/app/group/${groupID}`;
}

export default function ProjectProvider({children}: ProjectProviderProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState<StoredContent[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<TabValue>('');
    const [session, setSession] = useState<Session|undefined>(undefined);
    const [inference, setInference] = useState<string>('');
    const [user, setUser] = useState<User|undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [media, setMedia] = useState<Media|undefined>(undefined);
    const [groups, setGroups] = useState<Group[]>([]);
    const [currentGroup, setCurrentGroup] = useState<string>('home');
    const [tags, setTags] = useState<Tag[]>([]);
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [showTagTree, setShowTagTree] = useState<boolean>(true);
    const [selectedContent, setSelectedContent] = useState<string[]>([]);
    const [userSettings, setUserSettings] = useState<UserSettings>({
        showPreviews: false,
        showQRCodes: false,
        showRelatedContent: true,
    });

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setShowTagTree(false);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const addFilteredTag = (tag: string) => {
        setFilteredTags((prev) => [...prev, tag]);
    }

    const removeFilteredTag = (tag: string) => {
        setFilteredTags((prev) => prev.filter((t) => t !== tag));
    }

    const loadContent = async () => {
        const res = await contentService.search({
            tags: filteredTags,
            // TODO breadchris home is just the user's content
            groupID: currentGroup === 'home' ? undefined : currentGroup,
        });
        setContent(res.storedContent);
    }

    const loadTags = async () => {
        const res = await contentService.getTags({
            groupId: currentGroup === 'home' ? undefined : currentGroup,
        });
        setTags(res.tags);
    }

    useEffect(() => {
        void loadContent();
        void loadTags();
        if (user) {
            window.history.pushState({}, '', groupURL(currentGroup));
        }
    }, [user, filteredTags, currentGroup]);

    const loadGroups = async () => {
        const res = await userService.getGroups({});
        setGroups(res.groups);
    }

    useEffect(() => {
        if (!user) {
            (async () => {
                try {
                    const res = await userService.login({})
                    if (!res.email) {
                        console.warn('no user logged in')
                        return
                    }
                    setUser(res)
                } catch (e: any) {
                    console.error(e)
                }
            })();
        }
        void loadGroups();
    }, [user]);

    const deleteContent = async (ids: string[]) => {
        const res = await contentService.delete({
            contentIds: ids,
        })
        console.log(res)

        void loadContent();
    }

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

    return (
        <ProjectContext.Provider
            value={{
                messages,
                setMessages,
                content,
                setContent,
                deleteContent,
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
                media,
                setMedia,
                groups,
                setCurrentGroup,
                currentGroup,
                tags,
                loadGroups,
                loadContent,
                loadTags,

                filteredTags,
                addFilteredTag,
                removeFilteredTag,

                showTagTree,
                setShowTagTree,

                selectedContent,
                setSelectedContent,

                userSettings,
                setUserSettings,
            }}
        >
            {children}
        </ProjectContext.Provider>
    );
}
