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
    MenuTrigger
} from "@fluentui/react-components";
import {Checkbox, Stack} from "@fluentui/react";
import {truncateText} from "@/util/text";
import {IFrameSandbox} from "@/components/IFrameSandbox";
import {Vote} from "@/components/Vote";
import {AddCircle16Regular, MoreHorizontal20Regular, SubtractCircle16Regular} from "@fluentui/react-icons";
import { StoredContent, Content } from "@/rpc/content/content_pb";
import {useStyles} from "@/components/Content/styles";
import QRCode from "@/components/QRCode";

export const ContentCard: React.FC<{
    item: StoredContent,
    setChecked: (checked: boolean) => void,
}> = ({ item, setChecked }) => {
    const { userSettings } = useProjectContext();

    const styles = useStyles();

    const addTag = async (tag: string) => {
        item.content?.tags.push(tag)
        try {
            const res = await contentService.setTags({
                contentId: item.id,
                tags: item.content?.tags,
            })
            toast.success('Added tag');
        } catch (e: any) {
            toast.error('Failed to add tag');
            console.error(e);
        }
    }

    const openURL = () => window.location.href = item.url

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
                {userSettings.showPreviews && (
                    <IFrameSandbox url={item.url} />
                )}
                {userSettings.showQRCodes && (
                    <QRCode text={item.url} />
                )}
                {userSettings.showRelatedContent && (
                    <>
                        {item.related.length > 0 && (
                            <Stack horizontal disableShrink tokens={{childrenGap: 5}} style={{width: '100%', overflowX: 'scroll', display: 'flex', flexFlow: 'row nowrap'}}>
                                {item.related.map((r) => (
                                    <Stack.Item key={r.id} style={{width: 100}} grow>
                                        <RelatedContentCard key={r.id} content={r} />
                                    </Stack.Item>
                                ))}
                            </Stack>
                        )}
                    </>
                )}
            </CardPreview>
            <CardFooter>
                <Stack style={{width: '100%'}} horizontal tokens={{childrenGap: 10}}>
                    <Stack.Item>
                        <Vote contentID={item.id} votes={item.votes} />
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal tokens={{childrenGap: 3}}>
                            {item.content?.tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
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

const RelatedContentCard: React.FC<{content: Content}> = ({ content }) => {
    const cd = contentDisplay(content);
    if (!cd) {
        return null;
    }
    console.log(cd)
    return (
        <Card>
            <CardHeader
                header={cd.type}
            />
            <CardPreview>
                {cd.info}
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
    const [tag, setTag] = React.useState<string>('');
    const [addingTag, setAddingTag] = React.useState(false);
    const icon = addingTag ? <SubtractCircle16Regular /> : <AddCircle16Regular />;
    const addTag = () => {
        setAddingTag(false);
        onNewTag(tag);
    }

    // TODO breadchris add tag suggestion
    return (
        <Stack horizontal tokens={{childrenGap: 3}}>
            <Badge size="medium" onClick={() => setAddingTag(!addingTag)} style={{cursor: 'pointer'}} icon={icon} />
            {addingTag && (
                <>
                    <Input placeholder="Add tag" value={tag} onChange={(e) => setTag(e.target.value)} />
                    <Button onClick={addTag}>Add</Button>
                </>
            )}
        </Stack>
    )
}
