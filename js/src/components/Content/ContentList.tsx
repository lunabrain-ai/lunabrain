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
    MenuPopover, MenuList, MenuItem, Button, Input,
} from "@fluentui/react-components";
import {useProjectContext} from "@/providers/ProjectProvider";
import {StoredContent } from "@/rpc/content/content_pb";
import {Checkbox, IStackTokens, Stack} from "@fluentui/react";
import {MoreHorizontal20Regular, AddCircle16Regular, SubtractCircle16Regular} from "@fluentui/react-icons";
import {Vote} from "@/components/Vote";
import {contentService, userService} from "@/service";
import toast from "react-hot-toast";
import {IFrameSandbox} from "@/components/IFrameSandbox";
import QRCode from "@/components/QRCode";
import {truncateText} from "@/util/text";
import {ContentCard} from "@/components/Content/ContentCard";
import {useStyles} from "@/components/Content/styles";

interface ContentListProps {
    content: StoredContent[];
    selectedContent: string[];
    setSelectedContent: (content: string[]) => void;
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

const ContentView: React.FC<{
    item: StoredContent,
    setChecked: (checked: boolean) => void,
}> = ({ item, setChecked }) => {
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
                    return <ContentCard item={item} setChecked={setChecked} />;
            }
            break;
    }
    return null;
}
