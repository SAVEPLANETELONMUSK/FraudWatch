document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("verifyForm");

const input = document.getElementById("searchInput");

const result = document.getElementById("verificationResult");

if (!form || !input || !result) {

return;

}

const params = new URLSearchParams(window.location.search);

const autoSearch = params.get("search");

form.addEventListener("submit", function (e) {

e.preventDefault();

const search = input.value.trim().toLowerCase();

if (search === "") {

result.innerHTML = `

<div class="card">

<h2>⚠ Search Required</h2>

<p>

Please enter a phone number, email address, website, company name, username, or cryptocurrency wallet address.

</p>

</div>

`;

return;

}

const match = fraudWatchDatabase.find(function(item){

return item.value.toLowerCase().includes(search) ||

search.includes(item.value.toLowerCase());

});

if (match) {

result.innerHTML = `

<div class="card">

<h2>

✅ Educational Match Found

</h2>

<p>

<strong>Risk Level:</strong>

${match.risk}

</p>

<p>

<strong>Category:</strong>

${match.category}

</p>

<p>

<strong>Title:</strong>

${match.title}

</p>

<hr>

<p>

${match.guidance}

</p>

<hr>

<h3>

Recommended Next Steps

</h3>

<ul>

<li>

Verify the information through official sources.

</li>

<li>

Be cautious of requests for urgent payments.

</li>

<li>

Do not share personal or financial information unless you have independently confirmed who you are dealing with.

</li>

<li>

If you suspect fraud, stop communicating and seek guidance before taking further action.

</li>

</ul>

<p>

FraudWatch provides educational guidance only.

Always verify information independently before making financial or personal decisions.

</p>

</div>

`;

} else {

result.innerHTML = `

<div class="card">

<h2>

ℹ No Educational Record Found

</h2>

<p>

No matching educational record was found for:

</p>

<p>

<strong>${search}</strong>

</p>

<p>

This does <strong>not</strong> mean the item is safe or unsafe.

Continue to verify independently before sending money or sharing sensitive information.

</p>

<hr>

<h3>

Recommended Safety Steps

</h3>

<ul>

<li>

Verify identities independently.

</li>

<li>

Check official websites before making payments.

</li>

<li>

Be cautious of pressure tactics and urgent payment requests.

</li>

<li>

Never share passwords, banking PINs, one-time verification codes (OTPs), recovery phrases, or private keys.

</li>

</ul>

</div>

`;

}

if (autoSearch) {

input.value = autoSearch;

form.dispatchEvent(new Event("submit"));

}

});
