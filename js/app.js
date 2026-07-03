document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".verify-form form");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const inputs = form.querySelectorAll("input, textarea");

        let hasValue = false;

        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                hasValue = true;
            }
        });

        if (!hasValue) {
            alert("Please enter at least one piece of information to verify.");
            return;
        }

        alert(
            "Thank you. FraudWatch received your verification request.\n\nThis is the first version of the platform. Verification features are still under development."
        );

    });

});
