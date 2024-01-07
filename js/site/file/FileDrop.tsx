import React, {useCallback, useState} from 'react';
import {projectService} from "@/service";
import {useProjectContext} from "@/react/ProjectProvider";
import { Data, File } from '@/rpc/content/content_pb';

interface FileDropProps {
    children?: React.ReactNode;
}

export const FileDrop: React.FC<FileDropProps> = ({children}) => {
    const [isDragging, setIsDragging] = useState(false);
    const {streamMessages, loading, setLoading} = useProjectContext();

    const onDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const fileAsArrayBuffer = (e.target as FileReader).result;
                    if (fileAsArrayBuffer) {
                        const fileBytes = new Uint8Array(fileAsArrayBuffer as ArrayBuffer);
                        setLoading(true);
                        const res = projectService.uploadContent({
                            content: {
                                type: {
                                    case: 'data',
                                    value: new Data({
                                        type: {
                                            case: 'file',
                                            value: new File({
                                                file: file.name,
                                                data: fileBytes,
                                            })
                                        }
                                    })
                                },
                            },
                        }, {
                            timeoutMs: undefined,
                        })
                        void streamMessages(res);
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }, []);
    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    }, []);

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
                border: isDragging ? '2px dashed #cccccc' : '',
            }}
        >
            {children}
        </div>
    );
};
