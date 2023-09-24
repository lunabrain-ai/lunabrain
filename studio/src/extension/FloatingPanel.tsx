import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton, Stack } from '@fluentui/react';
import {Table, TableBody, TableCell, TableCellActions, TableHeader, TableRow} from "@fluentui/react-components";
import {projectService} from "@/lib/api";

interface FloatingPanelProps {}

export const FloatingPanel: React.FC<FloatingPanelProps> = () => {
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

    const handleSave = () => {
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
