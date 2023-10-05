import React, {useEffect, useState} from 'react';
import {projectService} from "@/lib/service";
import toast from "react-hot-toast";
import {Session} from "@/rpc/protoflow_pb";
import {
    Button, Divider,
    Input,
    InputProps,
    SelectTabData,
    SelectTabEvent,
    Tab,
    TabList,
    TabValue
} from "@fluentui/react-components";
import {Icon, Label} from "@fluentui/react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {AudioRecorder} from "@/components/AudioRecorder";
import {FileUpload} from "@/components/FileUpload";

interface SidebarProps {
}

const CollectYouTube: React.FC = () => {
    const { streamMessages, setMedia } = useProjectContext()
    const [url, setUrl] = useState<string>('');

    const onChange: InputProps["onChange"] = (ev, data) => {
        setUrl(data.value);
    }

    const submitURL = async () => {
        try {
            setMedia({
                type: 'youtube',
                url,
            })
            const res = projectService.uploadContent({
                content: {
                    type: {
                        case: 'url',
                        value: {
                            url,
                        }
                    },
                },
            })
            streamMessages(res)
        } catch (e: any) {
            console.error(e)
            toast.error('Failed to upload content: ' + e.message)
        }
    }

    return (
        <>
            <Label style={{color: 'white'}} htmlFor={"url"}>URL</Label>
            <Input id={"url"} onChange={onChange} />
            <Button onClick={submitURL}>Submit</Button>
        </>
    )
}

export const CollectPanel: React.FC<SidebarProps> = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const { user, setSelectedValue, selectedValue, setIsRecording } = useProjectContext();

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    useEffect(() => {
        if (!user) {
            return;
        }
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
    }, [user, setSessions]);

    return (
        <>
            <Button onClick={() => setIsRecording(true)}>Live Transcribe</Button>
            <Divider style={{margin: "10px"}} />
            <CollectYouTube />
            <Divider style={{margin: "10px"}} />
            <AudioRecorder />
            <Divider style={{margin: "10px"}} />
            <FileUpload />
            <Divider style={{margin: "10px"}} />
            <TabList vertical size={"medium"} selectedValue={selectedValue} onTabSelect={onTabSelect}>
                {sessions.length === 0 && <Tab value={''}>No Sessions</Tab>}
                {sessions.map((s) => {
                    return (<Tab key={s.id} value={s.id} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        <span style={{color: 'red'}} onClick={() => {
                            projectService.deleteSession({id: s.id})
                        }}>x</span>
                        {s.name}
                    </Tab>)
                })}
            </TabList>
        </>
    );
}
