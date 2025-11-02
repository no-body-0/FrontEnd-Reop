const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");
const codeArea = document.getElementById("code");
const output = document.getElementById("output");

const backendURL = "https://backend-repo-j0ed.onrender.com"; // your Render backend URL

runBtn.onclick = async () => {
  const res = await fetch(`${backendURL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: codeArea.value }),
  });
  const data = await res.json();
  output.textContent = data.output;
};

shareBtn.onclick = async () => {
  const res = await fetch(`${backendURL}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: codeArea.value }),
  });
  const data = await res.json();
  if (data.url) {
    navigator.clipboard.writeText(data.url);
    alert(`✅ Link copied!\n${data.url}`);
  } else {
    alert(`⚠️ Error: ${data.error}`);
  }
};

// Load code from URL
const urlParams = new URLSearchParams(window.location.search);
const codeId = urlParams.get("id");
if (codeId) {
  fetch(`${backendURL}/code/${codeId}`)
    .then(res => res.json())
    .then(data => {
      codeArea.value = data.code || "Error loading code.";
    });
}
