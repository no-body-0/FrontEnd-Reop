const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");
const consoleBox = document.getElementById("console");
const backendURL = "https://backend-repo-j0ed.onrender.com"; // Render backend URL

// === Add blinking cursor ===
const cursor = document.createElement("span");
cursor.classList.add("cursor");
cursor.textContent = " ";
consoleBox.appendChild(cursor);

// Keep track of input buffer
let inputBuffer = "";

// === Handle keyboard input ===
document.addEventListener("keydown", (event) => {
  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
    inputBuffer += event.key;
    cursor.insertAdjacentText("beforebegin", event.key);
  } else if (event.key === "Backspace") {
    event.preventDefault();
    if (inputBuffer.length > 0) {
      inputBuffer = inputBuffer.slice(0, -1);
      if (cursor.previousSibling?.nodeType === Node.TEXT_NODE) {
        cursor.previousSibling.textContent =
          cursor.previousSibling.textContent.slice(0, -1);
      }
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    runCode(inputBuffer);
    inputBuffer = "";
  }
});

// === Run Code Function ===
async function runCode(input) {
  const code = window.editor
    ? window.editor.getValue()
    : document.getElementById("code").value;

  appendToConsole(`\n> ${input}\n`);
  appendToConsole("⏳ Running...\n");

  try {
    const res = await fetch(`${backendURL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, stdin: input }),
    });

    const data = await res.json();
    const outputText = data.output?.trim() || "(no output)";
    appendToConsole("―".repeat(40) + "\n" + outputText + "\n");
  } catch (err) {
    appendToConsole("Error: " + err.message + "\n");
  }
  scrollConsoleToBottom();
}

// === Append to console ===
function appendToConsole(text) {
  cursor.insertAdjacentText("beforebegin", text);
}

// === Scroll ===
function scrollConsoleToBottom() {
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

// === Share Code ===
shareBtn.onclick = async () => {
  const code = window.editor
    ? window.editor.getValue()
    : document.getElementById("code").value;

  try {
    const res = await fetch(`${backendURL}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (data.url) {
      await navigator.clipboard.writeText(data.url);
      alert(`✅ Link copied!\n${data.url}`);
    } else {
      alert(`⚠️ Error: ${data.error}`);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
};

// === Load Shared Code from URL ===
const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get("id");
if (codeId) {
  fetch(`${backendURL}/code/${codeId}`)
    .then((res) => res.json())
    .then((data) => {
      if (window.editor) {
        window.editor.setValue(data.code || "Error loading code.");
      } else {
        document.getElementById("code").value =
          data.code || "Error loading code.";
      }
    });
}
