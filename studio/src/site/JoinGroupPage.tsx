import React, {useEffect, useState} from 'react';
import {
    Spinner,
    Stack,
} from '@fluentui/react';
import {AuthForm} from "@/components/Auth/AuthForm";
import {useParams} from "react-router";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {Home} from "@/site/index";
import {Button} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";

const styles = {
    authContainer: {
        display: 'flex',
        height: '100vh',
        width: '100vw',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export const Join = () => {
    const { setCurrentGroup, user } = useProjectContext();
    const [success, setSuccess] = useState<boolean>(false);
    const [name, setName] = useState<string|undefined>(undefined);
    const { secret } = useParams();

    useEffect(() => {
        (async () => {
            const res = await userService.groupInfo({secret});
            setName(res.name);
        })();
    }, [secret]);

    const joinGroup = async () => {
        try {
            const res = await userService.joinGroup({secret});
            toast.success('Joined group');
            setSuccess(true)
            setCurrentGroup(res.id);
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to join group');
        }
    }

    if (success) {
        return <Home />
    }

    const info = name ? (
        <h3>Want to join {name}?</h3>
    ) : (
        <Spinner label="Loading group info..." />
    )

    const auth = !user ? (
        <>
            <AuthForm allowRegister={true} />
        </>
    ) : (
        <Button onClick={joinGroup}>Join Group</Button>
    )

    return (
        <div style={styles.authContainer}>
            <Stack
                horizontalAlign="center"
                verticalAlign="center"
                verticalFill
                tokens={{
                    childrenGap: 20,
                }}
            >
                {info}
                {auth}
            </Stack>
        </div>
    );
}
