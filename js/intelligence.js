document.addEventListener("DOMContentLoaded", function () {

const form = document.querySelector("form");
const input = document.querySelector("input");
const result = document.getElementById("result");

if (!form || !input || !result) return;

form.addEventListener("submit", function(e){

e.preventDefault();

const search = input.value.trim().toLowerCase();

if(search===""){

result.innerHTML="<p>Please enter something to search.</p>";

return;

}

const found = intelligenceDatabase.find(item =>
item.value.toLowerCase()===search
);

if(found){

result.innerHTML=`

<h3>${found.risk}</h3>

<p><strong>Category:</strong> ${found.category}</p>

<p>${found.message}</p>

`;

}else{

result.innerHTML=`

<h3>No Match Found</h3>

<p>

FraudWatch does not currently have educational information matching your search.

This does <strong>not</strong> mean the person, website, company, or contact is safe or unsafe.

Always verify independently before making financial or personal decisions.

</p>

`;

}

});

});
