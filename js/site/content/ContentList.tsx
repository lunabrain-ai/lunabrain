import * as React from "react";
import {StoredContent } from "@/rpc/content/content_pb";
import {Card} from "@/content/card/Card";
import {CheckIcon} from "@heroicons/react/24/outline";

interface ContentListProps {
    content: StoredContent[];
}

export const ContentList: React.FC<ContentListProps> = ({
    content,
}) => {
    return (
        <div className={"space-y-4"}>
            {content.map((item) => {
                return (
                    <div key={item.id} className={""}>
                        <Card item={item} />
                    </div>
                )
            })}
        </div>
    );
};
