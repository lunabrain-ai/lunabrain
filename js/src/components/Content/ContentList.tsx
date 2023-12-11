import * as React from "react";
import {StoredContent } from "@/rpc/content/content_pb";
import {Checkbox, IStackTokens, Stack} from "@fluentui/react";
import {ContentCard, RelatedContentCard} from "@/components/Content/ContentCard";
import {useStyles} from "@/components/Content/styles";
import {MessageList} from "@/components/Content/MessageList";

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
                        <ContentCard item={item} setChecked={(checked) => {
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
