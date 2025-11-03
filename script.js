const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");
const codeArea = document.getElementById("code");
const consoleBox = document.getElementById("console");

const backendURL = "https://backend-repo-j0ed.onrender.com"; // your backend URL

// === Function to append text to console ===
function appendToConsole(text) {
  consoleBox.value += text + "\n";
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

// === Run Code ===
runBtn.onclick = async () => {
  const code = codeArea.value.trim();

  // Get only user-entered text after last ">>>"
  const lines = consoleBox.value.split("\n");
  const lastInput = lines.length ? lines[lines.length - 1].trim() : "";

  appendToConsole("⏳ Running...\n");

  try {
    const res = await fetch(`${backendURL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        stdin: lastInput, // Send only latest user line as input
      }),
    });

    const data = await res.json();
    const outputText = data.output?.trim() || "(no output)";

    appendToConsole("―".repeat(40));
    appendToConsole(outputText);
    appendToConsole(">>> "); // add new prompt line

  } catch (err) {
    appendToConsole("―".repeat(40));
    appendToConsole("Error: " + err.message);
    appendToConsole(">>> ");
  }
};

// === Press Enter in console to run ===
consoleBox.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runBtn.click(); // simulate clicking run
  }
});

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

// === Initialize Console Prompt ===
consoleBox.value = ">>> ";
