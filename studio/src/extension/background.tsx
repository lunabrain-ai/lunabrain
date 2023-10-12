/// <reference types="chrome"/>
import {contentService, projectService, userService} from "@/service";
import {urlContent} from "@/extension/util";
import {contentGet} from "@/extension/shared";

let tabContent: string|undefined = undefined;

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

    chrome.webNavigation.onCompleted.addListener((details) => {
        if (details.url && details.frameType === "outermost_frame") {
            // console.log(`Visited URL: ${details.url}`);
        }
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
    });

    chrome.tabs.onCreated.addListener(async (tab) => {
        if (!tab.id) {
            return;
        }
        // console.log(`Tab with ID ${tab.id} has been created.`);
        const tabDetails = await getTabDetails(tab.id);
        if (tabDetails) {
        }
    })

    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
        // console.log(`Tab with ID ${tabId} has been closed.`);
        const tabDetails = await getTabDetails(tabId);
        if (tabDetails) {
            // console.log(`Tab with URL ${tabDetails.url} has been closed.`);
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
                tabContent = details.url;
                // TODO breadchris auto collecting config
                (
                    async () => {
                        try {
                            const resp = await contentService.save({
                                content: urlContent(details.url, ['browser/history', u.host]),
                                related: []
                            });
                            console.log(resp);
                        } catch (e) {
                            console.error('failed to save', e)
                        }
                    }
                )()
            }
        }, { urls: ["<all_urls>"] }, [])

    chrome.webRequest.onBeforeSendHeaders.addListener(
        (details) => {
            let refererValue = '';
            if (!details.requestHeaders) {
                return;
            }
            for (let header of details.requestHeaders) {
                if (header.name.toLowerCase() === "referer" && header.value) {
                    refererValue = header.value;
                    // console.log(`Visited URL: ${details.url}, Referrer: ${refererValue}`);
                    break;
                }
            }
            //console.log(`Visited URL: ${details.url}, Referrer: ${refererValue}`);
        },
        { urls: ["<all_urls>"] }, // Monitor all URLs
        ["requestHeaders"] // Necessary to get the request headers
    );
}

chromeExt();

export {};