import React from "react";
import ReactDOM from "react-dom/client";
import 'source-map-support/register';
import {FloatingPanel} from "./FloatingPanel";

// TODO breadchris more logic can be added here to improve performance https://github.com/evanw/esbuild/blob/7d11ef1e24a3f0981e45e37200957268c4e22619/CHANGELOG.md?plain=1#L1009
// new EventSource('/esbuild').addEventListener('change', () => location.reload())

const rootElem = document.createElement("div");
rootElem.setAttribute("id", "lunabrain-root");
document.body.appendChild(rootElem);

// let shadowRoot = rootElem.attachShadow({mode: 'open'});
// rootElem.style.width = '0';
// rootElem.style.height = '0';
// rootElem.style.padding = '0';
// rootElem.style.margin = '0';
//
// shadowRoot.appendChild(rootElem);

rootElem.style.width = '0';
rootElem.style.height = '0';
rootElem.style.padding = '0';
rootElem.style.margin = '0';

function injectScriptFile(scriptName: string) {
    const script = document.createElement('script');
    const u = chrome.runtime.getURL(scriptName);
    script.src = u;
    (document.head || document.documentElement).appendChild(script);
    script.onload = function() {
        this.remove();
    };
}

// Listen for the event from the injected script
document.addEventListener('NEXT_JS_PARAMS', function (e) {
    const data = JSON.parse(e.detail);
    console.log('NEXT_JS_PARAMS', data);
    const msgStr: string = data[20][1];
    const msgData = JSON.parse(msgStr.substring(3));
    const messages = msgData[3]['chat']['messages']
    const formatted = messages.map((msg: any) => {
        return `[${msg['role']}] ${msg['content']}`;
    });
    console.log(formatted);
});

// injectScriptFile('injected.js');

const root = ReactDOM.createRoot(rootElem);
root.render(
    <React.StrictMode>
        <FloatingPanel />
    </React.StrictMode>
);