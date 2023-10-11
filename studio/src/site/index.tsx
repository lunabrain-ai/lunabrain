import {ChatPage} from "@/site/Chat/Chat";
import {useParams} from "react-router";
import {useEffect} from "react";
import {useProjectContext} from "@/providers/ProjectProvider";

export function Home() {
    const { setCurrentGroup } = useProjectContext();
    const { groupID } = useParams();

    useEffect(() => {
        if (groupID) {
            setCurrentGroup(groupID);
        }
    }, [groupID]);

    return (
        <main>
            <ChatPage />
        </main>
    );
}
