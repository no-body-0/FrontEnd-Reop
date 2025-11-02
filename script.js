const codeArea = document.getElementById("code");
const output = document.getElementById("output");
const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");

// your Render backend URL (replace with yours)
const backendURL = "https://backend-repo-j0ed.onrender.com";  

// --- RUN CODE ---
runBtn.addEventListener("click", async () => {
  const code = codeArea.value.trim();
  if (!code) return alert("Write some Python code first!");

  output.textContent = "Running...";
  try {
    const res = await fetch(`${backendURL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    output.textContent = data.output || data.error || "No output.";
  } catch (err) {
    output.textContent = "Error connecting to backend.";
  }
});

// --- SHARE CODE ---
shareBtn.addEventListener("click", async () => {
  const code = codeArea.value.trim();
  if (!code) return alert("Write some Python code first!");

  shareBtn.disabled = true;
  shareBtn.textContent = "Sharing...";

  try {
    const res = await fetch(`${backendURL}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await res.json();

    if (data.share_url) {
      const fullLink = data.share_url;
      navigator.clipboard.writeText(fullLink);
      alert("Link copied! Share it: " + fullLink);
    } else {
      alert("Share failed: " + (data.error || "unknown error"));
    }
  } catch (err) {
    alert("Error sharing code.");
  }

  shareBtn.disabled = false;
  shareBtn.textContent = "Share";
});

// --- LOAD CODE (when someone opens a shared link) ---
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id) {
  output.textContent = "Loading shared code...";
  fetch(`${backendURL}/load?id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.code) {
        codeArea.value = data.code;
        output.textContent = "Loaded shared code!";
      } else {
        output.textContent = "Code not found.";
      }
    })
    .catch(() => (output.textContent = "Error loading code."));
}
