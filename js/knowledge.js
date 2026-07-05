document.addEventListener("DOMContentLoaded", function () {

const search = document.getElementById("knowledgeSearch");
const results = document.getElementById("knowledgeResults");

if (!search || !results) return;

function displayResults(query = "") {

results.innerHTML = "";

const filtered = knowledgeBase.filter(item =>
item.title.toLowerCase().includes(query.toLowerCase()) ||
item.category.toLowerCase().includes(query.toLowerCase()) ||
item.content.toLowerCase().includes(query.toLowerCase())
);

if (filtered.length === 0) {

results.innerHTML = "<p>No matching educational articles found.</p>";

return;

}

filtered.forEach(item => {

results.innerHTML += `
<div class="card">
<h3>${item.title}</h3>
<p><strong>Category:</strong> ${item.category}</p>
<p>${item.content}</p>
</div>
`;

});

}

displayResults();

search.addEventListener("input", function () {

displayResults(this.value);

});

});
