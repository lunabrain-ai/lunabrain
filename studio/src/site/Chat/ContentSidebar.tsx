import React, {useState} from "react";
import {Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle} from "@fluentui/react-components/unstable";
import {Button, Input} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import {useProjectContext} from "@/providers/ProjectProvider";
import { Tree, TreeItem, TreeItemLayout } from "@fluentui/react-components";
import {baseURL, userService} from "@/service";
import toast from "react-hot-toast";
import { Tag } from "@/rpc/content/content_pb";
import {Stack} from "@fluentui/react";

export const TagTree: React.FC<{ tags: Tag[], path?: string, setFilteredTag: (tag: string) => void}> = ({ tags, path, setFilteredTag }) => {
    return (
        <>
            <Tree aria-label="Default">
                {tags.map((t, idx) => {
                    const tagPath = path ? `${path}/${t.name}` : t.name;
                    return <TreeItem itemType={t.subTags.length > 0 ? "branch" : "leaf"} key={idx}>
                        <TreeItemLayout onClick={() => setFilteredTag(tagPath)}>{t.name}</TreeItemLayout>
                        {t.subTags.length > 0 && <TagTree tags={t.subTags} path={tagPath} setFilteredTag={setFilteredTag} />}
                    </TreeItem>
                })}
            </Tree>
        </>
    );
};

const GroupManager = () => {
    const {groups, currentGroup} = useProjectContext();
    const [name, setName] = useState<string>('');
    const [invite, setInvite] = useState<string|undefined>(undefined);
    const addGroup = () => {
        try {
            const res = userService.createGroup({name})
            toast.success('Created group');
        } catch (e: any) {
            toast.error('Failed to create group');
            console.error(e);
        }
    }
    const deleteGroup = (id: string) => {
        try {
            const res = userService.deleteGroup({id})
            toast.success('Deleted group');
        } catch (e: any) {
            toast.error('Failed to delete group');
            console.error(e);
        }
    }
    const createInvite = async () => {
        try {
            const res = await userService.createGroupInvite({
                groupId: currentGroup,
            })
            toast.success('Created invite');
            setInvite(`${baseURL}/app/group/join/${res.secret}`);
        } catch (e: any) {
            toast.error('Failed to create invite');
            console.error(e);
        }
    }
    return (
        <Stack>
            <Stack.Item>
                <Button onClick={createInvite}>Create invite</Button>
                {invite && <a href={invite}>{invite}</a>}
            </Stack.Item>
            <Stack.Item>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={addGroup}>Add Group</Button>
                <ul>
                    {groups.map((g) => {
                        return <li key={g.id}>{g.name}<Button onClick={() => deleteGroup(g.id)}>Delete</Button></li>;
                    })}
                </ul>
            </Stack.Item>
        </Stack>
    );
}

export const ContentSidebar = () => {
    const {sidebarIsOpen, setSidebarIsOpen, tags, filteredTags, removeFilteredTag, addFilteredTag} = useProjectContext();
    const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

    return (
        <Drawer
            type={"overlay"}
            separator
            open={sidebarIsOpen}
            onOpenChange={(_, { open }) => setSidebarIsOpen(open)}
        >
            <DrawerHeader>
                <DrawerHeaderTitle
                    action={
                        <Button
                            appearance="subtle"
                            aria-label="Close"
                            icon={<Dismiss24Regular />}
                            onClick={() => setSidebarIsOpen(false)}
                        />
                    }
                >
                    Organization
                </DrawerHeaderTitle>
            </DrawerHeader>

            <DrawerBody>
                <h3>Groups</h3>
                <GroupManager />
                <h3>Tags</h3>
                <TagTree tags={tags} setFilteredTag={setSelectedTag} />
                <div>
                    {selectedTag && (
                        <>
                            <Input value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} />
                            <Button onClick={() => selectedTag && addFilteredTag(selectedTag)}>Add Tag</Button>
                        </>
                    )}
                    <ul>
                        {filteredTags.map((g) => {
                            return <li key={g}>{g}<Button onClick={() => removeFilteredTag(g)}>Delete</Button></li>;
                        })}
                    </ul>
                </div>
            </DrawerBody>
        </Drawer>
    );
}

