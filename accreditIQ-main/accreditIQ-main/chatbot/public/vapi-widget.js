(async function initVapiWidget() {
  const WIDGET_VERSION = "6";
  console.log(`Vapi Widget v${WIDGET_VERSION}: Initialization started`);

  // 1. Synchronous UI Creation (Ensures button is always visible)
  const widgetContainer = document.createElement("div");
  widgetContainer.id = "vapi-widget-container";
  Object.assign(widgetContainer.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: "2147483647",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
  });

  const label = document.createElement("div");
  label.innerText = "Initializing Mock Authority...";
  Object.assign(label.style, {
    background: "#1F2937",
    color: "white",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    opacity: "0",
    transition: "opacity 0.2s ease-in-out",
    pointerEvents: "none",
    whiteSpace: "nowrap"
  });
  widgetContainer.appendChild(label);

  const button = document.createElement("button");
  button.id = "vapi-mock-audit-btn";
  Object.assign(button.style, {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #3B82F6)",
    color: "white",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "wait",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
  });

  button.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  `;

  button.addEventListener("mouseenter", () => {
    button.style.transform = "scale(1.08)";
    label.style.opacity = "1";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "scale(1)";
    label.style.opacity = "0";
  });

  widgetContainer.appendChild(button);
  
  const mount = () => {
    if (document.body) document.body.appendChild(widgetContainer);
    else setTimeout(mount, 50);
  };
  mount();

  // 2. Pulse Animation Setup
  const injectStyles = () => {
    if (document.getElementById("vapi-widget-styles")) return;
    const style = document.createElement("style");
    style.id = "vapi-widget-styles";
    style.innerHTML = `
      @keyframes vapiPulse {
        0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.6); }
        70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); }
        100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
      }
      @keyframes vapiPulseActive {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      #vapi-mock-audit-btn:active { transform: scale(0.92) !important; }
    `;
    document.head.appendChild(style);
  };
  injectStyles();

  // 3. SDK Loading Logic
  const VAPI_PUBLIC_KEY = "7e47046c-0277-493e-bdb2-246f9203fbbf";
  const ASSISTANT_ID = "92afbe2a-2a68-4540-902a-47955e298229";
  let vapi = null;

  async function loadVapi() {
    const loaderUrls = [
      "https://esm.sh/@vapi-ai/web?bundle",
      "https://cdn.jsdelivr.net/npm/@vapi-ai/web@latest/+esm",
      "./vapi.js" // local fallback
    ];

    for (const url of loaderUrls) {
      try {
        console.log(`Vapi Widget: Attempting to load from ${url}`);
        const module = await import(url);
        const Constructor = module.default || module;
        if (typeof Constructor === 'function') {
          vapi = new Constructor(VAPI_PUBLIC_KEY);
          return true;
        }
      } catch (e) {
        console.warn(`Vapi Widget: Failed to load from ${url}`, e);
      }
    }
    return false;
  }

  const success = await loadVapi();

  if (!success) {
    label.innerText = "Mock Authority: Load Error";
    label.style.opacity = "1";
    button.style.background = "#9CA3AF";
    button.style.cursor = "not-allowed";
    return;
  }

  // 4. Interaction Logic
  let isCallActive = false;
  button.style.cursor = "pointer";
  label.innerText = "Mock Authority Live Audit";

  vapi.on("call-start", () => {
    isCallActive = true;
    button.style.background = "linear-gradient(135deg, #EF4444, #DC2626)";
    button.style.animation = "vapiPulseActive 2s infinite";
    button.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
      </svg>
    `;
  });

  vapi.on("call-end", () => {
    isCallActive = false;
    button.style.background = "linear-gradient(135deg, #4F46E5, #3B82F6)";
    button.style.animation = "none";
    button.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
      </svg>
    `;
  });

  vapi.on("error", (e) => {
    console.error("Vapi Widget Error Event:", e);
    label.innerText = "Network Error: " + (e.message || "Failed");
    label.style.opacity = "1";
    setTimeout(() => { if(!isCallActive) label.style.opacity = "0" }, 5000);
  });

  button.onclick = async () => {
    if (isCallActive) {
      vapi.stop();
    } else {
      try {
        label.innerText = "Connecting...";
        label.style.opacity = "1";
        await vapi.start(ASSISTANT_ID);
        label.innerText = "Mock Authority Live Audit";
      } catch (err) {
        console.error("Vapi Start Error:", err);
        label.innerText = "Permission Denied / Mic Error";
      }
    }
  };

})();
