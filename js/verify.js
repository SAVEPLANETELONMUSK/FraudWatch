document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("verifyForm");

const input = document.getElementById("searchInput");

const result = document.getElementById("verificationResult");

if (!form || !input || !result) {

return;

}

form.addEventListener("submit", function (e) {

e.preventDefault();

const search = input.value.trim().toLowerCase();

if (search === "") {

result.innerHTML = `

<div class="card">

<h2>⚠ Search Required</h2>

<p>

Please enter a phone number, email address, website, company, username or cryptocurrency wallet.

</p>

</div>

`;

return;

}

const match = fraudWatchDatabase.find(item =>

item.value.toLowerCase().includes(search) ||

search.includes(item.value.toLowerCase())

);

if (match) {

result.innerHTML = `

<div class="card">

<h2>✅ Educational Match Found</h2>

<p><strong>Risk Level:</strong> ${match.risk}</p>

<p><strong>Category:</strong> ${match.category}</p>

<p><strong>Record:</strong> ${match.title}</p>

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

Verify the information using official sources.

</li>

<li>

Do not send money because of pressure or urgency.

</li>

<li>

Be cautious before sharing personal or financial information.

</li>

<li>

If something feels suspicious, pause and investigate further.

</li>

</ul>

<p>

<strong>Important:</strong>

FraudWatch provides educational guidance only.

Search results are not proof that a person, company, website, or organisation is legitimate or fraudulent.

Always verify independently before making important decisions.

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

This does not mean the item is safe or unsafe.

Continue to verify independently before making payments or sharing sensitive information.

</p>

<hr>

<h3>

Recommended Safety Steps

</h3>

<ul>

<li>

Check official websites and contact details independently.

</li>

<li>

Be cautious of requests for urgent payments or secrecy.

</li>

<li>

Never share passwords, banking PINs, one-time verification codes (OTPs), recovery phrases, or private keys.

</li>

<li>

If you believe you've encountered a scam, stop communicating and seek guidance before taking further action.

</li>

</ul>

</div>

`;

}

});

});
