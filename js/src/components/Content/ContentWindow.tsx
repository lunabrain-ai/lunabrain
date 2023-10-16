import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {List, PrimaryButton, Spinner, SpinnerSize, Stack, TextField} from "@fluentui/react";
import {Tag24Regular, Delete24Regular} from "@fluentui/react-icons";
import {useProjectContext} from "@/providers/ProjectProvider";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";
import YouTube from "react-youtube";
import {AudioPlayer} from "@/components/AudioPlayer";
import {ContentList} from "@/components/Content/ContentList";
import {contentService} from "@/service";
import {urlContent} from "@/extension/util";
import {Button, Select, SelectProps, Switch, ToggleButton} from "@fluentui/react-components";
import {TagManager} from "@/components/TagManager";
import {GroupDialog} from "@/components/GroupManager";
import toast from "react-hot-toast";

const MediaViewer: React.FC = ({  }) => {
    const { media } = useProjectContext();
    if (!media) {
        return null;
    }
    const u = new URL(media.url);
    if (media.type === 'youtube') {
        const id = u.searchParams.get('v')
        if (!id) {
            return null;
        }
        return <YouTube videoId={id} />;
    }
    if (media.type === 'audio') {
       return <AudioPlayer url={media.url} />;
    }
    return null;
}

export const ContentWindow: React.FC = ({  }) => {
    const [inputValue, setInputValue] = useState<string | undefined>('');
    const { content, showTagTree, setShowTagTree, loadContent } = useProjectContext();
    const [selectedContent, setSelectedContent] = useState<string[]>([]);
    const [inputType, setInputType] = useState<string>('url');

    const saveURL = async (url: string) => {
        try {
            const u = new URL(url);
        } catch (e) {
            console.error('invalid url', e);
            return;
        }
        try {
            const resp = await contentService.save({
                content: urlContent(url, ['app/input']),
                related: []
            });
            console.log(resp);
            toast.success('Saved content');
        } catch (e) {
            toast.error('Failed to save content');
            console.error('failed to save', e)
        }
    }

    const handleSend = async () => {
        if (inputValue && inputValue.trim() !== '') {
            if (inputType === 'url') {
                await saveURL(inputValue);
                void loadContent();
            }
            setInputValue('');
        }
    };

    const deleteContent = async () => {
        try {
            const res = await contentService.delete({
                contentIds: selectedContent
            })
            toast.success('Deleted content');
            setSelectedContent([]);
            loadContent();
        } catch (e: any) {
            console.error(e);
            toast.error('Failed to delete content');
        }
    }

    const onInputTypeChange: SelectProps["onChange"] = (event, data) => {
        setInputType(data.value);
    };

    return (
        <Stack styles={{ root: { height: '100vh' } }} verticalFill>
            <Stack.Item disableShrink>
                <Stack horizontal verticalAlign="end" horizontalAlign="center"
                       styles={{root: {width: '100%', gap: 15, paddingLeft: 10, paddingRight: 10, marginBottom: 20, relative: true}}}>
                    <ToggleButton checked={showTagTree} onClick={() => setShowTagTree(!showTagTree)} icon={<Tag24Regular />} />
                    <Select onChange={onInputTypeChange} value={inputType}>
                        <option>url</option>
                        <option>prompt</option>
                    </Select>
                    <TextField
                        placeholder={`Enter a ${inputType}...`}
                        value={inputValue}
                        onChange={(e, newValue) => setInputValue(newValue)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        underlined
                        styles={{root: {width: '100%'}}}
                    />
                    <PrimaryButton text="Send" onClick={handleSend}/>
                    <Button disabled={selectedContent.length === 0} onClick={deleteContent} icon={<Delete24Regular />} />
                </Stack>
            </Stack.Item>
            <Stack.Item grow styles={{ root: { overflowY: 'auto' } }}>
                <Stack horizontal>
                    <Stack.Item>
                        {showTagTree && (
                            <TagManager />
                        )}
                    </Stack.Item>
                    <Stack.Item style={{width: '100%'}}>
                        <ContentList content={content} selectedContent={selectedContent} setSelectedContent={setSelectedContent} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    )
}

const EditorWindow: React.FC = ({  }) => {
    return (
        <>
            <Stack verticalFill verticalAlign="space-between"
                   styles={{root: {height: '90vh', overflowY: 'auto', width: '100%', margin: '0 auto', paddingTop: 10, display: 'flex', flexDirection: 'column'}}}>
                <MarkdownEditor />
            </Stack>
        </>
    )
}
