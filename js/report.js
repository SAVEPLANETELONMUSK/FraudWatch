document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("reportForm");
const result = document.getElementById("reportResult");

if (!form || !result) return;

form.addEventListener("submit", function (e) {

e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();

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

result.innerHTML = "<p>Submitting report...</p>";

fetch("/api/report", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    phone,
    category,
    target,
    description
  })
})
.then(response => response.json())
.then(data => {

  if (!data.success) {
    result.innerHTML = `
      <h3>❌ Submission Failed</h3>
      <p>${data.message}</p>
    `;
    return;
  }

  result.innerHTML = `
    <h3>✅ Report Received</h3>

    <p><strong>Reference Number:</strong> ${data.reportId}</p>

    <p>Your report has been received successfully.</p>

    <p>Thank you for helping protect others from fraud.</p>
  `;

  form.reset();

})
.catch(error => {

  console.error(error);

  result.innerHTML = `
    <h3>⚠ Connection Error</h3>

    <p>FraudWatch could not contact the reporting server.</p>
  `;

});

});

});
