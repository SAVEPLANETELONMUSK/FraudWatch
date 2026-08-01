document.addEventListener("DOMContentLoaded", async () => {

const totalReports = document.getElementById("totalReports");
const pendingReports = document.getElementById("pendingReports");
const reviewedReports = document.getElementById("reviewedReports");
const priorityReports = document.getElementById("priorityReports");
const reportTable = document.getElementById("reportTable");

try {

const response = await fetch("https://fraudwatch-backend-uih8.onrender.com/api/admin/reports");

const data = await response.json();

if (!data.success) return;

totalReports.textContent = data.total;
pendingReports.textContent = data.pending;
reviewedReports.textContent = data.reviewed;
priorityReports.textContent = data.priority;

reportTable.innerHTML = "";

data.reports.forEach(report => {

reportTable.innerHTML += `
<tr>
<td>${report.reportId}</td>
<td>${report.category}</td>
<td>${report.status}</td>
<td>${report.submitted}</td>
</tr>
`;

});

} catch (err) {

console.error(err);

}

});
