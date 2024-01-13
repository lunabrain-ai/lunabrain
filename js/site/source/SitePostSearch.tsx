import React, {useEffect, useState} from "react";
import {Content, Post, Site} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {notEmpty} from "@/util/predicates";
import {AddTagBadge} from "@/tag/AddTagBadge";

type StoredPost = {
    id: string;
    tags: string[];
    post: Post;
}

function getPost(value: Content | null | undefined): StoredPost|undefined {
    if (value?.type.case === 'post') {
        return {
            id: value.id,
            tags: value.tags,
            post: value.type.value,
        }
    }
    return undefined;
}

export const SitePostSearch: React.FC<{site: Site}> = ({site}) => {
    const [posts, setPosts] = useState<StoredPost[]>([]);
    const [selected, setSelected] = useState<StoredPost|undefined>(undefined);
    const [tags, setTags] = useState<string[]>(site.postTags);

    const getPosts = async () => {
        try {
            const res = await contentService.search({
                tags: tags,
            });
            setPosts(res.storedContent
                .map((sc) => getPost(sc.content))
                .filter(notEmpty));
        } catch (e) {
            console.error(e);
            toast.error('Failed to get posts');
        }
    }

    const handleCheckboxChange = (content: StoredPost|undefined, isChecked: boolean) => {
        if (isChecked && content) {
            setSelected(content);
        }
        if (!isChecked) {
            setSelected(undefined);
        }
    };

    useEffect(() => {
        void getPosts();
    }, [tags]);

    return (
        <div>
            <h5>Find posts for site</h5>
            <AddTagBadge onNewTag={(tag) => {
                setTags([...tags, tag]);
            }} />
            {tags.map((tag) => (
                <span key={tag} className="badge badge-outline badge-sm" onClick={() => {
                    setTags(tags.filter((t) => t !== tag));
                }}>{tag}</span>
            ))}
            <table className="table w-full">
                <thead>
                <tr>
                    <th>title</th>
                    <th>description</th>
                    <th>tags</th>
                </tr>
                </thead>
                <tbody>
                {posts.filter(notEmpty).map((item, index) => (
                    <tr key={index}>
                        {/*<td>*/}
                        {/*    <input*/}
                        {/*        type="checkbox"*/}
                        {/*        className="checkbox checkbox-accent"*/}
                        {/*        checked={selected?.id === item.id}*/}
                        {/*        onChange={(e) => handleCheckboxChange(item, e.target.checked)}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        <td>{item.post.title}</td>
                        <td className="max-w-xs truncate text-gray-500 font-normal">{item.post.summary}</td>
                        <td>
                            <div className="flex gap-3">
                                {item.tags.map((tag) => (
                                    <span key={tag} className="badge badge-outline badge-sm">{tag}</span>
                                ))}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}