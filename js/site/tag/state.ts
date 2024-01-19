import {atom, useAtom} from "jotai/index";
import {Content, Tag} from "@/rpc/content/content_pb";
import {contentService} from "@/service";

const tagsAtom = atom<Tag[]>([]);
tagsAtom.debugLabel = 'tagsAtom';

export const useTags = () => {
    const [tags, setTags] = useAtom(tagsAtom);
    const getTags = async () => {
        const resp = await contentService.getTags({});
        setTags(resp.tags);
    }
    return {tags, getTags, setTags};
}
