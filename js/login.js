document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("loginForm");
const result = document.getElementById("loginResult");

form.addEventListener("submit", async (e) => {

e.preventDefault();

const username = document.getElementById("username").value.trim();
const password = document.getElementById("password").value;

result.innerHTML = "<p>Signing in...</p>";

try {

const response = await fetch("https://fraudwatch-backend-uih8.onrender.com/api/admin/login", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
username,
password
})

});

const data = await response.json();

if (!data.success) {

result.innerHTML = `<p style="color:red;">${data.message}</p>`;
return;

}

localStorage.setItem("fw_admin_token", data.token);

window.location.href = "admin.html";

} catch (err) {

result.innerHTML = "<p style='color:red;'>Unable to connect to the server.</p>";

}

});

});
