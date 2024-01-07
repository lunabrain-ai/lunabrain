import ReactMarkdown from "react-markdown";
import {VideoPlayer} from "@/media/VideoPlayer";
import * as React from "react";
import { Content, Segment } from "@/rpc/content/content_pb";

const SegmentView: React.FC<{ segments: Segment[] }> = ({ segments }) => {
    return (
        <p>
            {segments.map((s, i) => (
                <span key={i}>{s.text}</span>
            ))}
        </p>
    )
}

export const Display: React.FC<{id: string, content: Content}> = ({id, content}) => {
    switch (content.type.case) {
        case 'data':
            const d = content.type.value;
            switch (d.type.case) {
                case 'text':
                    return <ReactMarkdown>{d.type.value.data.toString()}</ReactMarkdown>
                case 'file':
                    return <VideoPlayer url={`/media/${id}`} insertText={(t) => {}} />
                case 'url':
                    return null; //<a href={d.type.value.url}>{d.type.value.url}</a>
            }
            break;
        case 'normalized':
            const n = content.type.value;
            switch (n.type.case) {
                case 'article':
                    return <p className={"text-ellipsis"}>{n.type.value.text}</p>
                case 'transcript':
                    return <SegmentView segments={n.type.value.segments} />
            }
    }
    return null;
}

