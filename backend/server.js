require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { sendEmail, sendTelegram } = require("./services/notifications");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

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

app.get("/api/admin/reports", (req, res) => {
  res.json({
    success: true,
    total: 0,
    pending: 0,
    reviewed: 0,
    priority: 0,
    reports: []
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

app.post("/api/report", upload.array("evidence", 5), (req, res) => {
  const {
    name,
    email,
    phone,
    category,
    target,
    description
  } = req.body;

  if (!category || !description) {
    return res.status(400).json({
      success: false,
      message: "Category and description are required."
    });
  }

  const uploadedFiles = req.files || [];
  const now = new Date().toISOString();

  const caseRecord = {
    reportId: "FW-" + uuidv4().slice(0, 8).toUpperCase(),
    submitted: now,
    updated_at: now,

    name: name || "",
    email: email || "",
    phone: phone || "",

    category,
    target: target || "",
    description,

    status: "Pending",
    priority: "Medium",
    investigation_status: "Not Started",
    recovery_status: "Not Started",

    evidence: uploadedFiles.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size
    }))
  };

  const casesPath = path.join(__dirname, "data", "cases.json");

  let cases = [];

  try {
    if (fs.existsSync(casesPath)) {
      const raw = fs.readFileSync(casesPath, "utf8").trim();
      cases = raw ? JSON.parse(raw) : [];
    }

    if (!Array.isArray(cases)) {
      cases = [];
    }

    cases.push(caseRecord);

    fs.writeFileSync(
      casesPath,
      JSON.stringify(cases, null, 2),
      "utf8"
    );
  } catch (error) {
    console.error("Case storage error:", error);

    return res.status(500).json({
      success: false,
      message: "The report could not be saved. Please try again."
    });
  }

  console.log("📨 New FraudWatch Case");
  console.log({
    reportId: caseRecord.reportId,
    category: caseRecord.category,
    target: caseRecord.target,
    priority: caseRecord.priority,
    investigation_status: caseRecord.investigation_status,
    recovery_status: caseRecord.recovery_status,
    evidenceFiles: caseRecord.evidence.length
  });

  sendEmail(caseRecord)
    .then(() => console.log("📧 Email notification sent"))
    .catch(err => {
      console.error("📧 Email error:", err);
    });

  sendTelegram(caseRecord)
    .then(() => console.log("✈ Telegram notification sent"))
    .catch(err => console.error("✈ Telegram error:", err.message));

  res.json({
    success: true,
    message: "Report received and case created successfully.",
    reportId: caseRecord.reportId,
    status: caseRecord.status,
    priority: caseRecord.priority,
    investigationStatus: caseRecord.investigation_status,
    recoveryStatus: caseRecord.recovery_status,
    filesReceived: caseRecord.evidence.length
  });
});


// ================================
// FraudWatch Case Management API
// ================================

function loadCases() {
  const casesPath = path.join(__dirname, "data", "cases.json");

  if (!fs.existsSync(casesPath)) {
    return [];
  }

  const raw = fs.readFileSync(casesPath, "utf8").trim();
  if (!raw) return [];

  const cases = JSON.parse(raw);
  return Array.isArray(cases) ? cases : [];
}

function saveCases(cases) {
  const casesPath = path.join(__dirname, "data", "cases.json");

  fs.writeFileSync(
    casesPath,
    JSON.stringify(cases, null, 2),
    "utf8"
  );
}

// Get a case by FraudWatch case ID
app.get("/api/cases/:reportId", (req, res) => {
  try {
    const cases = loadCases();

    const caseRecord = cases.find(
      item => item.reportId.toLowerCase() === req.params.reportId.toLowerCase()
    );

    if (!caseRecord) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    res.json({
      success: true,
      case: caseRecord
    });
  } catch (error) {
    console.error("Case lookup error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve the case."
    });
  }
});

// Update investigation/recovery case status
app.patch("/api/cases/:reportId", (req, res) => {
  try {
    const cases = loadCases();

    const index = cases.findIndex(
      item => item.reportId.toLowerCase() === req.params.reportId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Critical"
    ];

    const allowedInvestigationStatuses = [
      "Not Started",
      "Under Review",
      "Evidence Review",
      "Closed"
    ];

    const allowedRecoveryStatuses = [
      "Not Started",
      "Guidance Provided",
      "Reporting in Progress",
      "Recovery Follow-up",
      "Closed"
    ];

    const currentCase = cases[index];

    if (req.body.priority !== undefined) {
      if (!allowedPriorities.includes(req.body.priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority."
        });
      }

      currentCase.priority = req.body.priority;
    }

    if (req.body.investigation_status !== undefined) {
      if (!allowedInvestigationStatuses.includes(req.body.investigation_status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid investigation status."
        });
      }

      currentCase.investigation_status =
        req.body.investigation_status;
    }

    if (req.body.recovery_status !== undefined) {
      if (!allowedRecoveryStatuses.includes(req.body.recovery_status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid recovery status."
        });
      }

      currentCase.recovery_status =
        req.body.recovery_status;
    }

    currentCase.updated_at = new Date().toISOString();

    saveCases(cases);

    res.json({
      success: true,
      message: "Case updated successfully.",
      case: currentCase
    });

  } catch (error) {
    console.error("Case update error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update the case."
    });
  }
});


