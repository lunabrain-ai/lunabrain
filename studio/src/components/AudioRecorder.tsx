import React, { useState, useRef } from 'react';
import {Button} from "@fluentui/react-components";

export const AudioRecorder: React.FC = () => {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder.current = new MediaRecorder(stream);
                mediaRecorder.current.ondataavailable = event => {
                    if (event.data.size > 0) {
                        setAudioUrl(URL.createObjectURL(event.data));
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

    return (
        <div>
            <Button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            {audioUrl && <audio controls src={audioUrl}>Your browser does not support the audio element.</audio>}
        </div>
    );
};