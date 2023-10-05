import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton, Stack } from '@fluentui/react';
import {Table, TableBody, TableCell, TableCellActions, TableHeader, TableRow} from "@fluentui/react-components";
import {contentService} from "@/lib/service";
import {Content, Data} from "@/rpc/content/content_pb";
import {Property} from "csstype";
import {urlContent} from "@/extension/util";

interface FloatingPanelProps {}

// TODO breadchris get page content https://github.com/omnivore-app/omnivore/blob/main/pkg/extension/src/scripts/content/prepare-content.js#L274

export const FloatingPanel: React.FC<FloatingPanelProps> = () => {
    const [error, setError] = useState<string|undefined>(undefined);
    const [title, setTitle] = useState(document.title);
    const [url, setUrl] = useState(window.location.href);
    const [annotation, setAnnotation] = useState<string>('');
    const [annotations, setAnnotations] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
        };

        document.addEventListener('keydown', handleKeyDown);

        document.addEventListener('mouseup', handleTextHighlight);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mouseup', handleTextHighlight);
        };
    }, []);

    const handleTextHighlight = () => {
        const highlightedText = window.getSelection()?.toString();
        if (highlightedText) {
            setAnnotation(highlightedText);
        }
    };

    const handleAnother = () => {
        setAnnotations([...annotations, annotation]);
        setAnnotation('');
    };

    const handleSave = async () => {
        setError(undefined);
        try {
            const res = await contentService.save({
                contents: [urlContent(url, ['browser/save'])]
            })
            console.log(res)
        } catch (e: any) {
            console.error(e)
            setError(e.message);
        }
    }

    const handleRemove = (id: number) => {
        setAnnotations(annotations.filter((annotation, idx) => idx !== id));
    };

    return (
        <Stack id="floating-panel" tokens={{ childrenGap: 10 }} style={{
            padding: '10px', backgroundColor: 'white', border: '1px solid #ccc', color: 'black', width: '40vh',
            maxHeight: '300px', overflowY: 'auto'
        }}>
            <TextField
                value={title}
                onChange={(e, newValue) => setTitle(newValue || '')}
            />
            <TextField
                multiline
                rows={4}
                value={annotation}
                onChange={(e, newValue) => setAnnotation(newValue || '')}
            />
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <PrimaryButton onClick={handleAnother} text="Another" />
                <PrimaryButton onClick={handleSave} text="Save" />
            </Stack>
            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
            {annotations.length > 0 && (
                <Table style={{height: '100px', overflowY: 'auto'}}>
                    {annotations.map((annotation, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                {annotation}
                                <TableCellActions>
                                    <PrimaryButton onClick={() => handleRemove(idx)} text="Remove" />
                                </TableCellActions>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            )}
        </Stack>
    );
};
