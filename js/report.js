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
    const evidence = document.getElementById("evidence");

    if (category === "" || description === "") {

      result.innerHTML = `
        <h3>⚠ Incomplete Report</h3>
        <p>Please choose a scam category and describe what happened before submitting your report.</p>
      `;

      return;
    }

    result.innerHTML = "<p>Submitting report...</p>";

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("category", category);
    formData.append("target", target);
    formData.append("description", description);

    if (evidence && evidence.files.length > 0) {
      for (const file of evidence.files) {
        formData.append("evidence", file);
      }
    }

    fetch("https://fraudwatch-backend-uih8.onrender.com/api/report", {
      method: "POST",
      body: formData
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
