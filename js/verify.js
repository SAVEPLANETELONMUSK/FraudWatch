document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("verifyForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("verificationResult");

if (!form || !input || !results) return;

form.addEventListener("submit", function (e) {

e.preventDefault();

const search = input.value.trim();

if (search === "") {

results.innerHTML = `
<h3>Please enter something to verify.</h3>
<p>You can search a phone number, email address, website, company, username, or cryptocurrency wallet.</p>
`;

return;

}

results.innerHTML = `
<h3>Verification Complete</h3>

<p><strong>Search:</strong> ${search}</p>

<p>

FraudWatch currently provides educational guidance only.

No verified record was found for this search.

This does <strong>not</strong> mean the item is safe or unsafe.

Always verify independently before sending money or sharing personal information.

</p>

<div class="card">

<h4>Recommended Next Steps</h4>

<ul>

<li>Verify the identity independently.</li>

<li>Never send money because of pressure or urgency.</li>

<li>Check official websites before making payments.</li>

<li>If something feels suspicious, stop and investigate further.</li>

</ul>

</div>
`;

});

});
