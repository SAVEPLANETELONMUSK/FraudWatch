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

<p>Please enter something to verify.</p>

</div>

`;

return;

}

result.innerHTML = `

<div class="card">

<h2>🔎 Analysing...</h2>

<p>Please wait while FraudWatch contacts the verification service.</p>

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

<p>

<strong>Input:</strong>

${data.input}

</p>

<p>

${data.analysis.summary}

</p>

<h3>

Recommendations

</h3>

<ul>

`;

data.analysis.recommendations.forEach(item => {

html += `<li>${item}</li>`;

});

html += `

</ul>

<hr>

<p>

FraudWatch provides educational guidance to help you make safer decisions.

Always verify important information independently before sending money or sharing personal information.

</p>

</div>

`;

result.innerHTML = html;

} catch (error) {

result.innerHTML = `

<div class="card">

<h2>

⚠ Connection Error

</h2>

<p>

FraudWatch could not connect to the online verification service.

Please check your internet connection and try again.

</p>

</div>

`;

}

});

});
