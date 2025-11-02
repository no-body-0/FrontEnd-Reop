const runBtn = document.getElementById("run");
const shareBtn = document.getElementById("share");
const output = document.getElementById("output");

runBtn.onclick = async () => {
  const code = document.getElementById("code").value;
  output.textContent = "Running...";
  const res = await fetch("https://backend-repo-j0ed.onrender.com/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  output.textContent = data.output || data.error || "No output";
};

shareBtn.onclick = async () => {
  const code = document.getElementById("code").value;
  const encoded = encodeURIComponent(code);
  const link = `${window.location.origin}?code=${encoded}`;
  navigator.clipboard.writeText(link);
  alert("Share link copied!");
};

// Load shared code
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const sharedCode = params.get("code");
  if (sharedCode) document.getElementById("code").value = decodeURIComponent(sharedCode);
};
