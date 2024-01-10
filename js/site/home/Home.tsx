import {useProjectContext} from "@/react/ProjectProvider";
import {ContentPage} from "@/content/ContentPage";
import {AuthLandingPage} from "@/auth/AuthLandingPage";
import {SourcePage} from "@/source/SourcePage";

export function Home() {
    const { user, loading } = useProjectContext();
    if (loading) {
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
            {user ? <SourcePage /> : <AuthLandingPage />}
        </div>
    )
}
