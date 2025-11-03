const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");
const codeArea = document.getElementById("code");
const consoleBox = document.getElementById("console");

const backendURL = "https://backend-repo-j0ed.onrender.com"; // your Render backend URL

// === Run Code ===
runBtn.onclick = async () => {
  const code = codeArea.value.trim();
  const currentText = consoleBox.value.trimEnd();

  // Prepare a clean input line
  const newInputLine = currentText ? "\n" : "";

  // Append "Running..." below current content
  consoleBox.value = currentText + newInputLine + "⏳ Running...\n";
  consoleBox.scrollTop = consoleBox.scrollHeight;

  try {
    const res = await fetch(`${backendURL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        stdin: currentText, // send all previous console text as stdin
      }),
    });

    const data = await res.json();
    const outputText = data.output?.trim() || "(no output)";

    // Append output below the previous text
    consoleBox.value =
      currentText +
      "\n" +
      "―".repeat(40) +
      "\n" +
      outputText +
      "\n";

    // Automatically move cursor to a new line after output
    consoleBox.setSelectionRange(consoleBox.value.length, consoleBox.value.length);
    consoleBox.focus();

  } catch (err) {
    consoleBox.value =
      currentText +
      "\n" +
      "―".repeat(40) +
      "\nError: " +
      err.message;
  }

  // Always scroll to bottom for latest output
  consoleBox.scrollTop = consoleBox.scrollHeight;
};

// === Share Code ===
shareBtn.onclick = async () => {
  const code = codeArea.value;
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
    .then(res => res.json())
    .then(data => {
      codeArea.value = data.code || "Error loading code.";
    });
}
