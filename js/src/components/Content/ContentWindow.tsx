import React, {useState} from 'react';
import {List, PrimaryButton, Spinner, SpinnerSize, Stack, TextField} from "@fluentui/react";
import {Tag24Regular, Delete24Regular, TextT24Regular, Link24Regular, MusicNote224Regular} from "@fluentui/react-icons";
import {useProjectContext} from "@/providers/ProjectProvider";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";
import YouTube from "react-youtube";
import {AudioPlayer} from "@/components/AudioPlayer";
import {ContentList} from "@/components/Content/ContentList";
import {contentService} from "@/service";
import {
    Button,
    Card,
} from "@fluentui/react-components";
import {TagManager} from "@/components/TagManager";
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
    const [searchValue, setSearchValue] = useState<string | undefined>('');
    const { content, showTagTree, setShowTagTree, loadContent, selectedContent, setSelectedContent } = useProjectContext();
    const [inputType, setInputType] = useState<string>('url');

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

    const CreateCard = () => {
        return (
            <Card>
                <Stack>
                    <Stack.Item>
                        <MarkdownEditor />
                    </Stack.Item>
                    {selectedContent.length > 0 && (
                        <Stack horizontalAlign={'end'} tokens={{childrenGap: 3}}>
                            <Stack.Item>
                                <Button disabled={selectedContent.length === 0} onClick={deleteContent} icon={<Delete24Regular />} />
                            </Stack.Item>
                        </Stack>
                    )}
                </Stack>
            </Card>
        );
    }

    const SearchStack = () => {
        return (
            <Stack horizontal verticalAlign="end" horizontalAlign="center"
                   styles={{root: {width: '100%', gap: 15, paddingLeft: 10, paddingRight: 10, marginBottom: 20, relative: true}}}>
                <TextField
                    placeholder={`Search...`}
                    value={searchValue}
                    onChange={(e, newValue) => setSearchValue(newValue)}
                    underlined
                    styles={{root: {width: '100%'}}}
                />
                <PrimaryButton text="Search" onClick={() => {}}/>
            </Stack>
        )
    }

    return (
        <Stack style={{ padding: '5px', height: '95vh' }} verticalFill>
            <Stack.Item grow styles={{ root: { overflowY: 'auto' } }}>
                <Stack horizontal>
                    <Stack.Item style={{ width: '100%'}}>
                        <ContentList content={content} selectedContent={selectedContent} setSelectedContent={setSelectedContent} />
                    </Stack.Item>
                    <Stack.Item>
                        {showTagTree && (
                            <Stack style={{marginTop: 10}}>
                                <SearchStack />
                                <TagManager />
                            </Stack>
                        )}
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item disableShrink>
                {/*<SearchStack />*/}
                <CreateCard />
            </Stack.Item>
        </Stack>
    )
}
