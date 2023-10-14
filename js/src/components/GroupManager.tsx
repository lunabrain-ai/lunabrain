import {useProjectContext} from "@/providers/ProjectProvider";
import React, {useState} from "react";
import {baseURL, userService} from "@/service";
import toast from "react-hot-toast";
import {Stack} from "@fluentui/react";
import {
    Button, Caption1, Card, CardHeader,
    Dialog, DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger, Divider,
    Input, Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger
} from "@fluentui/react-components";
import {MoreHorizontal20Regular, PeopleCommunity24Regular} from "@fluentui/react-icons";

export const GroupDialog = () => {
    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button icon={<PeopleCommunity24Regular />} />
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Groups</DialogTitle>
                    <DialogContent>
                        <GroupManager />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
}

const GroupMenu: React.FC<{id: string, setInvite: (invite: string) => void}> = ({ id, setInvite }) => {
    const {loadGroups} = useProjectContext();
    const deleteGroup = async () => {
        try {
            const res = await userService.deleteGroup({id})
            toast.success('Deleted group');
            loadGroups();
        } catch (e: any) {
            toast.error('Failed to delete group');
            console.error(e);
        }
    }
    const createInvite = async () => {
        try {
            const res = await userService.createGroupInvite({
                groupId: id,
            })
            toast.success('Created invite');
            setInvite(`${baseURL}/app/group/join/${res.secret}`);
        } catch (e: any) {
            toast.error('Failed to create invite');
            console.error(e);
        }
    }
    return (
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton
                    appearance="transparent"
                    icon={<MoreHorizontal20Regular />}
                />
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    <MenuItem onClick={createInvite}>Invite</MenuItem>
                    <MenuItem onClick={deleteGroup}>Delete</MenuItem>
                </MenuList>
            </MenuPopover>
        </Menu>
    )
}

const GroupManager = () => {
    const {groups, loadGroups} = useProjectContext();
    const [name, setName] = useState<string>('');
    const [invite, setInvite] = useState<string|undefined>(undefined);
    const addGroup = async () => {
        try {
            const res = await userService.createGroup({name})
            toast.success('Created group');
            loadGroups();
        } catch (e: any) {
            toast.error('Failed to create group');
            console.error(e);
        }
    }
    return (
        <Stack tokens={{childrenGap: 10}}>
            <Stack.Item>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={addGroup}>Add Group</Button>
            </Stack.Item>
            <Divider />
            <Stack.Item>
                {invite && <a href={invite}>{invite}</a>}
                <Stack>
                    {groups.map((g) => {
                        return (
                            <Card key={g.id} size="small" role="listitem">
                                <CardHeader
                                    // image={{ as: "img", alt: "Word app logo" }}
                                    header={g.name}
                                    action={<GroupMenu id={g.id} setInvite={setInvite} />}
                                />
                            </Card>
                        )
                    })}
                </Stack>
            </Stack.Item>
        </Stack>
    );
}

