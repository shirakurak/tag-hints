// Tag Hints - Phase 0
// Background service worker: handles button click and returns dummy tags

// 拡張機能のアイコンがクリックされたときのイベントリスナーを追加
chrome.action.onClicked.addListener(async (tab) => {
  // manifest.jsonのhost_permissionsにマッチするページでのみ
  // content_scriptが動作しているため、メッセージが届かない場合があるが、
  // エラーは無視して問題ない。
  if (tab.id !== undefined) {
    chrome.tabs.sendMessage(tab.id, { type: "SHOW_MODAL" });
  }
});

// 既存のタグ提案処理
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type === "SUGGEST_TAGS") {
    const dummy = ["javascript","react","typescript","testing","ci"];
    if (sender.tab && sender.tab.id !== undefined) {
      chrome.tabs.sendMessage(sender.tab.id, { type: "TAG_RESULTS", tags: dummy });
    }
  }
});