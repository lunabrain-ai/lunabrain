import React, {useEffect, useState} from "react";
import {Content, Post, Section, Site} from "@/rpc/content/content_pb";
import {contentService} from "@/service";
import toast from "react-hot-toast";
import {notEmpty} from "@/util/predicates";
import {AddTagBadge} from "@/tag/AddTagBadge";
import {MagnifyingGlassIcon, MagnifyingGlassMinusIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useForm} from "react-hook-form";
import {MenuItem} from "@/rpc/content/blog_pb";

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
export const SectionEditor: React.FC<{
    section: Section,
    onUpdate: (s: Section) => void,
    onDelete: () => void,
}> = ({section, onUpdate, onDelete}) => {
    const [posts, setPosts] = useState<StoredPost[]>([]);
    const [selected, setSelected] = useState<StoredPost|undefined>(undefined);
    const [viewPost, setViewPost] = useState<Post|undefined>(undefined);
    const [tags, setTags] = useState<string[]>(section.tags);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [name, setName] = useState<string>(section.menu?.name ?? '');
    const fc = useForm();

    useEffect(() => {
        setPosts([]);
        setName(section.menu?.name ?? '');
        setTags(section.tags);
    }, [section]);

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

    const setSiteTags = async (tags: string[]) => {
        setTags(tags);
        onUpdate(new Section({
            ...section,
            tags: tags,
        }));
    }

    const viewContent = (post: Post) => {
        setViewPost(post);
    }

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    }

    return (
        <div className={"space-y-3"}>
            <input type="text" placeholder="name" className="input w-full max-w-xs" value={name} onChange={(e) => {
                setName(e.target.value);
                onUpdate(new Section({
                    ...section,
                    menu: new MenuItem({
                        ...section.menu,
                        name: e.target.value,
                    }),
                }));
            }} />
            <div className={"flex space-x-2"}>
                <AddTagBadge onNewTag={(tag) => {
                    void setSiteTags([...tags, tag]);
                }} />
                <button className="btn" onClick={toggleSearch}>
                    {showSearch ? <MagnifyingGlassMinusIcon className={"h-5 w-5"} /> : <MagnifyingGlassIcon className="h-5 w-5" />}
                </button>
                <button className="btn" onClick={onDelete}>
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            {tags.map((tag) => (
                <span key={tag} className="badge badge-outline badge-sm" onClick={() => {
                    void setSiteTags(tags.filter((t) => t !== tag));
                }}>{tag}</span>
            ))}
            {showSearch && (
                <table className="table w-full">
                    <thead>
                    <tr>
                        {/*<th></th>*/}
                        <th>title</th>
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
            )}
        </div>
    );
}

// const SectionForm: React.FC<{fc: FormControl}> = ({fc}) => {
//     const [formControl, setFormControl] = useAtom(formControlAtom);
//     const {fields, loadFormTypes} = useProtoForm();
//
//     useEffect(() => {
//         void loadFormTypes();
//         setFormControl(fc);
//     }, []);
//
//     if (fields === undefined) {
//         return null;
//     }
//
//     return (
//         <>
//             <Form fields={fields} />
//             <button className="btn btn-primary" onClick={() => {
//                 const c = cleanObject(formControl?.getValues().data);
//                 console.log(Section.fromJson(c));
//             }}>submit</button>
//         </>
//     )
// }
