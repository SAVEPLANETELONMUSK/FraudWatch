document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("homeSearchForm");

const input = document.getElementById("homeSearchInput");

if (!form || !input) return;

form.addEventListener("submit", function (e) {

e.preventDefault();

const value = input.value.trim();

if (value === "") {

alert("Please enter something to verify.");

return;

}

window.location.href =
"verify.html?search=" + encodeURIComponent(value);

});

});
