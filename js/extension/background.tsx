/// <reference types="chrome"/>
import {contentService, projectService, userService} from "@/service";
import {urlContent} from "./util";
import {contentGet, contentSave, TabContent} from "./shared";
import { Content } from "@/rpc/content/content_pb";
import HttpHeader = chrome.webRequest.HttpHeader;

let tabContent: TabContent|undefined = undefined;
let history: {
    from: string;
    to: string;
    time: number;
}[] = [];

const tabs = new Map<number, {
    created: number;
    closed: number;
    tab: chrome.tabs.Tab
}>();

function extractUuidFromUrl(url: string): string | null {
    const regex = /https:\/\/chat\.openai\.com\/backend-api\/conversation\/([0-9a-fA-F\-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const chromeExt = () => {
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

    chrome.webNavigation.onCommitted.addListener((details) => {
        console.log('completed', details.url)
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

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        // TODO breadchris replace with a typed action
        if (message.action === contentGet) {
            sendResponse({ data: tabContent });
            tabContent = undefined;
        }
        if (message.action === contentSave) {
            console.log('asdf')
            const content = Content.fromJson(message.data);
            try {
                await saveContent(content);
            } catch (e) {
                sendResponse({ data: { error: e } });
                return;
            }
            sendResponse({ data: {} });
        }
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        if (!tabId) {
            return;
        }
        const tabDetails = await getTabDetails(tabId);
        if (tabDetails) {
            const t = tabs.get(tabId);
            if (t) {
                tabs.set(tabId, {
                    ...t,
                    tab: tabDetails
                });
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
                tab: tabDetails
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
            console.log(`Visited URL: ${details.url}, Referrer: ${details.initiator}`);
        }, { urls: ["<all_urls>"] }, [])

    let headers: Record<string, HttpHeader[]> = {};
    let seen: Record<string, number> = {};
    chrome.webRequest.onCompleted.addListener(
        (details) => {
            const s = seen[details.url.toString()] || 0;
            console.log('completed', details.url, details)
            if (extractUuidFromUrl(details.url) && s < 2) {
                const h = headers[details.url.toString()];
                console.log('completed', details.url, details)
                fetch(details.url, {
                    headers: h.map((v) => {
                        return [v.name, v.value||'']
                    })
                }).then((resp) => {
                    // TODO breadchris create content and send it to the content script
                    return resp.json();
                }).then((json) => {
                    console.log('json', json)
                }).catch((e) => {
                    console.error('failed to fetch', e)

                })
            }
        }, { urls: ["<all_urls>"] }, [])

    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            let refererValue = '';
            if (!details.requestHeaders) {
                return;
            }
            const s = seen[details.url.toString()] || 0;
            if (extractUuidFromUrl(details.url)) {
                seen[details.url.toString()] = s + 1;
                headers[details.url.toString()] = details.requestHeaders;
                console.log('send', details.url, details)
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

console.log('asdf')
chromeExt();

export {};