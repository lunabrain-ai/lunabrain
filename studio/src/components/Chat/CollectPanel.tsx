import React, {useEffect, useState} from 'react';
import {projectService} from "@/lib/api";
import toast from "react-hot-toast";
import {Session} from "@/rpc/protoflow_pb";
import {Button, SelectTabData, SelectTabEvent, Tab, TabList, TabValue} from "@fluentui/react-components";
import {Icon} from "@fluentui/react";
import {useProjectContext} from "@/providers/ProjectProvider";

interface SidebarProps {
}

export const CollectPanel: React.FC<SidebarProps> = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const { setSelectedValue, selectedValue, isRecording, setIsRecording } = useProjectContext();

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    useEffect(() => {
        (
            async () => {
                try {
                    const sessions = await projectService.getSessions({})
                    setSessions(sessions.sessions);
                } catch (e: any) {
                    toast.error('Failed to load sessions: ' + e.message)
                    console.error(e)
                }
            }
        )()
    }, [setSessions]);

    return (
        <div style={{ overflowY: 'auto', height: '100%'}}>
            <Button onClick={() => setIsRecording(true)}>Live Transcribe</Button>
            <TabList vertical size={"medium"} selectedValue={selectedValue} onTabSelect={onTabSelect}>
                {sessions.map((s) => {
                    return <Tab key={s.id} value={s.id} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{s.name}</Tab>
                })}
            </TabList>
        </div>
    );
}
