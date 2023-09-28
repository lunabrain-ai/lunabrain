import React from "react";
import ReactDOM from "react-dom/client";
import 'source-map-support/register';
import {FloatingPanel} from "@/extension/FloatingPanel";

// TODO breadchris more logic can be added here to improve performance https://github.com/evanw/esbuild/blob/7d11ef1e24a3f0981e45e37200957268c4e22619/CHANGELOG.md?plain=1#L1009
// new EventSource('/esbuild').addEventListener('change', () => location.reload())

const rootElem = document.createElement("div");
rootElem.setAttribute("id", "lunabrain-root");
togglePanelVisibility();

document.body.appendChild(rootElem);
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'l') {
        togglePanelVisibility();
        event.preventDefault(); // To prevent default action of Ctrl+L (focus on address bar)
    }
});

function togglePanelVisibility() {
    if (rootElem.style.display === 'none') {
        rootElem.style.display = 'block';
    } else {
        rootElem.style.display = 'none';
    }
}

const root = ReactDOM.createRoot(rootElem as HTMLElement);
root.render(
    <React.StrictMode>
        <FloatingPanel />
    </React.StrictMode>
);