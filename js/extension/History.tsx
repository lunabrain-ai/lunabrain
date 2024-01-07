import * as React from "react";
import { useState, useEffect } from "react";
import {Timeline} from "./Timeline";

const transformHistoryItems = (historyItems: chrome.history.HistoryItem[]): any[] => {
    return historyItems.map((item, index) => ({
        id: index,
        content: item.title || item.url,
        start: new Date(item.lastVisitTime || 0),
        // Optionally, specify an end date if available
        // end: ...
    }));
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

    return (
        <div style={{height: '800px', width: '800px'}}>
            <Timeline items={transformHistoryItems(historyItems)} />
        </div>
    );
};
