import React, { useEffect, useRef } from 'react';
import { Timeline as VisTimeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

interface TimelineProps {
    items: any[];
    groups: any[];
    options?: any;
}

export const Timeline: React.FC<TimelineProps> = ({ items, groups, options }) => {
    const timelineRef = useRef(null);

    useEffect(() => {
        if (timelineRef.current) {
            const timeline = new VisTimeline(timelineRef.current, items, {
                height: '100%',
                ...options,
            });
            timeline.fit();
            return () => {
                timeline.destroy();
            };
        }
    }, [items, options]);

    return <div ref={timelineRef} style={{ width: '100%', height: '100%' }} />;
};
