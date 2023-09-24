"use strict";
(() => {
  // src/extension/background.tsx
  chrome.runtime.onInstalled.addListener(function() {
    console.log("Extension Installed");
  });
})();
//# sourceMappingURL=background.js.map
