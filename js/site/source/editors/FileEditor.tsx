// TODO breadchris component only designed for audio files with transcripts
import {useEffect, useState} from "react";
import {contentService} from "@/service";
import {File} from "@/rpc/content/content_pb";

export const FileEditor: React.FC<{id: string, file: File, onChange: (file: File) => void}> = ({id, file, onChange}) => {
    const [relatedContent, setRelatedContent] = useState<string[]>([]);
    useEffect(() => {
        (async () => {
            const res = await contentService.search({
                contentID: id,
            });
            res.storedContent.forEach((c) => {
                c.related.forEach((r) => {
                    switch (r.type.case) {
                        case 'normalized':
                            const n = r.type.value;
                            switch (n.type.case) {
                                case 'transcript':
                                    console.log(n)
                                    setRelatedContent([...relatedContent, n.type.value.segments.map(s => s.text).join(' ')]);
                                    break;
                            }
                    }
                });
            });
        })();
    }, []);
    return (
        <>
            <h5>{file.file}</h5>
            <audio src={file.url} controls={true} />
            <ul>
                {relatedContent.map((c) => (
                    <li key={c}>{c}</li>
                ))}
            </ul>
        </>
    )
}
