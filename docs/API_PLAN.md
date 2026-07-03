# FraudWatch API Plan

## Verification

POST /verify

Input:
- Phone number
- Email
- Website
- Company
- Username

Output:
- Detected type
- Risk level
- Matching records
- Guidance

---

## Reports

POST /reports

Create a new fraud report.

GET /reports

Moderator access.

---

## Knowledge

GET /articles

Return education articles.

GET /alerts

Return current scam alerts.

---

## Users (Future)

POST /login

POST /register

GET /dashboard

Saved searches

Saved reports
