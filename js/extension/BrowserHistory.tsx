import * as React from "react";
import {useState, useEffect, useRef, useMemo} from "react";
import {Timeline as VisTimeline} from "vis-timeline/standalone";
import {PlusIcon} from "@heroicons/react/24/outline";
import {useAtom} from "jotai/index";
import {contentAtom} from "./FloatingPanel";
import {urlContent} from "./util";
import {historyDelete, historyGet} from "./shared";
import {History} from "@/rpc/content/browser/history_pb";

const transformHistoryItems = (history: History): {
    items: any[];
    groups: any[];
} => {
    const groupsMap = new Map<string, number>();
    let groupId = 0;

    const timelineItems = history.nodes.map((item, index) => {
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
            start: new Date(item.open || 0),
            end: new Date(item.close || 0),
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
                group: 1,
            }
        });

    return { items: groups, groups: [
            { id: 1, content: 'Visits' },
            // { id: 2, content: 'Journeys' },
        ] };
};

export const BrowserHistory: React.FC = () => {
    const [domain, setDomain] = useState<string | undefined>(undefined);
    const [historyItems, setHistoryItems] = useState<chrome.history.HistoryItem[]>([]);
    const [content, setContent] = useAtom(contentAtom);
    const [browserHistory, setBrowserHistory] = useState<History|undefined>(undefined);
    const [lastNMinutes, setLastNMinutes] = useState(15);

    const loadBrowserHistory = async () => {
        const response = await chrome.runtime.sendMessage({ action: historyGet });
        console.log(response);
        if (response && response.data) {
            const h = History.fromJsonString(response.data);
            console.log(h)
            setBrowserHistory(h);
        }
    }

    const deleteHistory = async () => {
        await chrome.runtime.sendMessage({ action: historyDelete });
        setBrowserHistory(undefined);
    }

    useEffect(() => {
        void loadBrowserHistory();
    }, []);


    // sort by most resently visited
    const filteredItems = browserHistory?.nodes.filter((item) => {
        if (!domain) {
            return true;
        }
        const url = new URL(item.url || "");
        return url.hostname === domain;
    }).sort((a, b) => {
        return (b.close || 0) - (a.close || 0);
    });
    const timelineRef = useRef(null);

    useEffect(() => {
        if (timelineRef.current && browserHistory) {
            const d = transformHistoryItems(browserHistory);

            const timeline = new VisTimeline(timelineRef.current, d.items, d.groups, {
                height: '100%',
                // editable: true,
            });
            const endTime = new Date(new Date().getTime() + 60 * 1000); // current time
            const startTime = new Date(endTime.getTime() - 60 * lastNMinutes * 1000);
            timeline.setWindow(startTime, endTime, { animation: true });
            // timeline.fit();
            // console.log('asdf')
            timeline.on('select', (props) => {
                setDomain(d.items.find(i => i.id === props.items[0]).content);
            });
            return () => {
                timeline.destroy();
            };
        }
    }, [browserHistory]);

    return (
        <div style={{height: '500px', width: '100%'}}>
            <div ref={timelineRef} style={{ width: '100%', height: '100%' }}/>
            <input type={"number"} value={lastNMinutes} onChange={(e) => setLastNMinutes(parseInt(e.target.value))} />
            <button className={"btn"} onClick={loadBrowserHistory}>reload</button>
            <button className={"btn"} onClick={deleteHistory}>delete</button>
            {domain && (
                <>
                    <button onClick={() => setDomain(undefined)}>clear</button>
                    <p>visits to: {domain}</p>
                </>
            )}
            <table>
                <thead>
                <tr>
                    <th>Add</th>
                    <th>Domain</th>
                    <th>URL</th>
                </tr>
                </thead>
                <tbody>
                {filteredItems && filteredItems.map((item) => {
                    const url = new URL(item.url || "");
                    return (
                        <tr key={item.id}>
                            <td><PlusIcon className={"h-3 w-3"} onClick={() => {
                                setContent((prev) => {
                                    if (item.url) {
                                        return [...prev, urlContent(item.url, [])]
                                    }
                                    return prev;
                                });
                            }} /></td>
                            <td>{url.hostname}</td>
                            <td><a href={item.url} target={"_blank"}>{item.url}</a></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};
