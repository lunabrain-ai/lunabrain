import {Content, EnumeratedSource, Sources} from "@/rpc/content/content_pb";
import {useEffect, useState} from "react";
import {contentService} from "@/service";
import { atom, useAtom } from "jotai";

const sourcesAtom = atom<EnumeratedSource[]|null>(null);
const selectedSourceAtom = atom<EnumeratedSource|null>(null);

export const useSources = () => {
    const [sources, setSources] = useAtom(sourcesAtom);
    const [selected, setSelected] = useAtom(selectedSourceAtom);

    const getSources = async () => {
        const resp = await contentService.getSources({});
        setSources(resp.sources);
        if (resp.sources.length > 0) {
            setSelected(resp.sources[0]);
        }
    };

    useEffect(() => {
        void getSources();
    }, []);

    return {sources, selected, setSelected, getSources};
}

const selectedContentAtom = atom<Content|null>(null);

export const useContentEditor = () => {
    const [selected, setSelected] = useAtom(selectedContentAtom);
    useEffect(() => {
        if (selected) {
            window.history.pushState({}, '', `/app/content/${selected.id}`);
        }
    }, [selected]);
    return {selected, setSelected};
}
