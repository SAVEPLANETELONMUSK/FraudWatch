document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".verify-form form");
    const resultsBox = document.getElementById("searchResults");
    const input = document.getElementById("searchInput");

    if (!form || !resultsBox || !input) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const search = input.value.trim().toLowerCase();

        if (search === "") {

            resultsBox.innerHTML = `
                <h3>Verification Results</h3>
                <p>Please enter a phone number, website, company name, email or keyword.</p>
            `;

            return;

        }

        let found = null;

        scamDatabase.forEach(function (item) {

            if (search.includes(item.keyword)) {

                found = item;

            }

        });

        if (found) {

            resultsBox.innerHTML = `
                <h3>⚠ Match Found</h3>

                <p><strong>Scam Type:</strong> ${found.type}</p>

                <p><strong>Risk Level:</strong>
                <span class="risk-high">${found.risk}</span></p>

                <p>${found.message}</p>

                <p><strong>Recommendation:</strong>
                Exercise caution and independently verify any request for money or personal information.</p>
            `;

        } else {

            resultsBox.innerHTML = `
                <h3>✓ No Match Found</h3>

                <p>
                No matching record was found in the current demonstration database.
                </p>

                <p>
                This does not mean the person, company or website is trustworthy.
                Always perform additional checks before making payments or sharing personal information.
                </p>
            `;

        }

    });

});
