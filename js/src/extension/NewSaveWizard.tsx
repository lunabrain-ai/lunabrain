import React, {useEffect, useState} from "react";
import {SelectTabData, SelectTabEvent, TabValue} from "@fluentui/react-components";
import {contentService} from "@/service";
import {urlContent} from "@/extension/util";
import { Content } from "@/rpc/content/content_pb";

interface SaveWizardProps {}

const styles: Record<string, React.CSSProperties> = {
    floatingPanel: {
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
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    buttonPrimary: {
        backgroundColor: '#0078d4',
        border: 'none',
        padding: '5px 15px',
        color: 'white',
        cursor: 'pointer'
    },
    tablist: {
        display: 'flex',
        gap: '10px'
    },
    table: {
        height: '100px',
        overflowY: 'auto',
        borderCollapse: 'collapse',
        width: '100%'
    },
    tableRow: {
        borderBottom: '1px solid #ccc'
    },
    tableCell: {
        padding: '5px'
    },
    errorText: {
        color: 'red'
    }
};

export const SaveWizard: React.FC<SaveWizardProps> = () => {
    const [error, setError] = useState<string|undefined>(undefined);
    const [title, setTitle] = useState(document.title || window.location.href);
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
        <div id="floating-panel">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="tablist">
                <button onClick={() => setSelectedValue("tags")}>Tags</button>
                <button onClick={() => setSelectedValue("annotations")}>Annotations</button>
                <button onClick={() => setSelectedValue("analyze")}>Analyze</button>
            </div>
            <div>
                {/* Analyze content */}
                {selectedValue === 'analyze' && (
                    <div>
                        <button className="button-primary" onClick={analyze}>Analyze</button>
                        {analysis && (
                            <ul>
                                {analysis.map((content, idx) => (
                                    content.tags.map((t, idx) => (
                                        <button key={idx} onClick={() => handleAddTag(t)}>{t}</button>
                                    ))
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Tags content */}
                {selectedValue === 'tags' && (
                    <div>
                        <input type="text" value={tag} placeholder="tag" onChange={(e) => setTag(e.target.value)} />
                        <button className="button-primary" onClick={() => tag && handleAddTag(tag)}>Add</button>
                        {tags.length > 0 && (
                            <table className="table">
                                <tbody>
                                {tags.map((tag, idx) => (
                                    <tr className="table-row" key={idx}>
                                        <td className="table-cell">
                                            {tag}
                                            <button className="button-primary" onClick={() => handleRemoveTag(idx)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Annotations content */}
                {selectedValue === 'annotations' && (
                    <div>
                        <textarea rows={4} value={annotation} onChange={(e) => setAnnotation(e.target.value)}></textarea>
                        <button className="button-primary" onClick={handleAddAnnotation}>Add</button>
                        {annotations.length > 0 && (
                            <table className="table">
                                <tbody>
                                {annotations.map((annotation, idx) => (
                                    <tr className="table-row" key={idx}>
                                        <td className="table-cell">
                                            {annotation}
                                            <button className="button-primary" onClick={() => handleRemove(idx)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className="button-primary" onClick={handleSave}>Save</button>
            </div>
            {error && (
                <div style={{ color: 'red' }}>{error}</div>
            )}
        </div>
    );
};
