import * as React from "react";
import {useProjectContext} from "@/providers/ProjectProvider";
import {contentService, userService} from "@/service";
import toast from "react-hot-toast";
import {
    Badge, Button,
    Card,
    CardFooter,
    CardHeader,
    CardPreview, Input,
    Menu,
    MenuButton, MenuItem, MenuList, MenuPopover,
    MenuTrigger,
    Popover,
    PopoverSurface,
    PopoverTrigger
} from "@fluentui/react-components";
import {Checkbox, Stack} from "@fluentui/react";
import {truncateText} from "@/util/text";
import {IFrameSandbox} from "@/components/IFrameSandbox";
import {Vote} from "@/components/Vote";
import {
    AddCircle16Regular,
    Delete24Regular,
    MoreHorizontal20Regular,
    SubtractCircle16Regular,
    Search24Regular,
    PreviewLink16Regular,
    NoteAdd16Regular,
} from "@fluentui/react-icons";
import { StoredContent, Content } from "@/rpc/content/content_pb";
import {useStyles} from "@/components/Content/styles";
import QRCode from "@/components/QRCode";
import {useState} from "react";
import {FilteredTagInput} from "@/components/Content/FilteredTagInput";
import ReactMarkdown from "react-markdown";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";

export const ContentCard: React.FC<{
    item: StoredContent,
    setChecked: (checked: boolean) => void,
}> = ({ item, setChecked }) => {
    const { userSettings, loadTags, loadContent, addFilteredTag } = useProjectContext();
    const [preview, setPreview] = React.useState(false);

    const styles = useStyles();

    const addTag = async (tag: string) => {
        const newTags = [...item.tags.map(t => t.name), tag]
        try {
            const res = await contentService.setTags({
                contentId: item.id,
                tags: newTags,
            })
            toast.success('Added tag');

            // TODO breadchris anti-pattern, this should happen inside the provider
            void loadContent();
            void loadTags();
        } catch (e: any) {
            toast.error('Failed to add tag');
            console.error(e);
        }
    }

    const removeTag = async (tag: string) => {
        const newTags = item.tags.map(t => t.name).filter(t => t !== tag);
        try {
            const res = await contentService.setTags({
                contentId: item.id,
                tags: newTags,
            })
            toast.success('Added tag');

            // TODO breadchris anti-pattern, this should happen inside the provider
            void loadContent();
            void loadTags();
        } catch (e: any) {
            toast.error('Failed to add tag');
            console.error(e);
        }
    }

    const searchTag = (tag: string) => {
        addFilteredTag(tag);
    }

    const openURL = () => window.location.href = item.url

    const CardActions = () => {
       return (
           <Stack horizontal tokens={{childrenGap: 3}} style={{marginTop: 3}}>
               <PreviewLink16Regular onClick={() => setPreview(!preview)} />
           </Stack>
       )
    }

    return (
        <Card className={styles.card}
              floatingAction={
                  <Checkbox onChange={(ev, checked) => {setChecked(checked || false)}} />
              }
        >
            <CardHeader
                header={<><b>{item.user ? `${item.user.email}` : 'someone'}</b>&nbsp;shared&nbsp;<div style={{cursor: 'pointer'}} onClick={openURL}>{item.title}</div></>}
                description={<div style={{cursor: 'pointer'}} onClick={openURL}>{truncateText(item.description, 150)}</div>}
                image={<img style={{cursor: 'pointer'}} onClick={openURL} className={styles.headerImage} src={item.image} /> }
                action={<GroupButton contentId={item.id} />}
            />
            <CardPreview>
                <Stack horizontal>
                    {preview && (
                        <>
                            <Stack.Item grow={1}>
                                <Stack>
                                    <Stack.Item>
                                        <CardActions />
                                    </Stack.Item>
                                    <Stack.Item style={{maxHeight: '70vh', overflowY: 'auto'}}>
                                        <ReactMarkdown>{item.preview}</ReactMarkdown>
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>
                        </>
                    )}
                    {userSettings.showPreviews && (
                        <Stack.Item>
                            <IFrameSandbox url={item.url} />
                        </Stack.Item>
                    )}
                    {userSettings.showQRCodes && (
                        <Stack.Item>
                            <QRCode text={item.url} />
                        </Stack.Item>
                    )}
                    {userSettings.showRelatedContent && (
                        <Stack.Item>
                            {item.related.length > 0 && (
                                <Stack horizontal disableShrink tokens={{childrenGap: 5}} style={{width: '100%', overflowX: 'scroll', display: 'flex', flexFlow: 'row nowrap'}}>
                                    {item.related.map((r) => (
                                        <Stack.Item key={r.id} style={{width: 100}} grow>
                                            <RelatedContentCard key={r.id} content={r} />
                                        </Stack.Item>
                                    ))}
                                </Stack>
                            )}
                        </Stack.Item>
                    )}
                </Stack>
            </CardPreview>
            <CardFooter>
                <Stack style={{width: '100%', overflowX: 'auto'}} horizontal tokens={{childrenGap: 10}}>
                    <Stack.Item>
                        <Vote contentID={item.id} votes={item.votes} />
                    </Stack.Item>
                    <Stack.Item>
                        <CardActions />
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal tokens={{childrenGap: 3}}>
                            {item.tags.map((t, i) => (
                                <Popover key={i} withArrow trapFocus>
                                    <PopoverTrigger disableButtonEnhancement>
                                        <Badge key={i}>{t.name}</Badge>
                                    </PopoverTrigger>
                                    <PopoverSurface>
                                    <div>
                                        <Button icon={<Search24Regular />} onClick={() => searchTag(t.name)} aria-label={"search-tag"} />
                                        <Button icon={<Delete24Regular />} onClick={() => removeTag(t.name)} aria-label={"delete-tag"} />
                                    </div>
                                    </PopoverSurface>
                                </Popover>
                            ))}
                            <AddTagBadge onNewTag={addTag} />
                        </Stack>
                    </Stack.Item>
                </Stack>
            </CardFooter>
        </Card>
    )
}

