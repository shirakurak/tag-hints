// Tag Hints - Phase 0
// Content script: minimal overlay + wiring
let latestText = "";
const overlayId = "tag-hints-overlay";

function ensureOverlay() {
  if (document.getElementById(overlayId)) return;
  const div = document.createElement("div");
  div.id = overlayId;
  div.innerHTML = `
    <div class="tagh-card">
      <div class="tagh-row">
        <strong>Tag Hints</strong>
      </div>
      <div class="tagh-row">
        <button id="tagh-suggest">タグ提案</button>
      </div>
      <div id="tagh-results" class="tagh-row" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(div);
  document.getElementById("tagh-suggest").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "SUGGEST_TAGS", text: latestText });
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
  ensureOverlay();
});
observer.observe(document.documentElement, { subtree: true, childList: true });

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TAG_RESULTS") {
    const box = document.getElementById("tagh-results");
    if (!box) return;
    box.textContent = msg.tags.join(", ");
  }
});