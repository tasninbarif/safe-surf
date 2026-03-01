const btn = document.getElementById("btn");
const statusEl = document.getElementById("status");
const outEl = document.getElementById("out");

function getRiskColor(level) {
  if (level === "Low") return "#28a745";
  if (level === "Medium") return "#fd7e14";
  if (level === "High") return "#dc3545";
  if (level === "Critical") return "#7b0000";
  return "#555";
}

function renderResults(data) {
  const color = getRiskColor(data.risk_level);
  outEl.innerHTML = `
    <div style="background:white; border-radius:12px; padding:12px; border: 2px solid ${color};">
      
      <div style="text-align:center; margin-bottom:10px;">
        <span style="font-size:28px; font-weight:700; color:${color};">${data.score}/100</span>
        <span style="display:block; font-size:13px; font-weight:700; color:${color};">${data.risk_level} Risk</span>
      </div>

      <div style="font-size:12px; color:#333; margin-bottom:10px; line-height:1.5;">
        ${data.summary}
      </div>

      <div style="margin-bottom:10px;">
        <strong style="font-size:12px; color:#d63384;"> Worst Clauses</strong>
        ${data.worst_clauses.map(c => `<div style="font-size:11px; background:#fff0f7; border-radius:6px; padding:5px; margin-top:4px;">• ${c}</div>`).join("")}
      </div>

      <div style="margin-bottom:10px;">
        <strong style="font-size:12px; color:#d63384;"> Verdict</strong>
        <div style="font-size:11px; margin-top:4px; font-style:italic;">${data.verdict}</div>
      </div>

      <div>
        <strong style="font-size:12px; color:#d63384;"> What you should do</strong>
        ${data.actions.map(a => `<div style="font-size:11px; background:#f0fff4; border-radius:6px; padding:5px; margin-top:4px;">• ${a}</div>`).join("")}
      </div>

    </div>
  `;
}

btn.addEventListener("click", async () => {
  statusEl.textContent = "Reading page...";
  outEl.innerHTML = "";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    statusEl.textContent = "No active tab found.";
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_TEXT" }, (res) => {
    if (!res || !res.ok) {
      statusEl.textContent = "Could not read this page (try refreshing).";
      return;
    }
    statusEl.textContent = `Analyzing: ${res.title}...`;

    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: res.text, url: res.url })
    })
    .then(r => r.json())
    .then(data => {
      statusEl.textContent = "";
      renderResults(data);
    })
    .catch(err => {
      statusEl.textContent = "Backend error — is Flask running?";
      console.error(err);
    });
  });
});
document.getElementById("findPolicy").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const base = url.hostname;
  
  const attempts = [
    `https://${base}/privacy`,
    `https://${base}/privacy-policy`,
    `https://${base}/legal/privacy`,
    `https://www.${base}/privacy`,
  ];
  
  chrome.tabs.update(tab.id, { url: attempts[0] });
});