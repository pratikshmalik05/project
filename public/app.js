const lengthSlider = document.getElementById("lengthSlider");
const lengthDisplay = document.getElementById("lengthDisplay");
const styleSelect = document.getElementById("styleSelect");
const categorySelect = document.getElementById("categorySelect");
const seedInput = document.getElementById("seedInput");
const countSelect = document.getElementById("countSelect");
const numbersToggle = document.getElementById("numbersToggle");
const generateBtn = document.getElementById("generateBtn");
const resultsGrid = document.getElementById("resultsGrid");
const resultsCount = document.getElementById("resultsCount");
const toast = document.getElementById("toast");

function updateLengthLabel() {
  const len = lengthSlider.value;
  lengthDisplay.textContent = `${len} character${len === "1" ? "" : "s"}`;
}

lengthSlider.addEventListener("input", updateLengthLabel);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

async function fetchUsernames() {
  const length = lengthSlider.value;
  const style = styleSelect.value;
  const category = categorySelect.value;
  const seed = seedInput.value.trim();
  const count = countSelect.value;
  const includeNumbers = numbersToggle.checked;

  const params = new URLSearchParams({
    length,
    style,
    category,
    seed,
    count,
    includeNumbers
  });

  try {
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span>⏳</span> Generating...`;

    const res = await fetch(`/api/generate?${params.toString()}`);
    const data = await res.json();

    renderUsernames(data.usernames || []);
  } catch (err) {
    console.error("Failed to generate:", err);
    showToast("Error generating usernames");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = `<span class="btn-icon">⚡</span> Generate Usernames`;
  }
}

function renderUsernames(usernames) {
  resultsGrid.innerHTML = "";
  resultsCount.textContent = `${usernames.length} ready`;

  if (!usernames.length) {
    resultsGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); text-align: center;">No usernames generated. Try different settings.</p>`;
    return;
  }

  usernames.forEach(name => {
    const card = document.createElement("div");
    card.className = "username-card";
    card.innerHTML = `
      <span class="username-text">${escapeHtml(name)}</span>
      <div class="card-meta">
        <span class="len-tag">${name.length}</span>
        <span class="copy-icon" title="Click to copy">📋</span>
      </div>
    `;

    card.addEventListener("click", () => {
      navigator.clipboard.writeText(name).then(() => {
        showToast(`Copied "${name}" to clipboard!`);
      }).catch(() => {
        showToast("Copied!");
      });
    });

    resultsGrid.appendChild(card);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

generateBtn.addEventListener("click", fetchUsernames);

// Generate initial batch on load
window.addEventListener("DOMContentLoaded", () => {
  updateLengthLabel();
  fetchUsernames();
});
