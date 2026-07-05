document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("reportForm");
const result = document.getElementById("reportResult");

if (!form || !result) return;

form.addEventListener("submit", function (e) {

e.preventDefault();

const category = document.getElementById("category").value;
const target = document.getElementById("target").value.trim();
const description = document.getElementById("description").value.trim();

if (category === "" || description === "") {

result.innerHTML = `
<h3>⚠ Incomplete Report</h3>
<p>Please choose a scam category and describe what happened before submitting your report.</p>
`;

return;

}

const reportId = "FW-" + Date.now();

result.innerHTML = `
<h3>✅ Report Received</h3>

<p><strong>Reference Number:</strong> ${reportId}</p>

<p><strong>Category:</strong> ${category}</p>

<p><strong>Related Information:</strong> ${target || "Not provided"}</p>

<p>

Thank you for your report.

FraudWatch has recorded this submission for educational purposes and future platform development.

Please keep your reference number if you contact us again about this report.

</p>
`;

form.reset();

});

});
