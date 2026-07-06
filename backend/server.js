const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {

res.json({

project: "FraudWatch",

status: "Online",

version: "3.0.0",

message: "FraudWatch API is running successfully."

});

});

app.get("/api/health", (req, res) => {

res.json({

success: true,

service: "FraudWatch API",

status: "healthy",

time: new Date().toISOString()

});

});

function detectInputType(input){

const value = input.trim();

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ipRegex=/^(\d{1,3}\.){3}\d{1,3}$/;

const websiteRegex=/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}$/i;

const phoneRegex=/^[+]?[0-9()\-\s]{7,20}$/;

const usernameRegex=/^@?[A-Za-z0-9_.]{3,}$/;

if(emailRegex.test(value)) return "email";

if(ipRegex.test(value)) return "ip";

if(websiteRegex.test(value)) return "website";

if(phoneRegex.test(value)) return "phone";

if(usernameRegex.test(value) && !value.includes(" ")) return "username";

return "general";

}

app.post("/api/verify",(req,res)=>{

const input=(req.body.input||"").trim();

if(input===""){

return res.status(400).json({

success:false,

message:"Please enter something to verify."

});

}

const type=detectInputType(input);

let analysis={

type,

title:"Verification Analysis",

summary:"FraudWatch analysed your submission.",

recommendations:[]

};

switch(type){

case "email":

analysis.title="Email Address Analysis";

analysis.summary="The submitted value appears to be an email address.";

analysis.recommendations=[

"Verify the sender independently before responding.",

"Be cautious of unexpected attachments, links, and urgent requests.",

"Never share passwords, banking PINs, recovery phrases, or one-time verification codes (OTPs).",

"An email address alone cannot confirm a person's identity or physical location."

];

break;

case "website":

analysis.title="Website & Domain Analysis";

analysis.summary="The submitted value appears to be a website or domain.";

analysis.recommendations=[

"Check that the website address is spelled correctly.",

"Confirm you are visiting the official website of the organisation.",

"Look for HTTPS, but remember HTTPS alone does not prove legitimacy.",

"Be cautious of unrealistic investment returns, pressure to act quickly, or unusual payment requests."

];

break;

case "phone":

analysis.title="Phone Number Analysis";

analysis.summary="The submitted value appears to be a phone number.";

analysis.recommendations=[

"Unexpected calls requesting money or personal information should be treated with caution.",

"Never share passwords or one-time verification codes (OTPs).",

"If unsure, end the call and contact the organisation using its official published number."

];

break;

case "ip":

analysis.title="IP Address Analysis";

analysis.summary="The submitted value appears to be an IP address.";

analysis.recommendations=[

"An IP address can sometimes indicate a general network location.",

"It cannot reliably identify a specific person.",

"VPNs, mobile networks, and shared internet connections can affect apparent location.",

"Future versions of FraudWatch will provide enhanced IP analysis."

];

break;

case "username":

analysis.title="Username Analysis";

analysis.summary="The submitted value appears to be a username or online account.";

analysis.recommendations=[

"Look for impersonation warning signs.",

"Verify the account through the organisation's official website.",

"Never send money without independently confirming who you are communicating with."

];

break;

default:

analysis.title="General Verification";

analysis.summary="FraudWatch could not confidently determine the type of information submitted.";

analysis.recommendations=[

"Verify information using trusted and independent sources.",

"Be cautious of urgent requests involving money or sensitive information.",

"If something feels suspicious, pause and verify before taking action."

];

}

res.json({

success: true,

input,

detectedType: analysis.type,

confidence: "Educational Analysis",

analysis: {

title: analysis.title,

summary: analysis.summary,

recommendations: analysis.recommendations

},

timestamp: new Date().toISOString(),

disclaimer:

"FraudWatch provides educational guidance only. Always verify information independently before making financial, legal, or personal decisions."

});

});

app.use((req, res) => {

res.status(404).json({

success: false,

message: "Endpoint not found."

});

});

app.listen(PORT, () => {

console.log(`🛡 FraudWatch API running on port ${PORT}`);

});
