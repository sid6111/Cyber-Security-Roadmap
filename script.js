// script.js
// Static data ported from your React TOPICS constant.
// Handles rendering tiles, search, selection and detail panel.

const TOPICS = [
  {
    id: "web-security",
    title: "Web / App Security",
    short: "OWASP Top 10, XSS, SQLi, CSRF, Auth flaws",
    description:
      "Learn common web vulnerabilities (OWASP Top 10) with hands-on practice. Use Burp Suite to intercept and manipulate traffic, and map each vulnerability to a lab exercise.",
    tools: ["Burpsuite", " OWASP ZAP", " SQLmap", " Nikto", " XSStrike"],
    resources: [
      {
        label: "PortSwigger Web Security Academy",
        url: "https://portswigger.net/web-security",
      },
      {
        label: "OWASP Juice Shop",
        url: "https://owasp.org/www-project-juice-shop/",
      },
    ],
  },
  {
    id: "offensive",
    title: "Offensive / Pentesting",
    short: "TryHackMe, HTB, Metasploitable",
    description:
      "Hands-on pentesting practice using purposely vulnerable machines. Learn enumeration, exploitation, privilege escalation and post-exploitation workflows.",
    tools: ["Metasploit", " Nmap", " Hydra", " John the Ripper", " Pwntools"],
    resources: [
      { label: "TryHackMe", url: "https://tryhackme.com" },
      { label: "Hack The Box", url: "https://hackthebox.com" },
    ],
  },
  {
    id: "network",
    title: "Network Security & Analysis",
    short: "Nmap, Wireshark, traffic analysis",
    description:
      "Understand network topologies, capture and analyze traffic, and use scanning tools to discover hosts and services. Practice defensive and offensive network techniques.",
    tools: ["Wireshark", " Nmap", " Tcpdump", " Zeek", " Snort"],
    resources: [
      { label: "Wireshark Tutorials", url: "https://www.wireshark.org/docs/" },
      { label: "Nmap Book", url: "https://nmap.org/book/" },
    ],
  },
  {
    id: "forensics",
    title: "Digital Forensics",
    short: "Disk, memory forensics, Autopsy, Volatility",
    description:
      "Collect and analyze artifacts from disk images and memory snapshots. Learn tools and methodologies for incident response and evidence preservation.",
    tools: [
      "Autopsy",
      " Volatility",
      " FTK Imager",
      " Bulk Extractor",
      " SleuthKit",
    ],
    resources: [
      { label: "Autopsy", url: "https://www.sleuthkit.org/autopsy/" },
      { label: "Volatility", url: "https://www.volatilityfoundation.org/" },
    ],
  },
  {
    id: "scripting",
    title: "Scripting & Automation",
    short: "Python, Bash for pentesting",
    description:
      "Automate repetitive tasks, parse tool output, and write small utilities to speed up recon and exploitation. Practice Python and Bash scripts applied to real labs.",
    tools: ["Python", " Bash", " PowerShell", " Ansible", " expect"],
    resources: [
      { label: "Real Python", url: "https://realpython.com/" },
      {
        label: "OverTheWire Bandit",
        url: "https://overthewire.org/wargames/bandit/",
      },
    ],
  },
];

// DOM refs
const tilesEl = document.getElementById("tiles");
const searchEl = document.getElementById("search");
const resetBtn = document.getElementById("resetBtn");
const detailCard = document.getElementById("detailCard");

let selected = null;
let query = "";

// Render tiles based on filter
function renderTiles() {
  tilesEl.innerHTML = "";
  const q = query.trim().toLowerCase();
  const filtered = TOPICS.filter((t) => {
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    tilesEl.innerHTML = `<div style="grid-column:1/-1;color:#6b7280;padding:12px">No topics match your search.</div>`;
    return;
  }

  filtered.forEach((topic) => {
    const btn = document.createElement("button");
    btn.className = "tile";
    btn.innerHTML = `
      <div class="small">Topic</div>
      <div class="title">${escapeHtml(topic.title)}</div>
      <div class="sub">${escapeHtml(topic.short)}</div>
    `;
    btn.onclick = () => selectTopic(topic);
    tilesEl.appendChild(btn);
  });
}

// Show topic details in right panel
function selectTopic(topic) {
  selected = topic;
  detailCard.classList.remove("empty");
  detailCard.innerHTML = "";
  const wrapper = document.createElement("div");

  const html = `
    <div class="title-row">
      <div>
        <h3>${escapeHtml(topic.title)}</h3>
        <div class="short">${escapeHtml(topic.short)}</div>
      </div>
      <button id="closeBtn" class="btn-link" aria-label="Close">✕</button>
    </div>

    <div class="desc">${escapeHtml(topic.description)}</div>
    <div class="tools">
      <h4 style="margin-top:12px;margin-bottom:8px;font-size:13px;font-weight:600">Tools</h4>
      <div id="toolsList"></div>
    </div>
    <div class="tools">${escapeHtml(topic.tools)}</div>

    <div class="resources">
      <h4 style="margin-top:12px;margin-bottom:8px;font-size:13px;font-weight:600">Resources</h4>
      <div id="resourcesList"></div>
    </div>

    <div style="margin-top:12px;display:flex;gap:8px">
      <button id="openFirst" class="btn btn-primary">Open first resource</button>
      <button id="addPlan" class="btn btn-ghost">Add to study plan</button>
    </div>
  `;
  wrapper.innerHTML = html;
  detailCard.appendChild(wrapper);

  // resources
  const resourcesList = document.getElementById("resourcesList");
  topic.resources.forEach((r, idx) => {
    const a = document.createElement("a");
    a.className = "resource-item";
    a.href = r.url;
    a.target = "_blank";
    a.innerHTML = `<div class="label">${escapeHtml(
      r.label
    )}</div><div class="url">${escapeHtml(r.url)}</div>`;
    resourcesList.appendChild(a);
  });

  document.getElementById("closeBtn").onclick = () => {
    selected = null;
    renderEmptyDetail();
  };

  document.getElementById("openFirst").onclick = () => {
    if (topic.resources && topic.resources[0]) {
      window.open(topic.resources[0].url, "_blank");
    }
  };

  document.getElementById("addPlan").onclick = () => {
    alert("Add to study plan — feature placeholder");
  };
}

// Clear / show empty detail message
function renderEmptyDetail() {
  detailCard.classList.add("empty");
  detailCard.innerHTML = `
    <div class="empty-text">
      <div>Select any topic on the left to see details</div>
      <div class="muted">Tip: Use the search box in the header to filter topics quickly</div>
    </div>
  `;
}

// helpers
function escapeHtml(s) {
  if (!s) return "";
  return (s + "").replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// events
searchEl.addEventListener("input", (e) => {
  query = e.target.value;
  renderTiles();
});
resetBtn.addEventListener("click", () => {
  query = "";
  searchEl.value = "";
  selected = null;
  renderEmptyDetail();
  renderTiles();
});

// init
renderTiles();
renderEmptyDetail();
