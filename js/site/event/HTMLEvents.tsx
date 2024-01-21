import * as rrweb from "rrweb";
import React, {FC, useRef} from "react";
import {eventService} from "@/service";
import {Metric} from "@/rpc/event/event_pb";

export class RRWebRecorder {
    private events: any = [];
    private stopRecording: (() => void) | undefined = undefined;

    startRecording(): void {
        // Start recording
        this.stopRecording = rrweb.record({
            emit: (event) => {
                // Push each event into our events array
                this.events.push(event);
            },
        });
        console.log('Recording started.');
    }

    stopRecordingAndGetEvents(): any[] {
        // Stop recording and return the events
        if (this.stopRecording) {
            this.stopRecording();
            console.log('Recording stopped.');
        }
        (async () => {
            try {
                eventService.send(new Metric({
                    type: {
                        case: 'rrweb',
                        value: {
                            events: JSON.stringify(this.events)
                        },
                    }
                }));
            } catch (e) {
                console.error('failed to send events', e);
            }
        })();
        return this.events;
    }
}

export const HTMLEvents: FC<{recorder: RRWebRecorder}> = ({recorder}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const replayRef = useRef<HTMLDivElement>(null);

    const openModal = () => {
        if (dialogRef.current && replayRef.current) {
            // Stop recording and get the events
            const events = recorder.stopRecordingAndGetEvents();
            // Replay the events
            const replayer = new rrweb.Replayer(events, {
                root: replayRef.current,
            });
            dialogRef.current.showModal();
            replayer.play();
        }
    };
    return (
        <>
            <button className="btn" onClick={openModal}>view session</button>
            <dialog className="modal" ref={dialogRef}>
                <div className="modal-box">
                    <div ref={replayRef}></div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
