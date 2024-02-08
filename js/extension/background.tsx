/// <reference types="chrome"/>
import {contentService, projectService, userService} from "@/service";
import {contentGet, contentSave, historyDelete, historyGet, TabContent} from "./shared";
import { Content } from "@/rpc/content/content_pb";
import HttpHeader = chrome.webRequest.HttpHeader;
import {Conversation, ImageAsset, Content as ConvContent} from "@/rpc/content/chatgpt/conversation_pb";
import {Conversation as TSConversation} from "./chatgpt";
import {History, Node, Edge} from "@/rpc/content/browser/history_pb";
import {uuidv4} from "./util";
import {getItem, setItem} from "./chrome/storage";

let tabContent: TabContent|undefined = undefined;
let content: Content|undefined = undefined;

const getHistoryContent = async () => {
    if (content) {
        return content;
    }

    try {
        const storedHistory = await getItem('history');
        if (storedHistory) {
            content = Content.fromJson(JSON.parse(storedHistory));
            return content;
        }
    } catch (e) {
        console.warn('failed to load history from localstorage', e);
    }

    return new Content({
        id: uuidv4(),
        type: {
            case: 'browserHistory',
            value: new History()
        },
        tags: []
    })
}

const getHistory = async () => {
    const content = await getHistoryContent();
    return content.type.value as History;
}

const setHistory = async (h: History) => {
    const c = await getHistoryContent();
    const history = new Content({
        id: c.id,
        type: {
            case: 'browserHistory',
            value: h
        },
        tags: c.tags
    });
    void setItem('history', history.toJsonString());
    content = history;
    //void saveContent(history);
}

async function saveContent(content: Content) {
    try {
        const resp = await contentService.save({
            content: content,
            related: []
        });
        console.log(resp);
    } catch (e) {
        console.error('failed to save', e)
    }
}

const tabs = new Map<number, {
    created: number;
    closed: number;
    tab: chrome.tabs.Tab;
    prev: chrome.tabs.Tab | undefined;
}>();

