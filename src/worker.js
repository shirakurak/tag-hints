// Tag Hints - Phase 0
// Background service worker: returns dummy tags
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === "SUGGEST_TAGS") {
    const dummy = ["javascript","react","typescript","testing","ci"];
    if (sender.tab && sender.tab.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, { type: "TAG_RESULTS", tags: dummy });
    }
  }
});