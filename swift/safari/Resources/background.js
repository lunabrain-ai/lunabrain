browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);

    if (request.greeting === "hello")
        sendResponse({ farewell: "goodbye" });
});

chrome.webNavigation.onCompleted.addListener((details) => {
    console.log(details);
});
