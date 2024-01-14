import React, {useEffect, useState} from "react";
import {Content, Post, Site} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {notEmpty} from "@/util/predicates";
import {AddTagBadge} from "@/tag/AddTagBadge";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ContentEditor} from "@/source/ContentEditor";

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

// TODO breadchris it would be cool to register this component to a protobuf type that can be referenced in the options of a
// protobuf field to be used in the form.
export const SitePostSearch: React.FC<{site: Site, onUpdate: (s: Site) => void}> = ({site, onUpdate}) => {
    const [posts, setPosts] = useState<StoredPost[]>([]);
    const [selected, setSelected] = useState<StoredPost|undefined>(undefined);
    const [tags, setTags] = useState<string[]>(site.postTags);
    const [viewPost, setViewPost] = useState<Post|undefined>(undefined);

    useEffect(() => {
        void getPosts(tags);
    }, [tags]);

    const getPosts = async (tags: string[]) => {
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

    const updateSite = async (tags: string[]) => {
        setTags(tags);
        onUpdate(new Site({
            ...site,
            postTags: tags,
        }));
    }

    const viewContent = (post: Post) => {
        setViewPost(post);
    }

    return (
        <div>
            {/*{viewPost && (*/}
            {/*    <ContentEditor content={new Content({*/}
            {/*        id: selected?.id || '',*/}
            {/*        type: {*/}
            {/*            case: 'post',*/}
            {/*            value: viewPost,*/}
            {/*        },*/}
            {/*        tags: selected?.tags || [],*/}
            {/*    })} onUpdate={(s) => {}} />*/}
            {/*)}*/}
            <AddTagBadge onNewTag={(tag) => {
                void updateSite([...tags, tag]);
            }} />
            {tags.map((tag) => (
                <span key={tag} className="badge badge-outline badge-sm" onClick={() => {
                    void updateSite(tags.filter((t) => t !== tag));
                }}>{tag}</span>
            ))}
            <table className="table w-full">
                <thead>
                <tr>
                    {/*<th></th>*/}
                    <th>title</th>
                    <th>description</th>
                    <th>tags</th>
                </tr>
                </thead>
                <tbody>
                {posts.filter(notEmpty).map((item, index) => (
                    <tr key={index}>
                        {/*<td>*/}
                        {/*    <PencilSquareIcon onClick={() => viewContent(item.post)} className="h-5 w-5" />*/}
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