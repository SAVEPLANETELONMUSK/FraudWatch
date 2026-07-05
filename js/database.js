const fraudWatchDatabase = [

{
id: 1,
type: "website",
value: "example-scam.com",
category: "Investment Scam",
risk: "High",
title: "Fake Investment Website",
guidance:
"Never invest money simply because a website promises guaranteed returns. Verify the company independently before sending funds."
},

{
id: 2,
type: "email",
value: "support@example-scam.com",
category: "Phishing",
risk: "High",
title: "Suspicious Email",
guidance:
"Do not click links or download attachments. Verify the sender through an official website."
},

{
id: 3,
type: "phone",
value: "+1234567890",
category: "Phone Scam",
risk: "Medium",
title: "Unknown Caller",
guidance:
"Be cautious of unexpected calls requesting money, banking information, or verification codes."
},

{
id: 4,
type: "telegram",
value: "@fakeinvestment",
category: "Impersonation",
risk: "High",
title: "Telegram Impersonation",
guidance:
"Always verify Telegram usernames through official company channels before sending money."
},

{
id: 5,
type: "wallet",
value: "0x123456789abcdef",
category: "Cryptocurrency",
risk: "Unknown",
title: "Crypto Wallet",
guidance:
"Always confirm wallet addresses through trusted sources before transferring cryptocurrency."
}

];
