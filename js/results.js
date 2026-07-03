document.addEventListener("DOMContentLoaded", () => {

const box = document.getElementById("resultsBox");

box.innerHTML = `
<h3>No Matching Scam Found</h3>

<p>

Your search did not match any record in the current demonstration database.

</p>

<p>

This does not mean the person or business is trustworthy.

Always perform additional checks before sending money or sharing personal information.

</p>
`;

});
