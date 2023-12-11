import * as React from 'react';
import { Stack, IStackTokens } from '@fluentui/react';
import ReactPlayer from 'react-player';
import {MouseEventHandler, useCallback, useEffect, useRef, useState} from "react";
import WaveSurfer from "wavesurfer.js";
import Timeline from "wavesurfer.js/src/plugin/timeline";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import {Button} from "@fluentui/react-components";
import {insertText} from "slate";

// @ts-ignore
const Player = ReactPlayer.default as typeof ReactPlayer;

interface VideoPlayerProps {
    url: string;
    insertText: (text: string) => void;
}

const useWavesurfer = (containerRef: any, options: any) => {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}

const WaveSurferPlayer = (props) => {
    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, props)

    // On play button click
    const onPlayClick = useCallback(() => {
        if (!wavesurfer) {
            return;
        }
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }, [wavesurfer])

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        setCurrentTime(0)
        setIsPlaying(false)

        if (!wavesurfer) {
            return;
        }

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub.callback())
        }
    }, [wavesurfer])

    return (
        <>
            <div ref={containerRef} style={{ minHeight: '120px' }} />

            <button onClick={onPlayClick} style={{ marginTop: '1em' }}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>

            <p>Seconds played: {currentTime}</p>
        </>
    )
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, insertText }) => {
    const [start, setStart] = useState<number|null>(null);
    const [end, setEnd] = useState<number|null>(null);
    const stackTokens: IStackTokens = { childrenGap: 20 };
    const playerRef = useRef<ReactPlayer>(null);

    const onMark = () => {
        if (!playerRef.current) {
            return;
        }
        const time = playerRef.current.getCurrentTime();
        insertText(time.toString())
    }

    return (
        <Stack tokens={stackTokens}>
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
        </Stack>
    );
};