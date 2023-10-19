import React, {useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardHeader,
    Menu,
    MenuButton, MenuItem, MenuList,
    MenuPopover,
    MenuTrigger,
    Persona
} from "@fluentui/react-components";
import {ArrowCircleRightRegular} from "@fluentui/react-icons";
import {useProjectContext} from "@/providers/ProjectProvider";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {UserSettingsDialog} from "@/components/UserSettings";

interface User {
    username: string;
    imageUrl: string;
}

interface AccountCardProps {
}

export const AccountCard: React.FC<AccountCardProps> = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user, setUser } = useProjectContext();

    const logout = async () => {
        try {
            await userService.logout({})
            setUser(undefined)
            toast.success('Successfully logged out!')
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to logout: ' + e.message)
        }
    }

    if (!user) {
        return <p>Not logged in</p>;
    }

    return (
        <div>
            <UserSettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuButton>
                        <Persona
                            name={user.email}
                            textAlignment={'center'}
                        />
                    </MenuButton>
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                        <MenuItem onClick={() => setSettingsOpen(true)}>Settings</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    );
};