type ContentDisplay = {
    type: string
    info: string
}

const contentDisplay = (content: Content): ContentDisplay|undefined => {
    switch (content.type.case) {
        case 'data':
            const d = content.type.value;
            switch (d.type.case) {
                case 'text':
                    return {
                        type: 'text',
                        info: d.type.value.data,
                    }
                case 'file':
                    return {
                        type: 'file',
                        info: d.type.value.file,
                    }
                case 'url':
                    return {
                        type: 'url',
                        info: d.type.value.url,
                    }
            }
            break;
        case 'normalized':
            const n = content.type.value;
            switch (n.type.case) {
                case 'article':
                    return {
                        type: 'article',
                        info: n.type.value.title,
                    }
            }
    }
    return undefined;
}

export const RelatedContentCard: React.FC<{
    content: Content,
    setChecked?: (checked: boolean) => void,
}> = ({ content, setChecked }) => {
    const cd = contentDisplay(content);
    if (!cd) {
        return null;
    }
    return (
        <Card
            floatingAction={
                <Checkbox onChange={(ev, checked) => {setChecked && setChecked(checked || false)}} />
            }
        >
            <CardHeader
                header={cd.type}
            />
            <CardPreview>
                <ReactMarkdown>
                    {cd.info}
                </ReactMarkdown>
            </CardPreview>
            <CardFooter>
                {content.tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
            </CardFooter>
        </Card>
    )
}

const GroupButton: React.FC<{ contentId: string, style?: React.CSSProperties}> = ({ contentId, style }) => {
    const { groups } = useProjectContext();
    const shareContent = async (groupId: string) => {
        try {
            const res = userService.share({
                groupId,
                contentId
            })
            toast.success('Shared content')
        } catch (e: any) {
            toast.error(e.message);
        }
    }
    return (
        <div style={style}>
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuButton
                        appearance="transparent"
                        icon={<MoreHorizontal20Regular />}
                        aria-label="More options"
                    />
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        {groups.map((g) => {
                            return <MenuItem key={g.id} onClick={() => shareContent(g.id)}>{g.name}</MenuItem>
                        })}
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    )
}

const AddTagBadge: React.FC<{ onNewTag: (tag: string) => void }> = ({ onNewTag }) => {
    const [addingTag, setAddingTag] = React.useState(false);
    const icon = addingTag ? <SubtractCircle16Regular /> : <AddCircle16Regular />;
    const [selectedTag, setSelectedTag] = useState<string>('');
    const onAddTag = (tag: string) => {
        if (tag) {
            setAddingTag(false);
            onNewTag(tag);
        }
    }

    // TODO breadchris add tag suggestion
    return (
        <Stack horizontal tokens={{childrenGap: 3}}>
            <Badge size="medium" onClick={() => setAddingTag(!addingTag)} style={{cursor: 'pointer'}} icon={icon} />
            {addingTag && (
                <FilteredTagInput selectedTag={selectedTag} setSelectedTag={setSelectedTag} onAddTag={onAddTag} />
            )}
        </Stack>
    )
}
