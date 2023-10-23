import * as React from "react";
import {StoredContent } from "@/rpc/content/content_pb";
import {Checkbox, IStackTokens, Stack} from "@fluentui/react";
import {ContentCard, RelatedContentCard} from "@/components/Content/ContentCard";
import {useStyles} from "@/components/Content/styles";
import {Input} from "@fluentui/react-components";
import {MarkdownPreview} from "@/components/Editor/MarkdownPreview";
import {MarkdownEditor} from "@/components/Editor/MarkdownEditor";

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

    const getContent = (item: StoredContent) => {
        return (
            <ContentView item={item} setChecked={(checked) => {
                if (checked) {
                    setSelectedContent([...selectedContent, item.id]);
                } else {
                    setSelectedContent(selectedContent.filter((c) => c !== item.id));
                }
            }} />
        )
    }

    return (
        <Stack tokens={verticalGapStackTokens}>
            {content.map((item) => {
                return (
                    <Stack.Item key={item.id} className={styles.stackItem}>
                        {getContent(item)}
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
                    if (!item.content) {
                        return <>Unknown</>;
                    }
                    return <RelatedContentCard content={item.content} setChecked={setChecked} />;
                case 'file':
                    return <span>{d.type.value.file}</span>
                case 'url':
                    return <ContentCard item={item} setChecked={setChecked} />;
            }
            break;
    }
    return null;
}
