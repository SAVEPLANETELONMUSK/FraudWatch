document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("caseLookupForm");
    const input = document.getElementById("caseId");
    const result = document.getElementById("caseResult");
    const dashboard = document.getElementById("caseDashboard");

    if (!form || !input || !result || !dashboard) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const reportId = input.value.trim().toUpperCase();

        if (!reportId) {
            result.innerHTML = "<p>Please enter your FraudWatch case reference.</p>";
            return;
        }

        if (!/^FW-[A-Z0-9]{8}$/.test(reportId)) {
            result.innerHTML = `
                <div class="card">
                    <h3>Invalid Case Reference</h3>
                    <p>
                        Please enter a valid FraudWatch reference such as
                        <strong>FW-12345678</strong>.
                    </p>
                </div>
            `;
            return;
        }

        result.innerHTML = "<p>Loading case information...</p>";
        dashboard.innerHTML = "";

        try {

            const response = await fetch(
                `/api/cases/${encodeURIComponent(reportId)}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Case could not be found."
                );
            }

            const caseData = data.case;

            result.innerHTML = `
                <div class="card">
                    <h3>✅ Case Found</h3>
                    <p>
                        Case reference:
                        <strong>${escapeHtml(caseData.reportId)}</strong>
                    </p>
                </div>
            `;

            renderCase(caseData);

        } catch (error) {

            result.innerHTML = `
                <div class="card">
                    <h3>Case Not Found</h3>
                    <p>
                        We could not find a case matching
                        <strong>${escapeHtml(reportId)}</strong>.
                    </p>
                    <p>
                        Check the reference and try again.
                    </p>
                </div>
            `;

            dashboard.innerHTML = "";
        }

    });

    function renderCase(caseData) {

        const evidence = Array.isArray(caseData.evidence)
            ? caseData.evidence
            : [];

        const evidenceList = evidence.length
            ? `
                <ul>
                    ${evidence.map(file => `
                        <li>
                            ${escapeHtml(file.originalname || "Evidence file")}
                            ${file.size ? ` — ${formatBytes(file.size)}` : ""}
                        </li>
                    `).join("")}
                </ul>
              `
            : "<p>No uploaded evidence is currently attached to this case.</p>";

        dashboard.innerHTML = `

            <div class="card">

                <h3>📁 Case Summary</h3>

                <p>
                    <strong>Reference:</strong>
                    ${escapeHtml(caseData.reportId)}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${escapeHtml(caseData.category || "Not specified")}
                </p>

                <p>
                    <strong>Target:</strong>
                    ${escapeHtml(caseData.target || "Not specified")}
                </p>

                <p>
                    <strong>Submitted:</strong>
                    ${formatDate(caseData.submitted)}
                </p>

                <p>
                    <strong>Last Updated:</strong>
                    ${formatDate(caseData.updated_at)}
                </p>

            </div>

            <div class="card">

                <h3>🚦 Case Status</h3>

                <p>
                    <strong>Report:</strong>
                    ${escapeHtml(caseData.status || "Pending")}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${escapeHtml(caseData.priority || "Medium")}
                </p>

                <p>
                    <strong>Investigation:</strong>
                    ${escapeHtml(
                        caseData.investigation_status || "Not Started"
                    )}
                </p>

                <p>
                    <strong>Recovery:</strong>
                    ${escapeHtml(
                        caseData.recovery_status || "Not Started"
                    )}
                </p>

            </div>

            <div class="card">

                <h3>📝 Report Description</h3>

                <p>
                    ${escapeHtml(
                        caseData.description ||
                        "No description was provided."
                    )}
                </p>

            </div>

            <div class="card">

                <h3>📎 Evidence</h3>

                ${evidenceList}

            </div>

            <div class="card">

                <h3>🔎 Investigation Timeline</h3>

                <div class="timeline">

                    <p>
                        <strong>Report submitted</strong><br>
                        ${formatDate(caseData.submitted)}
                    </p>

                    <p>
                        <strong>Current investigation status</strong><br>
                        ${escapeHtml(
                            caseData.investigation_status ||
                            "Not Started"
                        )}
                    </p>

                    <p>
                        <strong>Current recovery status</strong><br>
                        ${escapeHtml(
                            caseData.recovery_status ||
                            "Not Started"
                        )}
                    </p>

                    <p>
                        <strong>Last case update</strong><br>
                        ${formatDate(caseData.updated_at)}
                    </p>

                </div>

            </div>
        `;
    }

    function formatDate(value) {

        if (!value) return "Not available";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleString();
    }

    function formatBytes(bytes) {

        if (!bytes || bytes <= 0) return "";

        const units = ["B", "KB", "MB", "GB"];
        let size = bytes;
        let index = 0;

        while (size >= 1024 && index < units.length - 1) {
            size /= 1024;
            index++;
        }

        return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
    }

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});
