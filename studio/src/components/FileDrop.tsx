import React, {useCallback, useState} from 'react';
import {projectService} from "@/lib/api";
import {useProjectContext} from "@/providers/ProjectProvider";

interface FileDropProps {
    children?: React.ReactNode;
}

export const FileDrop: React.FC<FileDropProps> = ({children}) => {
    const [isDragging, setIsDragging] = useState(false);
    const {streamMessages} = useProjectContext();

    const onDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileAsArrayBuffer = (e.target as FileReader).result;
                if (fileAsArrayBuffer) {
                    const fileBytes = new Uint8Array(fileAsArrayBuffer as ArrayBuffer);
                    console.log('File bytes:', fileBytes);
                    const res = projectService.uploadContent({
                        content: {
                            data: fileBytes,
                            metadata: {
                                name: file.name,
                            }
                        },
                    })
                    void streamMessages(res);
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
