import React from "react";
import ReactDOM from "react-dom/client";
import 'source-map-support/register';
import {App} from "@/App";
import * as rrweb from 'rrweb';
import {HTMLEvents, RRWebRecorder} from "@/event/HTMLEvents";

global.React = React;

const isDev = process.env.PRODUCTION === "false";

// TODO breadchris more logic can be added here to improve performance https://github.com/evanw/esbuild/blob/7d11ef1e24a3f0981e45e37200957268c4e22619/CHANGELOG.md?plain=1#L1009
if (isDev) {
    new EventSource('/esbuild').addEventListener('change', () => location.reload())
}

// const recorder = new RRWebRecorder();
// recorder.startRecording();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
      <App dev={isDev} />
  </React.StrictMode>
);
