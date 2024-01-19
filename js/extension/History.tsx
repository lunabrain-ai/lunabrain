import * as React from "react";
import {useState, useEffect, useRef, useMemo} from "react";
import {Timeline as VisTimeline} from "vis-timeline/standalone";

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
    const [domain, setDomain] = useState<string | undefined>(undefined);
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

    const d = useMemo(() => transformHistoryItems(historyItems), [historyItems]);
    // sort by most resently visited
    const filteredItems = historyItems.filter((item) => {
        if (!domain) {
            return true;
        }
        const url = new URL(item.url || "");
        return url.hostname === domain;
    }).sort((a, b) => {
        return (b.lastVisitTime || 0) - (a.lastVisitTime || 0);
    });
    const timelineRef = useRef(null);

    useEffect(() => {
        if (timelineRef.current) {
            const timeline = new VisTimeline(timelineRef.current, d.items, {
                height: '100%',
            });
            const endTime = new Date(); // current time
            const startTime = new Date(endTime.getTime() - 60 * 60 * 1000);
            timeline.setWindow(startTime, endTime, { animation: true });
            // timeline.fit();
            // console.log('asdf')
            timeline.on('select', (props) => {
                const i = d.items[props.items[0]];
                setDomain(i.content);
            });
            return () => {
                timeline.destroy();
            };
        }
    }, [d]);

    return (
        <div style={{height: '500px', width: '100%'}}>
            <div ref={timelineRef} style={{ width: '100%', height: '100%' }}/>
            <table>
                <thead>
                <tr>
                    <th>Domain</th>
                    <th>Visits</th>
                    <th>URL</th>
                </tr>
                </thead>
                <tbody>
                {filteredItems.map((item) => {
                    const url = new URL(item.url || "");
                    return (
                        <tr key={item.id}>
                            <td>{url.hostname}</td>
                            <td>{item.visitCount}</td>
                            <td><a href={item.url} target={"_blank"}>{item.url}</a></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};
