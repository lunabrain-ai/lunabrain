import {ContentPage} from "@/site/Content/ContentPage";
import {useParams} from "react-router";
import {useEffect} from "react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {AuthLandingPage} from "@/site/AuthLandingPage";

export function Home() {
    const { user } = useProjectContext();
    if (!user) {
        return <AuthLandingPage />
    }
    return <ContentPage />
}
