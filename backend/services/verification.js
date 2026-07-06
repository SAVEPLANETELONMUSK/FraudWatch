function detectInputType(input) {

const value = input.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

const websiteRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}$/i;

const phoneRegex = /^[+]?[0-9()\-\s]{7,20}$/;

const usernameRegex = /^@?[A-Za-z0-9_.]{3,}$/;

if (emailRegex.test(value)) return "email";

if (ipRegex.test(value)) return "ip";

if (websiteRegex.test(value)) return "website";

if (phoneRegex.test(value)) return "phone";

if (usernameRegex.test(value) && !value.includes(" "))
return "username";

return "general";

}

function analyseInput(input) {

const type = detectInputType(input);

let analysis = {

type,

title: "Verification Analysis",

summary: "",

recommendations: []

};

switch (type) {

case "email":

analysis.title = "Email Address Analysis";

analysis.summary = "The submitted value appears to be an email address.";

analysis.recommendations = [

"Verify the sender independently before responding.",

"Be cautious of unexpected attachments, links, or urgent requests.",

"Never share passwords, banking PINs, one-time verification codes (OTPs), recovery phrases, or private keys.",

"An email address alone cannot confirm a person's identity or physical location."

];

break;

case "website":

analysis.title = "Website & Domain Analysis";

analysis.summary = "The submitted value appears to be a website or domain.";

analysis.recommendations = [

"Confirm you are visiting the organisation's official website.",

"Check the spelling of the domain carefully.",

"Look for HTTPS, but remember HTTPS alone does not prove legitimacy.",

"Be cautious of unrealistic offers, urgent payment requests, or unusual payment methods."

];

break;

case "phone":

analysis.title = "Phone Number Analysis";

analysis.summary = "The submitted value appears to be a phone number.";

analysis.recommendations = [

"Treat unexpected calls requesting money or sensitive information with caution.",

"Never disclose passwords, banking PINs, or one-time verification codes (OTPs).",

"If you are unsure, end the call and contact the organisation using its official published number."

];

break;

case "ip":

analysis.title = "IP Address Analysis";

analysis.summary = "The submitted value appears to be an IP address.";

analysis.recommendations = [

"An IP address may indicate a general network location but does not identify a specific person.",

"VPNs, mobile networks, and shared internet connections can affect apparent location.",

"Use IP information as one piece of evidence rather than proof of identity."

];

break;

case "username":

analysis.title = "Username Analysis";

analysis.summary = "The submitted value appears to be a username or online account.";

analysis.recommendations = [

"Look for signs of impersonation or recently created accounts.",

"Verify the account through the official website or verified profile.",

"Never send money without independently confirming who you are communicating with."

];

break;

default:

analysis.title = "General Verification";

analysis.summary = "FraudWatch could not confidently determine the type of information submitted.";

analysis.recommendations = [

"Verify information through trusted and independent sources.",

"Be cautious of urgent requests involving money or sensitive information.",

"If something feels suspicious, pause before taking action."

];

break;

}

return analysis;

}

module.exports = {

detectInputType,

analyseInput

};