function extractUuidFromUrl(url: string): string | null {
    const regex = /^https:\/\/chat\.openai\.com\/backend-api\/conversation\/([0-9a-fA-F\-]+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const chromeExt = () => {
    (
        async () => {
            const resp = await userService.login({}, {});
            // TODO breadchris I think this has the whitelist config in it
            console.log(resp);
        }
    )()

    chrome.runtime.onInstalled.addListener(function() {
        console.log('Extension Installed');
    });

    chrome.runtime.onStartup.addListener(function() {
        console.log('Extension Started');
    })

    chrome.history.onVisited.addListener((result) => {
        console.log('onVisited', result.url)
    });

    chrome.webNavigation.onCommitted.addListener((details) => {
        console.log('onCommitted', details.url)
    });

    function getTabDetails(tabId: number): Promise<chrome.tabs.Tab | undefined> {
        return new Promise((resolve, reject) => {
            chrome.tabs.get(tabId, tab => {
                if (chrome.runtime.lastError) {
                    // Ignore errors, sometimes tabs might have already closed before we can fetch details
                    resolve(undefined);
                } else {
                    resolve(tab);
                }
            });
        });
    }

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // TODO breadchris replace with a typed action
        if (message.action === contentGet) {
            sendResponse({ data: tabContent });
            tabContent = undefined;
        }
        if (message.action === historyGet) {
            (async () => {
                const history = await getHistory();
                sendResponse({ data: history.toJsonString(), status: true });
            })();
        }
        if (message.action === historyDelete) {
            (async () => {
                await setHistory(new History());
                sendResponse({ data: {}, status: true });
            })();
        }
        if (message.action === contentSave) {
            (async () => {
                const content = Content.fromJson(message.data);
                try {
                    await saveContent(content);
                } catch (e) {
                    sendResponse({data: {error: e}});
                    return;
                }
                sendResponse({data: {}});
            })();
        }
        return true;
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (!tabId) {
            return;
        }
        const tabDetails = await getTabDetails(tabId);
        if (tabDetails) {
            // console.log('onUpdated', tabId, changeInfo, tabDetails);
            const t = tabs.get(tabId);
            if (t) {
                tabs.set(tabId, {
                    ...t,
                    tab: tabDetails,
                    prev: t.tab
                });

                if (changeInfo.status === 'complete') {
                    console.log('onUpdated:complete', tabId, tabDetails.url, tabDetails);
                    const history = await getHistory();

                    if (tabDetails.url) {
                        const newNode = new Node({
                            id: uuidv4(),
                            url: tabDetails.url,
                            title: tabDetails.title || '',
                            open: Date.now(),
                            close: -1
                        });
                        const foundNode = history.nodes.find((n) => n.url === tabDetails.url);
                        if (!foundNode) {
                            history.nodes.push(newNode);
                        }
                        const n = foundNode || newNode;

                        const prevNode = history.nodes.find((n) => n.url === t?.prev?.url);
                        console.log("prev", prevNode, t);
                        if (prevNode) {
                            history.nodes[history.nodes.findIndex((n) => n.id === prevNode.id)] = new Node({
                                ...prevNode,
                                close: Date.now()
                            });
                            history.edges.push(new Edge({
                                from: prevNode.id,
                                to: n.id,
                                visitTime: Date.now(),
                                tab: tabId.toString()
                            }));
                        }
                    }
                    void setHistory(history);
                    // TODO breadchris deal with tabDetails.openerTabId
                }
            }
        }
    });

    chrome.tabs.onCreated.addListener(async (tab) => {
        if (!tab.id) {
            return;
        }
        const tabDetails = await getTabDetails(tab.id);
        if (tabDetails) {
            tabs.set(tab.id, {
                created: Date.now(),
                closed: -1,
                tab: tabDetails,
                prev: undefined
            });
        }
    })

    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        const t = tabs.get(tabId);
        if (t) {
            const newTab = {
                ...t,
                closed: Date.now()
            }
            tabs.set(tabId, newTab);
            console.log('tab was opened for', (newTab.closed - newTab.created) / 1000, 'seconds')
        }
    });

    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!details.initiator || details.type !== 'main_frame') {
                return;
            }
            const u = new URL(details.initiator);
            const v = new URL(details.url);
            if (u.host === v.host) {
                return;
            }
            // TODO breadchris integrate whitelist
            if (u.host === 'news.ycombinator.com') {
                tabContent = {
                    from: details.initiator,
                    to: details.url
                }
                // TODO breadchris auto collecting config
            }
            console.log('onBeforeRequest', details.url, details);
        }, { urls: ["<all_urls>"] }, [])

    let headers: Record<string, HttpHeader[]> = {};
    let seen: Record<string, number> = {};
    chrome.webRequest.onCompleted.addListener(
        (details) => {
            const s = seen[details.url.toString()] || 0;
            //console.log('completed', details.url, details)
            if (extractUuidFromUrl(details.url) && s < 2) {
                const h = headers[details.url.toString()];
                //console.log('completed', details.url, details)
                fetch(details.url, {
                    headers: h.map((v) => {
                        return [v.name, v.value||'']
                    })
                }).then((resp) => {
                    // TODO breadchris create content and send it to the content script
                    return resp.json();
                }).then((json: TSConversation) => {
                    console.log('json', json)
                    let conv = Conversation.fromJson(json as any, {
                        ignoreUnknownFields: true
                    });

                    Object.keys(json.mapping).map((k: any) => {
                        const v = json.mapping[k];
                        const c = v.message?.content;
                        if (!c) {
                            return;
                        }
                        let textParts: string[] = [];
                        let imageParts: ImageAsset[] = [];
                        let text = '';
                        switch (c.content_type) {
                            case 'text':
                                textParts = c.parts;
                                break;
                            case 'multimodal_text':
                                imageParts = c.parts.map((p) => {
                                    return ImageAsset.fromJson(p as any, {
                                        ignoreUnknownFields: true
                                    });
                                });
                                break;
                            case 'code':
                                text = c.text;
                                break;
                        }
                        if (conv.mapping[k].message !== undefined) {
                            // @ts-ignore
                            conv.mapping[k].message.content = new ConvContent({
                                contentType: c.content_type as string,
                                textParts: textParts,
                                imageParts: imageParts,
                                text: text
                            });
                        }
                    });

                    console.log(conv)

                    const content = new Content({
                        id: conv.conversationId,
                        type: {
                            case: 'chatgptConversation',
                            value: conv
                        },
                        tags: ['chatgpt']
                    });
                    void saveContent(content);
                }).catch((e) => {
                    console.error('failed to fetch', e)

                })
            }
        }, { urls: ["<all_urls>"] }, [])

    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            //console.log('onBeforeSendHeaders', details.url, details);
            let refererValue = '';
            if (!details.requestHeaders) {
                return;
            }
            const s = seen[details.url.toString()] || 0;
            if (extractUuidFromUrl(details.url)) {
                seen[details.url.toString()] = s + 1;
                headers[details.url.toString()] = details.requestHeaders;
                //console.log('send', details.url, details)
            }
            for (let header of details.requestHeaders) {
                if (header.name.toLowerCase() === "referer" && header.value) {
                    refererValue = header.value;
                    // console.log(`Visited URL: ${details.url}, Referrer: ${refererValue}`);
                    break;
                }
            }
            // request details.url
        },
        { urls: ["<all_urls>"] }, // Monitor all URLs
        ["requestHeaders"] // Necessary to get the request headers
    );
}

chromeExt();

export {};