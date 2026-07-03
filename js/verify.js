document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("verifyForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

if(!form || !input || !results) return;

form.addEventListener("submit", function(e){

e.preventDefault();

const value = input.value.trim().toLowerCase();

if(value===""){

results.innerHTML=`
<h3>Verification Results</h3>
<p>Please enter something to verify.</p>
`;

return;

}

let match = null;

for(const item of scamDatabase){

if(value.includes(item.keyword)){

match=item;
break;

}

}

if(match){

results.innerHTML=`

<h3>⚠ Potential Match Found</h3>

<p><strong>Name:</strong> ${match.title}</p>

<p><strong>Category:</strong> ${match.type}</p>

<p><strong>Risk Level:</strong>
<span class="risk-high">${match.risk}</span></p>

<p>${match.message}</p>

<hr>

<p>

<strong>Important:</strong>

This result is based on the current FraudWatch demonstration database and should not be treated as definitive proof. Continue your own independent verification before making financial or personal decisions.

</p>

`;

}else{

results.innerHTML=`

<h3>✅ No Match Found</h3>

<p>

No matching record was found in the current FraudWatch demonstration database.

</p>

<p>

This does <strong>not</strong> mean the person, business or website is trustworthy.

Always verify identities independently before sending money or sharing sensitive information.

</p>

`;

}

});

});
