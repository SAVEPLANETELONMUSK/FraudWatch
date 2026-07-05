document.addEventListener("DOMContentLoaded", function () {

const container = document.getElementById("alertsContainer");

if (!container) return;

container.innerHTML = "";

scamRecords.forEach(function(record){

container.innerHTML += `

<div class="card">

<h3>${record.title}</h3>

<p><strong>Category:</strong> ${record.category}</p>

<p><strong>Risk Level:</strong> ${record.risk}</p>

<p>${record.guidance}</p>

</div>

`;

});

});
