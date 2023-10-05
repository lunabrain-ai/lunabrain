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
    createTableColumn, TableCellActions, Button,
} from "@fluentui/react-components";
import {MutableRefObject, RefObject, useEffect, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";
import {useProjectContext} from "@/providers/ProjectProvider";
import { Content, StoredContent } from "@/rpc/content/content_pb";
import {IconButton} from "@fluentui/react";
import {contentService} from "@/lib/service";

const columns: TableColumnDefinition<StoredContent>[] = [
    createTableColumn<StoredContent>({
        columnId: "message",
    }),
    createTableColumn<StoredContent>({
        columnId: "tags",
    }),
];

interface SubtleSelectionProps {
    style?: React.CSSProperties;
}

export const ContentList: React.FC<SubtleSelectionProps> = ({ style }) => {
    const messagesEndRef = useRef(null);
    const { inference, content, deleteContent } = useProjectContext();

    useEffect(() => {
        if (messagesEndRef.current) {
            //@ts-ignore
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [content, inference]);

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
            columns: columns,
            items: content,
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

    const tc = (item: StoredContent): JSX.Element => {
        const c = item.content;
        if (!c) {
            return <>Unknown</>;
        }
        switch (c.type.case) {
            case 'data':
                const d = c.type.value;
                switch (d.type.case) {
                    case 'text':
                        return <div>{d.type.value.data}</div>
                    case 'file':
                        return <span>{d.type.value.file}</span>
                    case 'url':
                        const u = d.type.value.url;
                        return (<a href={u} style={{color: "white"}}>{u}</a>)
                }
        }
        return <>Unknown</>;
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
                    <TableHeaderCell>Tags</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody style={{overflowY: 'auto'}}>
                {rows.map(({ item, selected, onClick, onKeyDown, appearance, rowId }) => (
                    <TableRow
                        key={item.id}
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
                        <TableCell>
                            <TableCellActions>
                                <IconButton
                                    iconProps={{ iconName: 'Delete' }}
                                    onClick={() => deleteContent([item.id])}
                                />
                            </TableCellActions>
                            {tc(item)}
                        </TableCell>
                        <TableCell>{item.content?.tags.join(', ')}</TableCell>
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