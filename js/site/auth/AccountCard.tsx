import React, { useState } from 'react';
import { useProjectContext } from "@/react/ProjectProvider";
import { userService } from "@/service";
import toast from "react-hot-toast";
import { UserSettingsDialog } from "@/auth/UserSettings";
import {UserIcon} from "@heroicons/react/24/outline";

interface User {
    username: string;
    imageUrl: string;
}

interface AccountCardProps {}

export const AccountCard: React.FC<AccountCardProps> = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user, setUser } = useProjectContext();

    const logout = async () => {
        try {
            await userService.logout({});
            setUser(undefined);
            toast.success('Successfully logged out!');
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to logout: ' + e.message);
        }
    };

    if (!user) {
        return <p>Not logged in</p>;
    }

    return (
        <div>
            <details className="dropdown">
                <summary className="btn m-1">
                    <UserIcon className="h-6 w-6" />
                </summary>
                <ul className="dropdown-content menu z-50 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a onClick={logout}>Logout</a></li>
                    <li><a onClick={() => setSettingsOpen(true)}>Settings</a></li>
                </ul>
            </details>
        </div>
    );
};
