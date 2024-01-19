import {SourcePage} from "@/source/SourcePage";
import {useAuth} from "@/auth/state";
import {AuthForm} from "@/auth/AuthForm";
import {useEffect} from "react";

export function Home() {
    const { user , tryLogin} = useAuth();

    useEffect(() => {
        void tryLogin();
    }, []);

    // TODO breadchris implement loading
    if (false) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex-grow flex justify-center items-center">
                    <span className={"loading loading-spinner"} />
                </div>
            </div>
        )
    }
    return (
        <div className="h-screen flex flex-col gap-4 w-full">
            {user ? <SourcePage /> : <AuthForm allowRegister={true} />}
        </div>
    )
}
