import React from "react";
import ReactDOM from "react-dom/client";
import 'source-map-support/register';
import {FloatingPanel} from "@/extension/FloatingPanel";

// TODO breadchris more logic can be added here to improve performance https://github.com/evanw/esbuild/blob/7d11ef1e24a3f0981e45e37200957268c4e22619/CHANGELOG.md?plain=1#L1009
// new EventSource('/esbuild').addEventListener('change', () => location.reload())

const rootElem = document.createElement("div");
rootElem.setAttribute("id", "lunabrain-root");
document.body.appendChild(rootElem);

rootElem.style.width = '0';
rootElem.style.height = '0';
rootElem.style.padding = '0';
rootElem.style.margin = '0';

const root = ReactDOM.createRoot(rootElem);
root.render(
    <React.StrictMode>
        <FloatingPanel />
    </React.StrictMode>
);