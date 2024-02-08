import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserHistory} from "./BrowserHistory";
import {FloatingPanel} from "./FloatingPanel";
import {Journey} from "./Journey";

// TODO breadchris more logic can be added here to improve performance https://github.com/evanw/esbuild/blob/7d11ef1e24a3f0981e45e37200957268c4e22619/CHANGELOG.md?plain=1#L1009
// new EventSource('/esbuild').addEventListener('change', () => location.reload())

const rootElem = document.createElement("div");
document.body.appendChild(rootElem);

const root = ReactDOM.createRoot(rootElem as HTMLElement);
root.render(
    <React.StrictMode>
        <FloatingPanel />
        {/*<Journey />*/}
        <BrowserHistory />
    </React.StrictMode>
);