// ================================
// FraudWatch Investigation Timeline & Evidence API
// ================================

// Add an investigation timeline event
app.post("/api/cases/:reportId/timeline", (req, res) => {
  try {
    const cases = loadCases();

    const index = cases.findIndex(
      item =>
        item.reportId.toLowerCase() ===
        req.params.reportId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    const title = String(req.body.title || "").trim();
    const note = String(req.body.note || "").trim();
    const type = String(req.body.type || "Investigation").trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Timeline event title is required."
      });
    }

    if (title.length > 200 || note.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Timeline event is too long."
      });
    }

    const currentCase = cases[index];

    if (!Array.isArray(currentCase.timeline)) {
      currentCase.timeline = [];
    }

    const event = {
      id: `EV-${Date.now().toString(36).toUpperCase()}`,
      created_at: new Date().toISOString(),
      type,
      title,
      note
    };

    currentCase.timeline.push(event);
    currentCase.updated_at = new Date().toISOString();

    saveCases(cases);

    res.status(201).json({
      success: true,
      message: "Timeline event added successfully.",
      event,
      case: currentCase
    });

  } catch (error) {
    console.error("Timeline event error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add timeline event."
    });
  }
});


// Add a structured investigation note
app.post("/api/cases/:reportId/evidence-note", (req, res) => {
  try {
    const cases = loadCases();

    const index = cases.findIndex(
      item =>
        item.reportId.toLowerCase() ===
        req.params.reportId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    const title = String(req.body.title || "").trim();
    const note = String(req.body.note || "").trim();
    const source = String(req.body.source || "User supplied").trim();

    if (!title || !note) {
      return res.status(400).json({
        success: false,
        message: "Evidence note title and note are required."
      });
    }

    if (title.length > 200 || note.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Evidence note is too long."
      });
    }

    const currentCase = cases[index];

    if (!Array.isArray(currentCase.evidence_notes)) {
      currentCase.evidence_notes = [];
    }

    const evidenceNote = {
      id: `NOTE-${Date.now().toString(36).toUpperCase()}`,
      created_at: new Date().toISOString(),
      title,
      note,
      source
    };

    currentCase.evidence_notes.push(evidenceNote);
    currentCase.updated_at = new Date().toISOString();

    saveCases(cases);

    res.status(201).json({
      success: true,
      message: "Evidence note added successfully.",
      evidenceNote,
      case: currentCase
    });

  } catch (error) {
    console.error("Evidence note error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add evidence note."
    });
  }
});


// Add a public-information indicator
app.post("/api/cases/:reportId/public-indicator", (req, res) => {
  try {
    const cases = loadCases();

    const index = cases.findIndex(
      item =>
        item.reportId.toLowerCase() ===
        req.params.reportId.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Case not found."
      });
    }

    const category = String(req.body.category || "").trim();
    const value = String(req.body.value || "").trim();
    const source = String(req.body.source || "").trim();
    const notes = String(req.body.notes || "").trim();

    const allowedCategories = [
      "Domain",
      "Website",
      "Email",
      "Phone",
      "Username",
      "Company",
      "Public Wallet Address",
      "Other"
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid public-information category."
      });
    }

    if (!value) {
      return res.status(400).json({
        success: false,
        message: "Indicator value is required."
      });
    }

    if (value.length > 500 || source.length > 1000 || notes.length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Public-information indicator is too long."
      });
    }

    const currentCase = cases[index];

    if (!Array.isArray(currentCase.public_indicators)) {
      currentCase.public_indicators = [];
    }

    const indicator = {
      id: `IND-${Date.now().toString(36).toUpperCase()}`,
      created_at: new Date().toISOString(),
      category,
      value,
      source,
      notes
    };

    currentCase.public_indicators.push(indicator);
    currentCase.updated_at = new Date().toISOString();

    saveCases(cases);

    res.status(201).json({
      success: true,
      message: "Public-information indicator added successfully.",
      indicator,
      case: currentCase
    });

  } catch (error) {
    console.error("Public indicator error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to add public-information indicator."
    });
  }
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
