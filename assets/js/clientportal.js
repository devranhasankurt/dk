
/* ====================
   DK VISUALS
   CLIENT PORTAL
==================== */


/* ====================
   CONFIGURATION
==================== */

const CLIENTS_PATH = "clients.json";

const params = new URLSearchParams(window.location.search);
const clientId = params.get("client") || "client-001";


/* ====================
   HELPERS
==================== */

const getElement = (id) => document.getElementById(id);

const setText = (id, value) => {
    const element = getElement(id);

    if (element) {
        element.textContent = value ?? "—";
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR"
    }).format(Number(amount) || 0);
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(parsedDate);
};

const createElement = (tag, className, text) => {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
};


/* ====================
   NAVIGATION
==================== */

function initializeNavigation() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section");

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const target = link.dataset.section;

            links.forEach(item => {
                item.classList.remove("active");
            });

            sections.forEach(section => {
                section.classList.remove("active");
            });

            link.classList.add("active");

            const targetSection = getElement(target);

            if (targetSection) {
                targetSection.classList.add("active");
            }

            history.replaceState(null, "", `#${target}`);
        });
    });

    const initialSection = window.location.hash.replace("#", "");

    if (initialSection) {
        const matchingLink = document.querySelector(
            `.nav-link[data-section="${initialSection}"]`
        );

        if (matchingLink) {
            matchingLink.click();
        }
    }
}


/* ====================
   DATE
==================== */

