import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton, Stack } from '@fluentui/react';
import {
    Button,
    SelectTabData,
    SelectTabEvent,
    Tab,
    Table,
    TableCell,
    TableCellActions,
    TableRow,
    TabList, TabValue
} from "@fluentui/react-components";
import {contentService} from "@/service";
import {urlContent} from "@/extension/util";
import { Content, StoredContent } from '@/rpc/content/content_pb';
import {contentGet} from "@/extension/shared";

interface SaveWizardProps {}

// TODO breadchris get page content https://github.com/omnivore-app/omnivore/blob/main/pkg/extension/src/scripts/content/prepare-content.js#L274

const floatingPanelStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    color: 'black',
    width: '40vh',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 9999,
    right: '10px',
    bottom: '10px',
    position: 'fixed',
}

export const SaveWizard: React.FC<SaveWizardProps> = () => {
    const [error, setError] = useState<string|undefined>(undefined);
    const [title, setTitle] = useState(document.title);
    const [tag, setTag] = useState<string|undefined>(undefined);
    const [tags, setTags] = useState<string[]>(['browser/save']);
    const [url, setUrl] = useState(window.location.href);
    const [annotation, setAnnotation] = useState<string>('');
    const [annotations, setAnnotations] = useState<string[]>([]);
    const [selectedValue, setSelectedValue] = useState<TabValue>("tags");
    const [analysis, setAnalysis] = useState<Content[]|undefined>(undefined);

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

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

    const handleAddTag = (addTag: string) => {
        setTags([...tags, addTag]);
        setTag('');
    }

    const handleAddAnnotation = () => {
        if (annotation) {
            setAnnotations([...annotations, annotation]);
            setAnnotation('');
        }
    };

    const analyze = async () => {
        setAnalysis(undefined)
        try {
            const res = await contentService.analyze(
                urlContent(url, tags)
            )
            console.log(res)
            // setAnalysis(res.content)
        } catch (e: any) {
            console.error(e)
        }
    }

    const handleSave = async () => {
        setError(undefined);
        try {
            const res = await contentService.save({
                content: urlContent(url, tags),
                related: []
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

    const handleRemoveTag = (id: number) => {
        setAnnotations(tags.filter((annotation, idx) => idx !== id));
    };

    return (
        <Stack id="floating-panel" tokens={{ childrenGap: 10 }} style={floatingPanelStyle}>
            <TextField
                value={title}
                onChange={(e, newValue) => setTitle(newValue || '')}
            />
            <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab value="tags">Tags</Tab>
                <Tab value="annotations">Annotations</Tab>
                <Tab value="analyze">Analyze</Tab>
            </TabList>
            <div>
                {selectedValue === 'analyze' && (
                    <Stack>
                        <Button onClick={analyze}>Analyze</Button>
                        {analysis && (
                            <ul>
                                {analysis.map((content, idx) => (
                                    <>
                                        {content.tags.map((t, idx) => (
                                            <Button key={idx} onClick={() => handleAddTag(t)}>{t}</Button>
                                        ))}
                                    </>
                                ))}
                            </ul>
                        )}
                    </Stack>
                )}
                {selectedValue === 'tags' && (
                    <Stack>
                        <TextField
                            value={tag}
                            placeholder={'tag'}
                            onChange={(e, newValue) => setTag(newValue || '')}
                        />
                        <PrimaryButton onClick={() => tag && handleAddTag(tag)} text="Add" />
                        {tags.length > 0 && (
                            <Table style={{height: '100px', overflowY: 'auto'}}>
                                {tags.map((tag, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            {tag}
                                            <TableCellActions>
                                                <PrimaryButton onClick={() => handleRemoveTag(idx)} text="Remove" />
                                            </TableCellActions>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        )}
                    </Stack>
                )}
                {selectedValue === 'annotations' && (
                    <Stack>
                        <TextField
                            multiline
                            rows={4}
                            value={annotation}
                            onChange={(e, newValue) => setAnnotation(newValue || '')}
                        />
                        <PrimaryButton onClick={handleAddAnnotation} text="Add" />
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
                )}
            </div>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <PrimaryButton onClick={handleSave} text="Save" />
            </Stack>
            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </Stack>
    );
};
