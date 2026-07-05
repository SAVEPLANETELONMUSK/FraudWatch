document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("verifyForm");

const input = document.getElementById("searchInput");

const result = document.getElementById("verificationResult");

if (!form || !input || !result) {

return;

}

function detectType(value){

const text = value.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

const websiteRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}$/i;

const phoneRegex = /^[+]?[0-9()\-\s]{7,20}$/;

const usernameRegex = /^@?[A-Za-z0-9_.]{3,}$/;

if(emailRegex.test(text)) return "email";

if(ipRegex.test(text)) return "ip";

if(websiteRegex.test(text)) return "website";

if(phoneRegex.test(text)) return "phone";

if(usernameRegex.test(text) && !text.includes(" ")) return "username";

return "general";

}

form.addEventListener("submit", function(e){

e.preventDefault();

const value = input.value.trim();

if(value===""){

result.innerHTML=`

<div class="card">

<h2>⚠ Verification Required</h2>

<p>

Please enter an email address, website, phone number, IP address, username or company name.

</p>

</div>

`;

return;

}

const type = detectType(value);

switch(type){

case "email":

result.innerHTML=`

<div class="card">

<h2>📧 Email Analysis</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch has identified this as an email address.

</p>

<ul>

<li>Check that the domain is spelled correctly.</li>

<li>Be cautious of unexpected attachments and links.</li>

<li>Verify requests for money or sensitive information independently.</li>

<li>An email address alone cannot reliably reveal the sender's identity or location.</li>

</ul>

</div>

`;

break;

case "website":

result.innerHTML=`

<div class="card">

<h2>🌐 Website & Domain Analysis</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch has identified this as a website or domain.

</p>

<ul>

<li>Verify that the website address is spelled correctly.</li>

<li>Check whether the site uses HTTPS (a padlock in your browser). HTTPS alone does not guarantee legitimacy.</li>

<li>Look for genuine contact details, company information, and transparent policies.</li>

<li>Be cautious of unrealistic investment returns, heavy pressure to act immediately, or requests for unusual payment methods.</li>

</ul>

</div>

`;

break;

case "phone":

result.innerHTML=`

<div class="card">

<h2>📞 Phone Number Analysis</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch has identified this as a phone number.

</p>

<ul>

<li>Unexpected calls asking for money or verification codes should be treated with caution.</li>

<li>A country code may indicate where a number is registered, but it does not confirm who is calling.</li>

<li>Never share banking PINs, passwords, or one-time verification codes (OTPs) over the phone.</li>

<li>If in doubt, end the call and contact the organisation using its official contact details.</li>

</ul>

</div>

`;

break;

case "ip":

result.innerHTML=`

<div class="card">

<h2>🌍 IP Address Analysis</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch has identified this as an IP address.

</p>

<ul>

<li>An IP address can sometimes be associated with a general geographic region through lookup services.</li>

<li>An IP address does not reliably identify a specific person.</li>

<li>VPNs, mobile networks, and other technologies can affect apparent location.</li>

<li>Future versions of FraudWatch will support enhanced IP analysis using trusted services.</li>

</ul>

</div>

`;

break;

case "username":

result.innerHTML=`

<div class="card">

<h2>💬 Username Analysis</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch has identified this as a username or online account.

</p>

<ul>

<li>Scammers often impersonate well-known people, companies, and support teams.</li>

<li>Check whether the account is linked from an official website.</li>

<li>Be cautious if the account asks for money, cryptocurrency, gift cards, or personal information.</li>

<li>Look for inconsistent usernames, recently created accounts, or suspicious behaviour.</li>

</ul>

</div>

`;

break;

default:

result.innerHTML=`

<div class="card">

<h2>🔎 General Verification Guidance</h2>

<p><strong>Input:</strong> ${value}</p>

<p>

FraudWatch could not confidently identify the type of information entered.

</p>

<ul>

<li>If this is a company name, verify it using official registration records and its official website.</li>

<li>If this is a person's name, verify their identity through trusted, independent sources.</li>

<li>Never rely on a single source before making financial or personal decisions.</li>

<li>If you feel pressured to act immediately, pause and verify before continuing.</li>

</ul>

</div>

`;

break;

}

result.innerHTML += `

<div class="card">

<h2>✅ Recommended Next Steps</h2>

<ul>

<li>Verify information using trusted, independent sources.</li>

<li>Be cautious of urgent payment requests or secrecy.</li>

<li>Do not share passwords, banking PINs, one-time verification codes (OTPs), recovery phrases, or private keys.</li>

<li>If you suspect fraud, preserve messages, screenshots, and other evidence.</li>

<li>If a crime may have occurred, consider reporting it to the appropriate official authority in your country.</li>

</ul>

<p>

FraudWatch provides educational guidance to support informed decision-making. The analysis above should not be treated as proof that a person, website, email address, phone number, company, or account is legitimate or fraudulent.

</p>

</div>

`;

});

});
