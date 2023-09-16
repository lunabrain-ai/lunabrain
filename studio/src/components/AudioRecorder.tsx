import React, { useState, useRef } from 'react';
import { Button } from "@fluentui/react-components";
import {projectService} from "@/lib/api";
import {useProjectContext} from "@/providers/ProjectProvider";
import toast from "react-hot-toast";

export const AudioRecorder: React.FC = () => {
    const { streamMessages, setLoading, loading } = useProjectContext();
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/wav' });
                mediaRecorder.current.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.current.push(event.data);
                    }
                };
                mediaRecorder.current.start();
                setRecording(true);
            })
            .catch(err => console.error('Error accessing media devices.', err));
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async () => {
        if(audioChunks.current.length > 0) {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioUrl(URL.createObjectURL(audioBlob));

            try {
                const fileBytes = new Uint8Array(await audioBlob.arrayBuffer());
                setLoading(true);
                const res = projectService.uploadContent({
                    content: {
                        options: {
                            case: 'audioOptions',
                            value: {
                                file: new Date().toISOString() + '.wav',
                                data: fileBytes,
                            }
                        },
                    },
                }, {
                    timeoutMs: undefined,
                })
                streamMessages(res);
            } catch (e: any) {
                console.error(e);
                toast.error(e.message);
            }
        }
    };

    return (
        <div>
            <Button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button onClick={uploadAudio} disabled={audioChunks.current.length === 0}>
                Upload Audio
            </Button>
            {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
        </div>
    );
};