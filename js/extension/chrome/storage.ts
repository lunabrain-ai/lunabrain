/// <reference types="chrome"/>

export function setItem(key: string, value: any): Promise<undefined> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(undefined);
            }
        });
    });
}

// Async wrapper for getting a value
export function getItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key]);
            }
        });
    });
}

// Async wrapper for removing a value
function removeItem(key: string) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove([key], () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(undefined);
            }
        });
    });
}

// Async wrapper for clearing all data
function clearStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.clear(() => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(undefined);
            }
        });
    });
}