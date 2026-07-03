document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("reportForm");
const message = document.getElementById("reportMessage");

if(!form) return;

form.addEventListener("submit",(e)=>{

e.preventDefault();

const company = document.getElementById("company").value.trim();
const type = document.getElementById("scamType").value;
const description = document.getElementById("description").value.trim();

if(company==="" || type==="" || description===""){

message.innerHTML=`
<h3>Missing Information</h3>
<p>Please complete the required fields before submitting.</p>
`;

return;

}

message.innerHTML=`
<h3>✅ Report Received</h3>

<p>Thank you for helping protect others.</p>

<p>Your report has been accepted in this demonstration version.</p>

<p>In a future release, reports will be reviewed before they become publicly searchable.</p>
`;

form.reset();

});

});
