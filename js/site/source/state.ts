import {Content, EnumeratedSource, Post, Sources, VoiceInputResponse} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import { atom, useAtom } from "jotai";
import {useEffect, useState} from "react";
import {uuidv4} from "../../extension/util";

const sourcesAtom = atom<EnumeratedSource[]|undefined>(undefined);
sourcesAtom.debugLabel = 'sourcesAtom';
const selectedSourceAtom = atom<EnumeratedSource|undefined>(undefined);
selectedSourceAtom.debugLabel = 'selectedSourceAtom';
const typesAtom = atom<string[]>([]);
typesAtom.debugLabel = 'typesAtom';
const tagsAtom = atom<string[]>([]);
tagsAtom.debugLabel = 'tagsAtom';

export const useSources = () => {
    const [sources, setSources] = useAtom(sourcesAtom);
    const [selected, setSelected] = useAtom(selectedSourceAtom);
    const [types, setTypes] = useAtom(typesAtom);
    const [tags, setTags] = useAtom(tagsAtom);

    const getSources = async () => {
        const resp = await contentService.getSources({
            contentTypes: types,
            tags,
        });
        setSources(resp.sources);
        if (resp.sources.length > 0) {
            setSelected(resp.sources[0]);
        }
    };
    return {sources, selected, setSelected, getSources, types, setTypes, tags, setTags};
}

export const editorContent = 'editorContent';

const editedContentAtom = atom<Content|undefined>(new Content({
    type: {
        case: 'post',
        value: new Post({
            content: localStorage.getItem(editorContent) || "don't think, write.",
        })
    }
}));
editedContentAtom.debugLabel = 'editedContentAtom';
const selectedContentAtom = atom<Content|undefined>(undefined);
selectedContentAtom.debugLabel = 'selectedContentAtom';
const newContentAtom = atom<boolean>(false);
newContentAtom.debugLabel = 'newContent';

export const useContentEditor = () => {
    const [editedContent, setEditedContent] = useAtom(editedContentAtom);

    // TODO breachris this feels wrong
    const [selectedContent, setSelectedContent] = useAtom(selectedContentAtom);
    const [newContent, setNewContent] = useAtom(newContentAtom);

    const editContent = (content: Content|undefined) => {
        if (content === undefined) {
            window.history.pushState({}, '', `/app`);
            setEditedContent(undefined);
        } else {
            if (content.id !== undefined && content.id !== '') {
                window.history.pushState({}, '', `/app/content/${content.id}`);
            }
            setEditedContent(content);
        }
    }

    const changeContent = (content: Content) => {
        window.history.pushState({}, '', `/app`);
        setEditedContent(content);
        setNewContent(true);
    }

    const selectContent = (content: Content|undefined) => {
        if (content === undefined) {
            window.history.pushState({}, '', `/app`);
            setSelectedContent(undefined);
        } else {
            if (content.id !== undefined && content.id !== '') {
                window.history.pushState({}, '', `/app/content/${content.id}`);
            }
            setSelectedContent(content);
        }
    }
    return {
        editedContent,
        editContent,
        selectedContent,
        selectContent,
        changeContent,
        newContent,
        setNewContent
    };
}

const recordingAtom = atom<boolean>(false);
recordingAtom.debugLabel = 'recordingAtom';

export const useVoice = () => {
    const [recording, setRecording] = useAtom(recordingAtom);
    const [subscribers, setSubscribers] = useState<((r: string) => void)[]>([]);

    useEffect(() => {
        let stream: AsyncGenerator;
        const abortController = new AbortController();
        if (recording) {
            const stream = contentService.voiceInput({}, {
                signal: abortController.signal,
            });
            (async () => {
                try {
                    for await (const r of stream) {
                        console.log(r);
                        subscribers.forEach((s) => s(r.segment?.text || ''));
                    }
                } catch (e: any) {
                    if (e.name !== 'AbortError') {
                        console.error('Stream error:', e);
                    }
                }
            })();
        }

        return () => {
            abortController.abort();
            if (stream) {
                void stream.return({});
            }
        };
    }, [recording]);

    const start = (cb: (text: string) => void) => {
        setRecording(true);
        setSubscribers((s) => [...s, cb]);
    };

    const stop = () => {
        setRecording(false);
        // TODO breadchris this should just remove the subscriber that was added in start
        setSubscribers([]);
    };

    return { recording, start, stop };
};

declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface IResult {
    resultIndex: number;
    [index: number]: {
        transcript: string;
    };
}

const useInBrowserSpeechRecognition = (cb: (text: string) => void) => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        //recognition.interimResults = true;
        recognition.onresult = (event: {results: IResult[]}) => {
            const transcriptArray = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript);
            const transcript = transcriptArray.join('');
            cb(transcript);
        };

        recognition.onend = () => {
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
        };
        return recognition;
    } else {
        console.error('Browser does not support speech recognition.');
    }
    return undefined;
}