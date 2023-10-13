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
import {contentGet, contentSave} from "@/extension/shared";
import {SaveWizard} from "@/extension/SaveWizard";

interface FloatingPanelProps {}

// TODO breadchris get page content https://github.com/omnivore-app/omnivore/blob/main/pkg/extension/src/scripts/content/prepare-content.js#L274

const floatingPanelStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    color: 'black',
    maxHeight: '300px',
    overflowY: 'auto',
    zIndex: 9999,
    right: '10px',
    bottom: '10px',
    position: 'fixed',
}

export const FloatingPanel: React.FC<FloatingPanelProps> = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [content, setContent] = useState<string|undefined>(undefined);

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'l') {
                event.preventDefault();
                setVisible(!visible);
            }
        }
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, [visible]);

    useEffect(() => {
        chrome.runtime.sendMessage(
            { action: contentGet, data: "TODO make url?" },
            (response) => {
                if (response.data) {
                    setContent(response.data);
                    setVisible(true);
                }
            }
        );
    }, []);

    const saveContent = () => {
        chrome.runtime.sendMessage(
            { action: contentSave, data: content },
            (response) => {
                setVisible(false)
            }
        );
    }

    if (!visible) {
        return null;
    }

    return (
        <Stack id="floating-panel" tokens={{ childrenGap: 10 }} style={floatingPanelStyle}>
            {content ? (
                <>
                    <h5>Save this page?</h5>
                    <Stack horizontal>
                        <Button onClick={saveContent}>Yes</Button>
                        <Button onClick={() => setVisible(false)}>No</Button>
                    </Stack>
                </>
            ) : (
                <SaveWizard />
            )}
        </Stack>
    );
};
