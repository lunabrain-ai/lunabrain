import * as React from "react";
import {
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableSelectionCell,
    useTableFeatures,
    TableColumnDefinition,
    useTableSelection,
    createTableColumn,
} from "@fluentui/react-components";
import {Segment, Token} from '@/rpc/protoflow_pb'
import {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import {useProjectContext} from "@/providers/ProjectProvider";

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
}

export const MessageList: React.FC<SubtleSelectionProps> = ({ style }) => {
    const messagesEndRef = useRef(null);
    const { inference, messages } = useProjectContext();

    useEffect(() => {
        if (messagesEndRef.current) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, inference]);

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
            columns: messageColumns,
            items: messages,
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

    const tc = (item: Message): JSX.Element => {
        if (item.segment.tokens.length === 0) {
            if (item.segment.startTime && item.segment.endTime) {
                // TODO breadchris shouldHighlight runs pretty inefficiently, I think it is what causes lag in the highlighting
                return (
                    <span>
                        {item.segment.text}
                    </span>
                )
            }
            return <ReactMarkdown children={item.text} />
        }
        return (
            <>
                {item.segment.tokens.map((t, idx) => {
                    if (/\[.*\]/.test(t.text) || '<|endoftext|>' === t.text) {
                        return null;
                    }
                    const time = Number(t.startTime) / 1000;
                    // TODO breadchris shouldHighlight runs pretty inefficiently, I think it is what causes lag in the highlighting
                    return (
                        <span key={item.segment.startTime.toString() + t.startTime.toString() + idx}>
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
                {inference !== '' && (
                    <TableRow>
                        <TableSelectionCell
                            subtle
                        />
                        <TableCell><ReactMarkdown children={inference} /></TableCell>
                    </TableRow>
                )}
                <tr ref={messagesEndRef}></tr>
            </TableBody>
        </Table>
    );
};