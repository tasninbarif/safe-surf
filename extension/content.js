// This runs on every webpage.
// It can read the page text.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "GET_PAGE_TEXT") {
    const text = document.body ? document.body.innerText : "";
    sendResponse({
      ok: true,
      url: location.href,
      title: document.title,
      text: text.slice(0, 5000) // first 5000 characters for now
    });
  }
});