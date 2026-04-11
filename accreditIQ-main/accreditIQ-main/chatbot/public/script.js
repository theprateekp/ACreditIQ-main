// ============================================
// AccreditIQ Chatbot — Frontend Logic
// With File Upload Support
// ============================================

const chatContainer = document.getElementById("chatContainer");
const welcomeScreen = document.getElementById("welcomeScreen");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const statusDot = document.getElementById("statusDot");
const attachBtn = document.getElementById("attachBtn");
const fileInput = document.getElementById("fileInput");
const filePreviewBar = document.getElementById("filePreviewBar");

let chatHistory = [];
let isStreaming = false;
let attachedFiles = []; // { name, type, content }

// ── Auto-resize Textarea ──────────────────────────────────────
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + "px";
  updateSendButton();
});

function updateSendButton() {
  sendBtn.disabled = !(messageInput.value.trim() || attachedFiles.length > 0);
}

// ── Send on Enter (Shift+Enter for newline) ───────────────────
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if ((messageInput.value.trim() || attachedFiles.length > 0) && !isStreaming) {
      sendMessage();
    }
  }
});

// ── Send Button Click ─────────────────────────────────────────
sendBtn.addEventListener("click", () => {
  if ((messageInput.value.trim() || attachedFiles.length > 0) && !isStreaming) {
    sendMessage();
  }
});

// ── Clear Chat ────────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
  chatHistory = [];
  attachedFiles = [];
  renderFilePreview();
  chatContainer.innerHTML = "";
  chatContainer.appendChild(welcomeScreen);
  welcomeScreen.style.display = "flex";
  messageInput.focus();
});

// ── Quick Prompts ─────────────────────────────────────────────
document.querySelectorAll(".quick-prompt").forEach((btn) => {
  btn.addEventListener("click", () => {
    messageInput.value = btn.dataset.prompt;
    messageInput.dispatchEvent(new Event("input"));
    sendMessage();
  });
});

// ── File Attach ───────────────────────────────────────────────
attachBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files);
  if (files.length === 0) return;

  // Show uploading state
  statusDot.className = "status-dot thinking";

  try {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }

    const data = await res.json();
    if (data.success) {
      attachedFiles.push(...data.files);
      renderFilePreview();
      
      // Success Animation
      statusDot.className = "status-dot success";
      setTimeout(() => {
        statusDot.className = "status-dot";
      }, 1500);
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("File upload failed: " + err.message);
    statusDot.className = "status-dot";
  } finally {
    fileInput.value = "";
    updateSendButton();
  }
});

// ── Render File Preview Bar ───────────────────────────────────
function renderFilePreview() {
  if (attachedFiles.length === 0) {
    filePreviewBar.innerHTML = "";
    filePreviewBar.style.display = "none";
    return;
  }

  filePreviewBar.style.display = "flex";
  filePreviewBar.innerHTML = attachedFiles
    .map(
      (f, i) => `
    <div class="file-chip">
      <span class="file-chip-icon">${getFileIcon(f.type)}</span>
      <span class="file-chip-name">${truncate(f.name, 25)}</span>
      <span class="file-chip-size">${formatSize(f.size)}</span>
      <button class="file-chip-remove" data-index="${i}" title="Remove">✕</button>
    </div>
  `
    )
    .join("");

  // Attach remove handlers
  filePreviewBar.querySelectorAll(".file-chip-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      attachedFiles.splice(parseInt(btn.dataset.index), 1);
      renderFilePreview();
      updateSendButton();
    });
  });
}

function getFileIcon(type) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) return "📊";
  if (type.includes("json")) return "🔧";
  return "📎";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function truncate(str, max) {
  return str.length > max ? str.substring(0, max - 3) + "..." : str;
}

