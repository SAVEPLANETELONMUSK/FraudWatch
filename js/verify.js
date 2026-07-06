document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("verifyForm");
const input = document.getElementById("searchInput");
const result = document.getElementById("verificationResult");

if (!form || !input || !result) return;

const API_URL = "https://fraudwatch-api.onrender.com/api/verify";

form.addEventListener("submit", async (e) => {

e.preventDefault();

const value = input.value.trim();

if (value === "") {

result.innerHTML = `
<div class="card">
<h2>⚠ Verification Required</h2>
<p>Please enter a phone number, email address, website, company, username, cryptocurrency wallet, or IP address.</p>
</div>
`;

return;

}

result.innerHTML = `
<div class="card">
<h2>🔎 Analysing...</h2>
<p>FraudWatch is securely analysing your submission.</p>
</div>
`;

try {

const response = await fetch(API_URL, {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
input: value
})

});

const data = await response.json();

if (!data.success) {

result.innerHTML = `
<div class="card">
<h2>❌ Verification Failed</h2>
<p>${data.message}</p>
</div>
`;

return;

}

let html = `
<div class="card">
<h2>${data.analysis.title}</h2>

<p><strong>Input:</strong> ${data.input}</p>

<p><strong>Detected Type:</strong> ${data.detectedType}</p>

<p>${data.analysis.summary}</p>

<h3>Recommendations</h3>

<ul>
`;

data.analysis.recommendations.forEach(item => {

html += `<li>${item}</li>`;

});

html += `

</ul>

<hr>

<p>

<strong>Analysis Time:</strong>

${new Date(data.timestamp).toLocaleString()}

</p>

<p>

${data.disclaimer}

</p>

</div>

`;

result.innerHTML = html;

} catch (error) {

result.innerHTML = `

<div class="card">

<h2>⚠ Connection Error</h2>

<p>

FraudWatch could not connect to the online verification service.

</p>

<p>

Please check your internet connection or try again in a few moments.

</p>

</div>

`;

}

// Auto-search when arriving from the home page

const params = new URLSearchParams(window.location.search);
const searchValue = params.get("search");

if (searchValue) {

    input.value = searchValue;

    form.dispatchEvent(new Event("submit"));

}

});
