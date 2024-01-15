import * as React from "react";
import { useState, useEffect } from "react";
import {Timeline} from "./Timeline";

const transformHistoryItems = (historyItems: chrome.history.HistoryItem[]): {
    items: any[];
    groups: any[];
} => {
    const groupsMap = new Map<string, number>();
    let groupId = 0;

    const timelineItems = historyItems.map((item, index) => {
        // Extract domain from URL
        const url = new URL(item.url || "");
        const domain = url.hostname;

        // Assign or get groupId for the domain
        if (!groupsMap.has(domain)) {
            groupsMap.set(domain, groupId++);
        }
        const itemGroupId = groupsMap.get(domain);

        return {
            id: index,
            group: itemGroupId,
            content: item.title || item.url,
            start: new Date(item.lastVisitTime || 0),
            // Optionally, specify an end date if available
            // end: ...
        };
    });

    // Creating group entries for vis-timeline
    // sort groups by the last access time
    const groups = Array.from(groupsMap.entries())
        .map(([domain, id]) => ({
            id: id,
            content: domain,
        }))
        .sort((a, b) => {
            const aItems = timelineItems.filter((item) => item.group === a.id);
            const bItems = timelineItems.filter((item) => item.group === b.id);
            const aLastVisitTime = Math.max(...aItems.map((item) => item.start.getTime()));
            const bLastVisitTime = Math.max(...bItems.map((item) => item.start.getTime()));
            return bLastVisitTime - aLastVisitTime;
        }).map((group, index) => {
            const aItems = timelineItems.filter((item) => item.group === group.id);
            return {
                id: group.id,
                content: group.content,
                start: Math.max(...aItems.map((item) => item.start.getTime())),
            }
        });

    return { items: groups, groups: [] };
};

export const History: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [historyItems, setHistoryItems] = useState<chrome.history.HistoryItem[]>([]);

    const fetchBrowserHistory = () => {
        if (chrome && chrome.history) {
            chrome.history.search({ text: searchTerm, maxResults: 100 }, (results) => {
                setHistoryItems(results);
            });
        }
    };

    useEffect(() => {
        fetchBrowserHistory();
    }, [searchTerm]);

    const d = transformHistoryItems(historyItems);

    return (
        <div style={{height: '500px', width: '100%'}}>
            <Timeline items={d.items} groups={d.groups} />
        </div>
    );
};
