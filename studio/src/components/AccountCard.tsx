import React, {useEffect, useState} from 'react';
import { Image, Text } from '@fluentui/react';
import {AuthForm} from './Auth/AuthForm';
import {Button, Card, CardHeader} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";
import {projectService, userService} from "@/service";
import toast from "react-hot-toast";

interface User {
    username: string;
    imageUrl: string;
}

interface AccountCardProps {
}

export const AccountCard: React.FC<AccountCardProps> = () => {
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
            <Card>
                <CardHeader
                    header={user.email}
                    action={<Button onClick={logout}>logout</Button>}
                    />
            </Card>
        </div>
    );
};
