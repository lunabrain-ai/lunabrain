import React, {useEffect, useState} from 'react';
import {AuthForm} from "@/auth/AuthForm";
import {useParams} from "react-router";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {useProjectContext} from "@/react/ProjectProvider";
import {Home} from "@/home/Home";

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
        <span className={"loading loading-spinner"} />
    )

    const auth = !user ? (
        <>
            <AuthForm allowRegister={true} />
        </>
    ) : (
        <button className={"btn"} onClick={joinGroup}>Join Group</button>
    )

    return (
        <div className="flex flex-col gap-5 h-screen w-screen justify-center items-center">
            {info}
            {auth}
        </div>
    );
}
