import React, {useEffect, useState} from "react";
import {Badge, Button, Input, Tree, TreeItem, TreeItemLayout} from "@fluentui/react-components";
import { Tag } from "@/rpc/content/content_pb";
import {useProjectContext} from "@/providers/ProjectProvider";

export const TagManager = () => {
    const {tags, filteredTags, removeFilteredTag, addFilteredTag} = useProjectContext();
    const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
    return (
        <>
            <TagTree tags={tags} setSelectedTag={setSelectedTag} />
            <div>
                {selectedTag && (
                    <>
                        <Input value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} />
                        <Button onClick={() => selectedTag && addFilteredTag(selectedTag)}>Add Tag</Button>
                    </>
                )}
                <ul>
                    {filteredTags.map((g, idx) => <Badge key={`${g}-${idx}`} onClick={() => removeFilteredTag(g)}>{g}</Badge>)}
                </ul>
            </div>
        </>
    )
}

const TagTree: React.FC<{
    tags: Tag[], setSelectedTag: (tag: string) => void, path?: string,
}> = ({ tags, path, setSelectedTag }) => {
    return (
        <Tree aria-label="Default">
            {tags.map((t, idx) => {
                const tagPath = path ? `${path}/${t.name}` : t.name;
                return <TreeItem itemType={t.subTags.length > 0 ? "branch" : "leaf"} key={idx}>
                    <TreeItemLayout onClick={() => setSelectedTag(tagPath)}>{t.name}</TreeItemLayout>
                    {t.subTags.length > 0 && <TagTree tags={t.subTags} path={tagPath} setSelectedTag={setSelectedTag} />}
                </TreeItem>
            })}
        </Tree>
    );
};
