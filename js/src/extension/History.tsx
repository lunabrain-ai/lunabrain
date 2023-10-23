import * as React from "react";
import { useState, useEffect } from "react";
import {
    OpenRegular,
    DocumentRegular,
} from "@fluentui/react-icons";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableCellLayout, TableColumnId, useTableFeatures, TableColumnDefinition, createTableColumn, useTableSort,
} from "@fluentui/react-components";
import {TextField} from "@fluentui/react";
import {Scheduler, SchedulerData} from "@bitnoi.se/react-scheduler";
import {TimelineComponent} from "@/components/Timeline";

const ellipsisStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

function timestampToFriendlyDate(timestamp: number) {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    return date.toLocaleDateString('en-US', options);
}

type Item = chrome.history.HistoryItem;

const columns: TableColumnDefinition<Item>[] = [
    createTableColumn<Item>({
        columnId: "title",
        compare: (a, b) => {
            return a.title?.localeCompare(b.title || '') || 0;
        },
    }),
    createTableColumn<Item>({
        columnId: "url",
        compare: (a, b) => {
            return a.url?.localeCompare(b.url || '') || 0;
        },
    }),
    createTableColumn<Item>({
        columnId: "lastVisitTime",
        compare: (a, b) => {
            if (!a.lastVisitTime || !b.lastVisitTime) {
                return 0;
            }
            return a.lastVisitTime - b.lastVisitTime;
        },
    }),
    createTableColumn<Item>({
        columnId: "visitCount",
        compare: (a, b) => {
            if (!a.visitCount || !b.visitCount) {
                return 0;
            }
            return a.visitCount - b.visitCount;
        },
    }),
];

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

    const {
        getRows,
        sort: { getSortDirection, toggleColumnSort, sort },
    } = useTableFeatures(
        {
            columns,
            items: historyItems,
        },
        [
            useTableSort({
                defaultSortState: { sortColumn: "lastVisitTime", sortDirection: "ascending" },
            }),
        ]
    );

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

    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => {
            toggleColumnSort(e, columnId);
        },
        sortDirection: getSortDirection(columnId),
    });

    const rows = sort(getRows());

    return (
        <div style={{height: '800px', width: '800px'}}>
            <TimelineComponent items={transformHistoryItems(historyItems)} />
            <TextField
                placeholder="Search history..."
                value={searchTerm}
                onChange={(ev, newValue) => setSearchTerm(newValue || "")}
            />
            <Table aria-label="History table">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell {...headerSortProps("title")}>Title</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("url")}>URL</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("lastVisitTime")}>Last Visit Time</TableHeaderCell>
                        <TableHeaderCell {...headerSortProps("visitCount")}>Visit Count</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <TableCellLayout media={<DocumentRegular />}>
                                    {item.item.title}
                                </TableCellLayout>
                            </TableCell>
                            <TableCell style={ellipsisStyle}><a href={item.item.url}>{item.item.url}</a></TableCell>
                            <TableCell>{item.item.lastVisitTime ? timestampToFriendlyDate(item.item.lastVisitTime) : 'unknown'}</TableCell>
                            <TableCell>
                                <TableCellLayout media={<OpenRegular />}>
                                    {item.item.visitCount}
                                </TableCellLayout>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
