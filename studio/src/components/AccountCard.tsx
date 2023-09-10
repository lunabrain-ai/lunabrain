import React, {useEffect, useState} from 'react';
import { Image, Text } from '@fluentui/react';
import {AuthForm} from './AuthForm';
import {Button} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";
import {projectService} from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    username: string;
    imageUrl: string;
}

interface AccountCardProps {
}

export const AccountCard: React.FC<AccountCardProps> = () => {
    const { user, setUser } = useProjectContext();
    const [showAuthForm, setShowAuthForm] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await projectService.login({})
                setUser(res)
            } catch (e: any) {
                console.error(e)
            }
        })();
    }, []);

    const logout = async () => {
        try {
            await projectService.logout({})
            setUser(undefined)
            toast.success('Successfully logged out!')
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to logout: ' + e.message)
        }
    }

    if (showAuthForm && !user) {
        return <AuthForm />;
    }

    return (
        <div>
            {user ? (
                <div>
                    <p>{user.email}</p>
                    <Button onClick={logout}>logout</Button>
                </div>
            ) : (
                <Button onClick={() => setShowAuthForm(true)}>
                    Login
                </Button>
            )}
        </div>
    );
};
