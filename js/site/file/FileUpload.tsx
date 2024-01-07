import React, { ChangeEvent, useState } from 'react';
import {contentService, projectService} from "@/service";
import {useProjectContext} from "@/react/ProjectProvider";
import toast from "react-hot-toast";
import {VideoPlayer} from "@/media/VideoPlayer";
import {MessageList} from "@/content/MessageList";

function readFileInChunks(file: File, chunkSize: number = 25 * 1024 * 1024): Promise<void> {
    return new Promise((resolve, reject) => {
        let offset = 0;

        const reader = new FileReader();

        reader.onerror = () => {
            reader.abort();
            reject(new Error("Problem reading file."));
        };

        reader.onload = () => {
            if (reader.result && offset < file.size) {
                // Process the chunk here. Currently, it just logs the chunk.
                console.log(new Uint8Array(reader.result as ArrayBuffer));

                offset += chunkSize;
                readChunk();
            } else {
                resolve();
            }
        };

        function readChunk() {
            const slice = file.slice(offset, offset + chunkSize);
            reader.readAsArrayBuffer(slice);
        }

        readChunk();
    });
}

export const FileUpload: React.FC = () => {
    const { streamMessages, loading, setLoading } = useProjectContext();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const url = selectedFile ? URL.createObjectURL(selectedFile) : null;

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
                    setLoading(true);
                    const res = contentService.save({
                        content: {
                            type: {
                                case: 'data',
                                value: {
                                    type: {
                                        case: 'file',
                                        value: {
                                            file: selectedFile.name,
                                            data: fileBytes,
                                        },
                                    },
                                }
                            },
                        },
                    }, {
                        timeoutMs: undefined,
                    })
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
            {url && <VideoPlayer url={url} insertText={(t) => {}} />}
            <button className={"btn"} onClick={handleFileUpload} disabled={!selectedFile}>Upload</button>
        </div>
    );
};