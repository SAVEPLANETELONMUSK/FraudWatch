document.addEventListener("DOMContentLoaded", function () {

const languageSelect = document.getElementById("languageSelect");

if (!languageSelect) return;

languageSelect.addEventListener("change", function () {

const selectedLanguage = this.value;

localStorage.setItem("fraudwatch_language", selectedLanguage);

alert("Language support for " + selectedLanguage + " will be available in an upcoming update.");

});

const savedLanguage = localStorage.getItem("fraudwatch_language");

if (savedLanguage) {

languageSelect.value = savedLanguage;

}

});
