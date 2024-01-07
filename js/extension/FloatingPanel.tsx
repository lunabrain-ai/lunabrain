import React, { useState, useEffect } from 'react';
import {contentGet, contentSave, TabContent} from "./shared";
import {NewSaveWizard} from "./NewSaveWizard";
import {urlContent} from "./util";

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
    const [tabContent, setTabContent] = useState<TabContent|undefined>(undefined);

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
                    setTabContent(response.data);
                    setVisible(true);
                }
            }
        );
    }, []);

    const saveContent = () => {
        if (!tabContent) {
            return;
        }
        const u = new URL(tabContent.from);
        const content = urlContent(tabContent.to, ['browser/history', u.host])
        chrome.runtime.sendMessage(
            { action: contentSave, data: content },
            (response) => {
                if (response.error) {
                    console.error(response.error);
                    return;
                }
                setVisible(false)
            }
        );
        setTabContent(undefined);
    }

    const dontSave = () => {
        setVisible(false);
        setTabContent(undefined);
    }

    if (!visible) {
        return null;
    }

    return (
        <div id="floating-panel" style={floatingPanelStyle}>
            {tabContent ? (
                <>
                    <h5>Save this page?</h5>
                    <div className={"flex flex-row"}>
                        <button className={"btn"} onClick={saveContent}>Yes</button>
                        <button className={"btn"} onClick={dontSave}>No</button>
                    </div>
                </>
            ) : (
                <NewSaveWizard />
            )}
        </div>
    );
};