function initializeDate() {
    const today = new Date();

    setText(
        "currentDate",
        new Intl.DateTimeFormat("nl-NL", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(today)
    );
}


/* ====================
   CLIENT INFORMATION
==================== */

function renderClient(client) {
    const name = client.name || "Client";
    const initials = name
        .split(" ")
        .filter(Boolean)
        .map(part => part.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    setText("clientName", name);
    setText("welcomeName", name);
    setText("clientAvatar", initials);
}


/* ====================
   PROJECT INFORMATION
==================== */

function renderProject(project) {
    if (!project) return;

    const progress = Math.min(
        100,
        Math.max(0, Number(project.progress) || 0)
    );

    setText("projectName", project.name);
    setText("projectDescription", project.description);
    setText("projectId", project.id);
    setText("projectStatus", project.status);

    setText("startDate", formatDate(project.startDate));
    setText("deliveryDate", formatDate(project.deliveryDate));
    setText("projectType", project.type);

    setText("progressPercentage", `${progress}%`);
    setText("statProgress", `${progress}%`);

    setText("projectPageName", project.name);
    setText("projectPageId", project.id);
    setText("projectPageType", project.type);
    setText("projectPageStatus", project.status);
    setText("projectPageStart", formatDate(project.startDate));
    setText("projectPageDelivery", formatDate(project.deliveryDate));
    setText("projectPageDescription", project.description);

    const progressFill = getElement("progressFill");

    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
}


/* ====================
   PROJECT UPDATES
==================== */

function renderUpdates(updates = []) {
    const container = getElement("updatesContainer");

    if (!container) return;

    container.replaceChildren();

    if (!updates.length) {
        container.appendChild(
            createElement(
                "div",
                "empty-state",
                "No project updates available."
            )
        );

        return;
    }

    updates.forEach(update => {
        const item = createElement("div", "update-item");

        const content = createElement("div", "update-content");

        content.appendChild(
            createElement("h3", "", update.title)
        );

        content.appendChild(
            createElement("p", "", update.description)
        );

        content.appendChild(
            createElement(
                "span",
                "timeline-date",
                formatDate(update.date)
            )
        );

        item.appendChild(content);
        container.appendChild(item);
    });
}


/* ====================
   PROJECT TIMELINE
==================== */

function renderTimeline(timeline = []) {
    const container = getElement("timelineContainer");

    if (!container) return;

    container.replaceChildren();

    if (!timeline.length) {
        container.appendChild(
            createElement(
                "div",
                "empty-state",
                "No timeline information available."
            )
        );

        return;
    }

    timeline.forEach(step => {
        const item = createElement(
            "div",
            `timeline-item ${step.completed ? "completed" : ""}`
        );

        const marker = createElement("div", "timeline-marker");
        const content = createElement("div", "timeline-content");

        content.appendChild(
            createElement("h3", "", step.title)
        );

        content.appendChild(
            createElement("p", "", step.description)
        );

        content.appendChild(
            createElement(
                "span",
                "timeline-date",
                formatDate(step.date)
            )
        );

        item.appendChild(marker);
        item.appendChild(content);

        container.appendChild(item);
    });
}


/* ====================
   FILES
==================== */

function renderFiles(files = []) {
    const container = getElement("filesContainer");

    if (!container) return;

    container.replaceChildren();

    setText("statFiles", files.length);
    setText("fileCount", `${files.length} files`);

    if (!files.length) {
        container.appendChild(
            createElement(
                "div",
                "empty-state",
                "No files available."
            )
        );

        return;
    }

    files.forEach(file => {
        const item = createElement("div", "file-item");
        const info = createElement("div", "file-info");
        const icon = createElement(
            "div",
            "file-icon",
            (file.type || "FILE").toUpperCase()
        );

        const details = createElement("div", "file-details");

        details.appendChild(
            createElement("span", "file-name", file.name)
        );

        details.appendChild(
            createElement(
                "span",
                "file-meta",
                `${file.size || "—"} · ${formatDate(file.date)}`
            )
        );

        info.appendChild(icon);
        info.appendChild(details);

        const download = createElement(
            "a",
            "file-download",
            "Download ↓"
        );

        download.href = file.url || "#";
        download.setAttribute("download", "");

        if (!file.url) {
            download.addEventListener("click", event => {
                event.preventDefault();
            });
        }

        item.appendChild(info);
        item.appendChild(download);

        container.appendChild(item);
    });
}


/* ====================
   INVOICES
==================== */

function renderInvoices(invoices = []) {
    const container = getElement("invoicesContainer");

    if (!container) return;

    container.replaceChildren();

    let total = 0;
    let paid = 0;
    let outstanding = 0;

    invoices.forEach(invoice => {
        const amount = Number(invoice.amount) || 0;

        total += amount;

        if (invoice.status === "paid") {
            paid += amount;
        } else {
            outstanding += amount;
        }
    });

    setText("totalInvoiced", formatCurrency(total));
    setText("totalPaid", formatCurrency(paid));
    setText("totalUnpaid", formatCurrency(outstanding));

    setText("statInvoices", invoices.length);
    setText("statOutstanding", formatCurrency(outstanding));

    setText("invoiceCount", `${invoices.length} invoices`);

    if (!invoices.length) {
        container.appendChild(
            createElement(
                "div",
                "empty-state",
                "No invoices available."
            )
        );

        return;
    }

    invoices.forEach(invoice => {
        const item = createElement("div", "invoice-item");

        const number = createElement(
            "span",
            "invoice-number",
            invoice.number
        );

        const date = createElement(
            "span",
            "invoice-date",
            formatDate(invoice.date)
        );

        const amount = createElement(
            "span",
            "invoice-amount",
            formatCurrency(invoice.amount)
        );

        const status = createElement(
            "span",
            `invoice-status ${invoice.status === "paid" ? "" : "unpaid"}`,
            invoice.status === "paid" ? "Paid" : "Unpaid"
        );

        const info = createElement("div", "invoice-info");

        info.appendChild(number);
        info.appendChild(date);

        const amountInfo = createElement("div", "invoice-amount-info");

        amountInfo.appendChild(amount);
        amountInfo.appendChild(status);

        const download = createElement(
            "a",
            "invoice-download",
            "Download ↓"
        );

        download.href = invoice.url || "#";
        download.setAttribute("download", "");

        if (!invoice.url) {
            download.addEventListener("click", event => {
                event.preventDefault();
            });
        }

        item.appendChild(info);
        item.appendChild(amountInfo);
        item.appendChild(download);

        container.appendChild(item);
    });
}


/* ====================
   LOAD CLIENT JSON
==================== */

async function loadClientData() {
    try {
        const response = await fetch(CLIENTS_PATH);

        if (!response.ok) {
            throw new Error("Client data could not be loaded.");
        }

        const data = await response.json();

        const client = data.clients.find(
            client => client.id === clientId
        );

        if (!client || !client.active) {
            throw new Error("Client not found or inactive.");
        }

        renderClient(client);
        renderProject(client.project || {});
        renderUpdates(client.updates || []);
        renderTimeline(client.timeline || []);
        renderFiles(client.files || []);
        renderInvoices(client.invoices || []);

    } catch (error) {
        console.error("DK VISUALS Portal:", error);

        document.querySelector(".main-content").innerHTML = `
            <div class="page-section active">
                <div class="page-heading">
                    <div>
                        <span class="eyebrow">DK VISUALS</span>
                        <h1>Unable to load portal.</h1>
                        <p>Client information could not be found.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

/* ====================
   INITIALIZATION
==================== */

document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
    initializeDate();
    loadClientData();
});
