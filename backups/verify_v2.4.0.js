document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("verifyForm");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    if (!form || !input || !results) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const value = input.value.trim();

        if (value === "") {

            results.innerHTML = `
                <h3>Verification Results</h3>
                <p>Please enter something to verify.</p>
            `;

            return;

        }

        let type = "General Information";

        if (value.includes("@")) {

            type = "Email Address";

        } else if (value.startsWith("http") || value.includes(".")) {

            type = "Website / Domain";

        } else if (/^[0-9+\-\s()]+$/.test(value)) {

            type = "Phone Number";

        }

        results.innerHTML = `
            <h3>Verification Results</h3>

            <p><strong>Input:</strong> ${value}</p>

            <p><strong>Detected Type:</strong> ${type}</p>

            <p><strong>Status:</strong> Ready for database verification.</p>

            <p>This is the first stage of the FraudWatch Verification Engine.</p>
        `;

    });

});
