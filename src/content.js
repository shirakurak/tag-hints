// Tag Hints - Phase 0
// Content script: minimal overlay + wiring
let latestText = "";
const overlayId = "tag-hints-overlay";

function createOverlay() {
  const div = document.createElement("div");
  div.id = overlayId;
  div.innerHTML = `
    <div class="tagh-card">
      <button id="tagh-close" class="tagh-close-button" aria-label="閉じる">&times;</button>
      <div class="tagh-row">
        <strong>Tag Hints</strong>
      </div>
      <div class="tagh-row">
        <button id="tagh-suggest">タグ提案</button>
      </div>
      <div id="tagh-results" class="tagh-row" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(div);

  // モーダルを閉じる関数
  const closeModal = () => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.remove();
    }
  };

  // 閉じるボタンにイベントリスナーを追加
  document.getElementById("tagh-close").addEventListener("click", closeModal);

  // タグ提案ボタンにイベントリスナーを追加
  document.getElementById("tagh-suggest").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "SUGGEST_TAGS", text: latestText });
  });

  // オーバーレイ（背景）クリックで閉じるイベントリスナーを追加
  div.addEventListener("click", (e) => {
    if (e.target.id === overlayId) {
      closeModal();
    }
  });
}

function extractEditorText() {
  // Very loose selectors for Phase 0; will be hardened in Phase 1+.
  const candidates = [
    'textarea',
    '[data-zn-markdown-textarea="true"] textarea',
    '.md-editor textarea',
    'textarea[placeholder*="Markdown"]'
  ];
  for (const sel of candidates) {
    const el = document.querySelector(sel);
    if (el && typeof el.value === "string" && el.value.trim().length > 0) return el.value;
  }
  return "";
}

const observer = new MutationObserver(() => {
  latestText = extractEditorText();
});
observer.observe(document.documentElement, { subtree: true, childList: true });

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SHOW_MODAL") {
    // モーダルが存在しない場合のみ作成
    if (!document.getElementById(overlayId)) {
      createOverlay();
    }
  }
  if (msg.type === "TAG_RESULTS") {
    const box = document.getElementById("tagh-results");
    if (!box) return;
    box.textContent = msg.tags.join(", ");
  }
});