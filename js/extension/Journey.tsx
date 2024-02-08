import * as React from "react";
import {Gitgraph, templateExtend, TemplateName} from "@gitgraph/react";
import {useEffect, useState} from "react";
import {contentGet, historyGet} from "./shared";
import {History} from "@/rpc/content/browser/history_pb";
import {GitgraphCore} from "@gitgraph/core";
import {ReactSvgElement} from "@gitgraph/react/src/types";

export const Journey: React.FC = () => {
    const [browserHistory, setBrowserHistory] = useState<History|undefined>(undefined);

    const withoutHash = templateExtend(TemplateName.Metro, {
        commit: {
            message: {
                displayHash: false,
            },
        },
    });

    const graph = new GitgraphCore<ReactSvgElement>({
        template: withoutHash,
    });
    const gitgraph = graph.getUserApi();

    const loadBrowserHistory = async () => {
        const response = await chrome.runtime.sendMessage({ action: historyGet, data: "TODO" });
        console.log(response);
        if (response && response.data) {
            const h = History.fromJsonString(response.data);
            console.log(h)
            setBrowserHistory(h);
        }
    }

    useEffect(() => {
        void loadBrowserHistory();
    }, []);

    useEffect(() => {
        console.log('browserHistory', browserHistory)
        if (!browserHistory) {
            return;
        }

        console.log(browserHistory)

        const branches: { [key: string]: any } = {};

        // Create branches for each node
        browserHistory.edges.forEach((edge) => {
            branches[edge.tab] = gitgraph.branch(edge.tab);
        });

        // Add commits to branches and link them based on edges
        browserHistory.edges.forEach((edge) => {
            const node = browserHistory.nodes.find((node) => node.id === edge.from);
            const branch = branches[edge.tab];

            if (branch) {
                branch.commit({
                    subject: node?.title || 'TODO',
                    dotText: '🔗',
                    author: node?.url || 'TODO',
                    body: `Visited at ${new Date(edge.visitTime).toLocaleString()}`
                });

                // TODO breadchris what would a git merge for browser history look like?
                //toBranch.merge(fromBranch);
            }
        });
    }, [browserHistory]);

    return (
        <div style={{height: "100vh"}}>
            <button onClick={loadBrowserHistory}>Reload</button>
            {browserHistory && (
                <Gitgraph graph={graph} />
            )}
        </div>
    )
}
