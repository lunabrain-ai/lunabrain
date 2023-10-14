import * as React from "react";
import {
    shorthands,
    Card,
    CardHeader,
    CardPreview,
    CardFooter,
    Badge,
    makeStyles,
    tokens,
    Menu,
    MenuTrigger,
    MenuButton,
    MenuPopover, MenuList, MenuItem, Button,
} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Article, Content, Data, Normalized, StoredContent } from "@/rpc/content/content_pb";
import {Checkbox, IconButton, IStackTokens, Stack} from "@fluentui/react";
import {MoreHorizontal20Regular, AddCircle16Regular} from "@fluentui/react-icons";
import {Vote} from "@/components/Vote";
import {userService} from "@/service";
import toast from "react-hot-toast";
import {IFrameSandbox} from "@/components/IFrameSandbox";
import QRCode from "@/components/QRCode";

interface ContentListProps {
    content: StoredContent[];
    selectedContent: string[];
    setSelectedContent: (content: string[]) => void;
}

const useStyles = makeStyles({
    main: {
        ...shorthands.gap("36px"),
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
    },

    card: {
        maxWidth: "100%",
        height: "fit-content",
    },

    section: {
        width: "fit-content",
    },

    title: {
        ...shorthands.margin(0, 0, "12px"),
    },

    horizontalCardImage: {
        width: "64px",
        height: "64px",
    },

    headerImage: {
        ...shorthands.borderRadius("4px"),
        maxWidth: "80px",
        maxHeight: "80px",
    },

    caption: {
        color: tokens.colorNeutralForeground3,
    },

    text: {
        ...shorthands.margin(0),
    },

    stackItem: {
        width: '100%',
    }
});

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

const ArticleCard: React.FC<{
    item: StoredContent,
    setChecked: (checked: boolean) => void,
}> = ({ item, setChecked }) => {
    const { userSettings } = useProjectContext();

    const styles = useStyles();

    const addTag = () => {
    }

    const openURL = () => window.location.href = item.url

    return (
        <Card className={styles.card}
              floatingAction={
                  <Checkbox onChange={(ev, checked) => {setChecked(checked || false)}} />
              }
        >
            <CardHeader
                header={<b style={{cursor: 'pointer'}} onClick={openURL}>{item.title}</b>}
                description={<div style={{cursor: 'pointer'}} onClick={openURL}>{item.description}</div>}
                image={<img style={{cursor: 'pointer'}} onClick={openURL} className={styles.headerImage} src={item.image} /> }
                action={<GroupButton contentId={item.id} />}
            />
            <CardPreview>
                {userSettings.showPreviews && (
                    <IFrameSandbox url={item.url} />
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
                            <Badge size="medium" onClick={addTag} style={{cursor: 'pointer'}} icon={<AddCircle16Regular />} />
                        </Stack>
                    </Stack.Item>
                </Stack>
            </CardFooter>
        </Card>
    )
}

const ContentView: React.FC<{
    item: StoredContent,
    setChecked: (checked: boolean) => void,
}> = ({ item, setChecked }) => {
    const {userSettings} = useProjectContext();
    const c = item.content;
    if (!c) {
        return <>Unknown</>;
    }
    switch (c.type.case) {
        case 'data':
            const d = c.type.value;
            switch (d.type.case) {
                case 'text':
                    return <div>{d.type.value.data}</div>
                case 'file':
                    return <span>{d.type.value.file}</span>
                case 'url':
                    const u = d.type.value.url;
                    const cards = item.related.map(r => <ContentView item={new StoredContent({content: r,})} setChecked={setChecked} />)
                    // if (cards.length === 0) {
                    //     return <a href={u} style={{color: 'white'}}>{u}</a>
                    // }
                    const newItem = new StoredContent({
                        ...item,
                        title: u,
                    })
                    return (
                        <>
                            {userSettings.showQRCodes && (
                                <QRCode text={item.url} />
                            )}
                            <ArticleCard item={newItem} setChecked={setChecked} />
                        </>
                    )
            }
            break;
        case 'normalized':
            const n = c.type.value;
            switch (n.type.case) {
                case 'article':
                    return <ArticleCard item={item} setChecked={setChecked} />
            }
            break;
    }
    return null;
}

export const ContentList: React.FC<ContentListProps> = ({
    content,
    selectedContent,
    setSelectedContent
}) => {
    const styles = useStyles();

    const verticalGapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10,
    };

    return (
        <Stack tokens={verticalGapStackTokens}>
            {content.map((item) => {
                return (
                    <Stack.Item key={item.id} className={styles.stackItem}>
                        <ContentView item={item} setChecked={(checked) => {
                            if (checked) {
                                setSelectedContent([...selectedContent, item.id]);
                            } else {
                                setSelectedContent(selectedContent.filter((c) => c !== item.id));
                            }
                        }} />
                    </Stack.Item>
                )
            })}
        </Stack>
    );
};