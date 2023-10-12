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
import {Article, Content, StoredContent } from "@/rpc/content/content_pb";
import {Checkbox, IconButton, IStackTokens, Stack} from "@fluentui/react";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import {Vote} from "@/components/Vote";
import {userService} from "@/service";
import toast from "react-hot-toast";

interface ContentListProps {
    style?: React.CSSProperties;
    content: StoredContent[];
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

const ArticleCard: React.FC<{ article: Article, tags: string[] }> = ({ tags, article }) => {
    return (
        <Card>
            <CardHeader
                header={<b>{article.title}</b>}
                description={article.excerpt}
            />


            <CardPreview>
                <img src={article.image} alt={"preview"} style={{maxHeight: '100px', width: 'auto'}}/>
            </CardPreview>

            <CardFooter>
                {tags.map(t => <Badge key={t}>{t}</Badge>)}
            </CardFooter>
        </Card>
    )
}

const GroupButton: React.FC<{ contentId: string}> = ({ contentId }) => {
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
        <Menu>
            <MenuTrigger disableButtonEnhancement>
                <MenuButton>Share</MenuButton>
            </MenuTrigger>

            <MenuPopover>
                <MenuList>
                    {groups.map((g) => {
                        return <MenuItem key={g.id} onClick={() => shareContent(g.id)}>{g.name}</MenuItem>
                    })}
                </MenuList>
            </MenuPopover>
        </Menu>
    )
}

export const ContentList: React.FC<ContentListProps> = ({ style, content }) => {
    const styles = useStyles();

    const tc = (item: StoredContent, tags?: string[]): JSX.Element | null => {
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
                        const cards = item.related.map(r => tc(new StoredContent({
                            content: r,
                        }), tags));
                        if (cards.length === 0) {
                            return <a href={u} style={{color: 'white'}}>{u}</a>
                        }
                        return (
                            <Stack horizontal>
                                {cards}
                            </Stack>
                        )
                }
                break;
            case 'normalized':
                const n = c.type.value;
                switch (n.type.case) {
                    case 'article':
                        return <ArticleCard article={n.type.value} tags={tags || []} />
                }
                break;
        }
        return null;
    }

    const verticalGapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10,
    };

    return (
        <Stack tokens={verticalGapStackTokens}>
            {content.map((item, i) => {
                return (
                    <Stack.Item align="center" key={i} className={styles.stackItem}>
                        <Card className={styles.card}
                              floatingAction={
                                  <Checkbox />
                              }
                        >
                            <CardHeader
                                header={<b>{item.title}</b>}
                                description={item.description}
                                image={<img className={styles.headerImage} src={item.image} /> }
                                onClick={() => window.location.href = item.url}
                                style={{cursor: 'pointer'}}
                                // action={
                                //     <Button
                                //         appearance="transparent"
                                //         icon={<MoreHorizontal20Regular />}
                                //         aria-label="More options"
                                //     />
                                // }
                            />
                            <CardFooter>
                                <Stack horizontal>
                                    <Vote />
                                    {item.content?.tags.map((t, i) => <Badge key={i}>{t}</Badge>)}
                                    <GroupButton contentId={item.id} />
                                </Stack>
                            </CardFooter>
                        </Card>
                    </Stack.Item>
                )
            })}
        </Stack>
    );
};