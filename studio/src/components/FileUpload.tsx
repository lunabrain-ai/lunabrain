import React, { ChangeEvent, useState } from 'react';
import {projectService} from "@/lib/api";
import {useProjectContext} from "@/providers/ProjectProvider";
import {Button} from "@fluentui/react-components";
import toast from "react-hot-toast";

export const FileUpload: React.FC = () => {
    const { streamMessages } = useProjectContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        setFileName(file ? file.name : null);
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileAsArrayBuffer = (e.target as FileReader).result;
            if (fileAsArrayBuffer) {
                const fileBytes = new Uint8Array(fileAsArrayBuffer as ArrayBuffer);
                try {
                    const res = projectService.uploadContent({
                        content: {
                            options: {
                                case: 'audioOptions',
                                value: {
                                    file: selectedFile.name,
                                    data: fileBytes,
                                }
                            },
                        },
                    }, {
                        timeoutMs: undefined,
                    })
                    void streamMessages(res);
                } catch (e: any) {
                    console.log(e);
                    toast.error(e.message);
                }
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {fileName && <div>Selected File: {fileName}</div>}
            <Button onClick={handleFileUpload} disabled={!selectedFile}>Upload</Button>
        </div>
    );
};