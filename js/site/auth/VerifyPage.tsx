import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {Home} from "@/home/Home";
import {AuthForm} from "@/auth/AuthForm";

export const VerifyPage = () => {
    const [success, setSuccess] = useState<boolean>(false);
    const { secret } = useParams();

    const verifyUser = async () => {
        try {
            const res = await userService.verifyUser({secret});
            toast.success('Joined group');
            setSuccess(true)
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to join group');
        }
    }

    useEffect(() => {
        void verifyUser();
    }, []);

    if (success) {
        return <AuthForm />
    }

    return (
        <div className="flex flex-col gap-5 h-screen w-screen justify-center items-center">
            <h3>Verifying...</h3>
            <span className={"loading loading-spinner"} />
        </div>
    );
}
