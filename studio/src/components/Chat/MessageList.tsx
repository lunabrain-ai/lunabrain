import * as React from "react";
import {
    FolderRegular,
    EditRegular,
    OpenRegular,
    DocumentRegular,
    PeopleRegular,
    DocumentPdfRegular,
    VideoRegular,
} from "@fluentui/react-icons";
import {
    PresenceBadgeStatus,
    Avatar,
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableSelectionCell,
    TableCellLayout,
    useTableFeatures,
    TableColumnDefinition,
    useTableSelection,
    createTableColumn,
} from "@fluentui/react-components";
import {Segment, Token} from '@/rpc/protoflow_pb'
import {MutableRefObject, RefObject, useEffect, useRef} from "react";

export interface Message {
    text: string;
    sender: 'user' | 'bot';
    segment: Segment;
}

export const messageColumns: TableColumnDefinition<Message>[] = [
    createTableColumn<Message>({
        columnId: "text",
    }),
];

interface SubtleSelectionProps {
    style?: React.CSSProperties;
    items: Message[]
    columns: TableColumnDefinition<Message>[]
    audioRef: RefObject<HTMLAudioElement>
}

export const SubtleSelection: React.FC<SubtleSelectionProps> = ({ style, items, columns , audioRef}) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [items]);

    const {
        getRows,
        selection: {
            allRowsSelected,
            someRowsSelected,
            toggleAllRows,
            toggleRow,
            isRowSelected,
        },
    } = useTableFeatures(
        {
            columns,
            items,
        },
        [
            useTableSelection({
                selectionMode: "multiselect",
                defaultSelectedItems: new Set([]),
            }),
        ]
    );

    const rows = getRows((row) => {
        const selected = isRowSelected(row.rowId);
        return {
            ...row,
            onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === " ") {
                    e.preventDefault();
                    toggleRow(e, row.rowId);
                }
            },
            selected,
            appearance: selected ? ("brand" as const) : ("none" as const),
        };
    });

    const toggleAllKeydown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === " ") {
                toggleAllRows(e);
                e.preventDefault();
            }
        },
        [toggleAllRows]
    );
    const changeCurrentTime = (t: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = t; // Change to any time in seconds
        }
    };

    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            const handleTimeUpdate = () => {
                console.log('Current Time:', audioElement.currentTime);
            };

            // TODO breadchris highlight the token that is currently being spoken
            // if (audioRef.current && audioRef.current.currentTime >= Number(t.startTime) / 1000 && audioRef.current.currentTime <= Number(t.endTime) / 1000) {
            //     return {color: 'red'}
            // }

            audioElement.addEventListener('timeupdate', handleTimeUpdate);

            // Cleanup to prevent memory leaks
            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, []);

    const tc = (item: Message): JSX.Element => {
        if (item.segment.tokens.length === 0) {
            return <span>{item.text}</span>
        }
        return (
            <>
                {item.segment.tokens.map((t) => {
                    if (/\[.*\]/.test(t.text) || '<|endoftext|>' === t.text) {
                        return null;
                    }
                    const time = Number(t.startTime) / 1000;
                    return (
                        <span style={{}} onClick={() => changeCurrentTime(time)} title={time.toString()}>
                                        {t.text}
                                    </span>
                    )
                })}
            </>
        )
    }

    return (
        <Table style={style} aria-label="Table with subtle selection">
            <TableHeader>
                <TableRow>
                    <TableSelectionCell
                        checked={
                            allRowsSelected ? true : someRowsSelected ? "mixed" : false
                        }
                        onClick={toggleAllRows}
                        onKeyDown={toggleAllKeydown}
                        checkboxIndicator={{ "aria-label": "Select all rows " }}
                    />
                    <TableHeaderCell>Message</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody style={{overflowY: 'auto'}}>
                {rows.map(({ item, selected, onClick, onKeyDown, appearance, rowId }) => (
                    <TableRow
                        key={rowId}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                        aria-selected={selected}
                        appearance={appearance}
                    >
                        <TableSelectionCell
                            subtle
                            checked={selected}
                            checkboxIndicator={{ "aria-label": "Select row" }}
                        />
                        <TableCell>{tc(item)}</TableCell>
                    </TableRow>
                ))}
                <tr ref={messagesEndRef}></tr>
            </TableBody>
        </Table>
    );
};