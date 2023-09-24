/// <reference types="chrome"/>
chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension Installed');
});
export {};