import React, {useEffect, useRef, useState} from "react";
import {Segment, Token} from '@/rpc/protoflow_pb'

export const AudioPlayer: React.FC<{url: string}> = ({ url }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            const handleTimeUpdate = () => {
                setCurrentTime(audioElement.currentTime);
            };

            audioElement.addEventListener('timeupdate', handleTimeUpdate);

            // Cleanup to prevent memory leaks
            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, []);

    const changeCurrentTime = (t: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = t;
        }
    };

    const shouldHighlight = (t: Token) => {
        // // TODO breadchris highlight the token that is currently being spoken
        if (audioRef.current && audioRef.current.currentTime >= Number(t.startTime) / 1000 && audioRef.current.currentTime <= Number(t.endTime) / 1000) {
            return {color: 'red'};
        }
        return {};
    }

    const shouldHighlightSegment = (t: Segment) => {
        // // TODO breadchris highlight the token that is currently being spoken
        if (audioRef.current && audioRef.current.currentTime >= t.startTime && audioRef.current.currentTime <= t.endTime) {
            return {color: 'red'};
        }
        return {};
    }

    return (
        <>
            <audio
                ref={audioRef}
                src={url}
                controls
            />
        </>
    )
}
