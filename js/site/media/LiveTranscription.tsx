import React, { useState, useEffect } from 'react';

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface IResult {
    [index: number]: {
        0: {
            transcript: string;
        };
    };
}

export const LiveTranscription: React.FC = () => {
    const [transcript, setTranscript] = useState<string>('');
    const [isListening, setIsListening] = useState<boolean>(false);

    useEffect(() => {
        let recognition: typeof window.webkitSpeechRecognition | undefined;

        if ('webkitSpeechRecognition' in window) {
            recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;

            recognition.onresult = (event: { results: IResult }) => {
                console.log(event);
                // const transcriptArray = Array.from(event.results)
                //     .map((result) => result[0])
                //     .map((result) => result.transcript);
                // setTranscript(transcriptArray.join(' '));
            };

            recognition.onend = () => {
                if (isListening) {
                    recognition?.start();
                }
            };
        } else {
            console.warn('Speech recognition is not supported in this browser');
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [isListening]);

    const toggleListening = () => {
        setIsListening((prevState) => !prevState);
    };

    return (
        <div>
            <button onClick={toggleListening}>
                {isListening ? 'Stop' : 'Start'} Transcription
            </button>
            <p>{transcript}</p>
        </div>
    );
};