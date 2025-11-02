const backend = "https://backend-repo-j0ed.onrender.com"; // replace with your backend URL

// Initialize CodeMirror
const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "python",
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
  indentUnit: 4,
  matchBrackets: true,
  lineWrapping: true,
});

// Run button
document.getElementById("run").addEventListener("click", async () => {
  const code = editor.getValue();
  document.getElementById("output").textContent = "Running...";
  const res = await fetch(`${backend}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  document.getElementById("output").textContent = data.output;
  if (data.share_url) {
    document.getElementById("share").setAttribute("data-url", data.share_url);
    document.getElementById("share").disabled = false;
  }
});

// Share button
document.getElementById("share").addEventListener("click", () => {
  const url = document.getElementById("share").getAttribute("data-url");
  if (url) {
    navigator.clipboard.writeText(url);
    alert("✅ Link copied: " + url);
  } else {
    alert("Please run the code first!");
  }
});

// Load code from URL (if shared link)
const params = new URLSearchParams(window.location.search);
const codeId = params.get("id");
if (codeId) {
  fetch(`${backend}/code/${codeId}`)
    .then(res => res.json())
    .then(data => {
      if (data.code) editor.setValue(data.code);
      else editor.setValue("# Code not found 😢");
    });
}
