import * as React from 'react';
import ReactPlayer from 'react-player';
import {useRef, useState} from "react";

// @ts-ignore
const Player = ReactPlayer.default as typeof ReactPlayer;

interface VideoPlayerProps {
    url: string;
    insertText: (text: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, insertText }) => {
    const [start, setStart] = useState<number|null>(null);
    const [end, setEnd] = useState<number|null>(null);
    const playerRef = useRef<ReactPlayer>(null);

    const onMark = () => {
        if (!playerRef.current) {
            return;
        }
        const time = playerRef.current.getCurrentTime();
        insertText(time.toString())
    }

    return (
        <div>
            <Player
                ref={playerRef}
                url={url}
                controls
                width="100%"
                height="auto"
                id="video-player"
                onProgress={(state) => {
                    console.log('onProgress', state);
                }}
            />
            {/*<Button onClick={onMark}>Mark</Button>*/}
        </div>
    );
};