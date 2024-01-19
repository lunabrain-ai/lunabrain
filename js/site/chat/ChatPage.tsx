import React, {useEffect} from "react";
import {useAuth} from "@/auth/state";
import {AuthForm} from "@/auth/AuthForm";
import {Chat} from "@/chat/Chat";

export const ChatPage: React.FC<{}> = () => {
    const { user, tryLogin} = useAuth();

    useEffect(() => {
        void tryLogin();
    }, []);

    return (
        <div className="h-screen flex flex-col gap-4 w-full">
            <Chat />
        </div>
    )
}