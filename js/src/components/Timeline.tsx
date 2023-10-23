import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

interface TimelineProps {
    items: any[];
    options?: any;
}

export const TimelineComponent: React.FC<TimelineProps> = ({ items, options }) => {
    const timelineRef = useRef(null);

    useEffect(() => {
        if (timelineRef.current) {
            const timeline = new Timeline(timelineRef.current, items, options);
            return () => {
                timeline.destroy();
            };
        }
    }, [items, options]);

    return <div ref={timelineRef} style={{ width: '100%', height: '400px' }} />;
};
