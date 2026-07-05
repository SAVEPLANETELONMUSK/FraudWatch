document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("verifyForm");
const input = document.getElementById("searchInput");
const result = document.getElementById("verificationResult");

if (!form || !input || !result) return;

form.addEventListener("submit", function (e) {

e.preventDefault();

const search = input.value.trim().toLowerCase();

if (search === "") {

result.innerHTML = `
<h3>⚠ Search Required</h3>
<p>Please enter a phone number, website, email address, username, company or wallet address.</p>
`;

return;

}

const match = fraudWatchDatabase.find(item =>
item.value.toLowerCase().includes(search) ||
search.includes(item.value.toLowerCase())
);

if (match) {

result.innerHTML = `
<h2>Verification Result</h2>

<p><strong>Risk Level:</strong> ${match.risk}</p>

<p><strong>Category:</strong> ${match.category}</p>

<p><strong>Title:</strong> ${match.title}</p>

<p>${match.guidance}</p>

<p>

FraudWatch provides educational guidance only. Always verify information independently before making financial or personal decisions.

</p>
`;

} else {

result.innerHTML = `
<h2>No Record Found</h2>

<p>

No educational record currently exists for:

<strong>${search}</strong>

</p>

<p>

This does not mean the item is safe or unsafe.

Continue to verify independently before sending money or sharing personal information.

</p>

`;

}

});

});