// ── Send Message ──────────────────────────────────────────────
async function sendMessage() {
  const message = messageInput.value.trim();
  const filesToSend = [...attachedFiles];

  if (!message && filesToSend.length === 0) return;
  if (isStreaming) return;

  // Hide welcome screen
  welcomeScreen.style.display = "none";

  // Build display text
  let displayText = message;
  if (filesToSend.length > 0) {
    const fileNames = filesToSend.map((f) => `📎 ${f.name}`).join("\n");
    displayText = filesToSend.length > 0 && message
      ? `${fileNames}\n\n${message}`
      : filesToSend.length > 0
        ? fileNames
        : message;
  }

  // Add user message to UI
  appendMessage("user", displayText);
  chatHistory.push({ role: "user", content: message || "Analyze the uploaded file(s)." });

  // Clear input and files
  messageInput.value = "";
  messageInput.style.height = "auto";
  sendBtn.disabled = true;
  attachedFiles = [];
  renderFilePreview();

  // Show typing indicator
  const assistantEl = appendMessage("assistant", "", true);
  const bodyEl = assistantEl.querySelector(".message-body");

  // Set streaming state
  isStreaming = true;
  statusDot.className = "status-dot thinking";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message || "Analyze the uploaded file(s).",
        history: chatHistory,
        fileContents: filesToSend,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let buffer = "";

    // Remove typing indicator
    const typingEl = bodyEl.querySelector(".typing-indicator");
    if (typingEl) typingEl.remove();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              fullResponse += data.text;
              bodyEl.innerHTML = renderMarkdown(fullResponse);
              scrollToBottom();
            } else if (data.sources) {
              const sourcesHtml = data.sources.map(s => `<span style="display:inline-block; font-size:11px; font-weight:500; background:#E0E7FF; color:#4F46E5; padding:2px 8px; border-radius:12px; margin:4px 4px 0 0; line-height:1.4;">📄 ${s.replace('.md', '').replace('.pdf', '')}</span>`).join("");
              bodyEl.innerHTML += `<div style="margin-top: 12px; border-top: 1px solid #e5e7eb; padding-top: 8px;"><div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Grounding Sources</div>${sourcesHtml}</div>`;
              scrollToBottom();
            } else if (data.error) {
              bodyEl.innerHTML = `<p style="color: #ef4444;">⚠️ ${data.error}</p>`;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }

    // Save to history
    if (fullResponse) {
      chatHistory.push({ role: "assistant", content: fullResponse });
    }
  } catch (err) {
    console.error("Chat error:", err);
    const typingEl = bodyEl.querySelector(".typing-indicator");
    if (typingEl) typingEl.remove();
    bodyEl.innerHTML = `<p style="color: #ef4444;">⚠️ Failed to connect to server. Make sure the server is running at <strong>http://localhost:3000</strong>.</p>`;
  } finally {
    isStreaming = false;
    statusDot.className = "status-dot";
    scrollToBottom();
  }
}

// ── Append Message to Chat ────────────────────────────────────
function appendMessage(role, content, showTyping = false) {
  const div = document.createElement("div");
  div.className = `message ${role}`;

  const senderName = role === "user" ? "You" : "AccreditIQ";

  div.innerHTML = `
    <div class="message-avatar">${role === "user" ? "Y" : "✦"}</div>
    <div class="message-content">
      <div class="message-sender">${senderName}</div>
      <div class="message-body">
        ${showTyping
          ? `<div class="typing-indicator"><span></span><span></span><span></span></div>`
          : renderMarkdown(content)
        }
      </div>
    </div>
  `;

  chatContainer.appendChild(div);
  scrollToBottom();
  return div;
}

// ── Simple Markdown Renderer ──────────────────────────────────
function renderMarkdown(text) {
  if (!text) return "";
  
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    const lines = cleanText.split('\\n');
    if (lines.length > 0 && lines[0].startsWith('```')) {
      lines.shift();
      if (lines.length > 0 && lines[lines.length - 1] === '```') {
        lines.pop();
      }
      cleanText = lines.join('\\n');
    }
  }
  
  if (typeof marked !== "undefined") {
    return marked.parse(cleanText);
  }

  // Fallback (should not be reached if marked loaded)
  return "<p>" + cleanText.replace(/\\n/g, "<br>") + "</p>";
}

// ── Scroll to Bottom ──────────────────────────────────────────
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ── Focus Input on Load ───────────────────────────────────────
messageInput.focus();
