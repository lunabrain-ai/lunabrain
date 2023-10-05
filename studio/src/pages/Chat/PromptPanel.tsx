import React, {useEffect, useState} from 'react';
import {projectService} from "@/lib/service";
import toast from "react-hot-toast";
import {Prompt, Session} from "@/rpc/protoflow_pb";
import {
    Button,
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

interface SidebarProps {
}

export const PromptPanel: React.FC<SidebarProps> = ({  }) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const { setSelectedValue, selectedValue, inferFromMessages } = useProjectContext();

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        inferFromMessages(data.value as string);
    };

    useEffect(() => {
        (
            async () => {
                try {
                    const prompts = await projectService.getPrompts({})
                    setPrompts(prompts.prompts);
                } catch (e: any) {
                    toast.error('Failed to load prompts: ' + e.message)
                    console.error(e)
                }
            }
        )()
    }, [setPrompts]);

    const onChange: InputProps["onChange"] = (ev, data) => {
        setPrompt(data.value);
    }

    const submitURL = async () => {
        const res = projectService.newPrompt({
            text: prompt,
        })
    }

    return (
        <div style={{ overflowY: 'auto', height: '100%'}}>
            <Label style={{color: 'white'}} htmlFor={"url"}>Prompt</Label>
            <Input id={"url"} onChange={onChange} />
            <Button onClick={submitURL}>Submit</Button>
            <TabList vertical size={"medium"} selectedValue={selectedValue} onTabSelect={onTabSelect}>
                {prompts.map((s) => {
                    return <Tab key={s.id} value={s.text} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{s.text}</Tab>
                })}
            </TabList>
        </div>
    );
}
