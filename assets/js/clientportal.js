
const CLIENTS_PATH = "assets/data/clients.json";

let clients = [];
let currentClient = null;

// ================================
// ELEMENTS
// ================================

const loginScreen = document.getElementById("loginScreen");
const portalContent = document.getElementById("portalContent");

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const loginButton = document.getElementById("loginButton");

const logoutButton = document.getElementById("logoutButton");

// ================================
// LOAD CLIENT DATA
// ================================

async function loadClients() {
    try {
        const response = await fetch(CLIENTS_PATH);

        if (!response.ok) {
            throw new Error("Could not load clients.json");
        }

        const data = await response.json();

        if (!Array.isArray(data.clients)) {
            throw new Error("Invalid clients.json structure");
        }

        clients = data.clients;

    } catch (error) {
        console.error("Client data error:", error);

        loginError.textContent =
            "Unable to load client data. Please try again later.";

        loginButton.disabled = true;
    }
}

// ================================
// LOGIN
// ================================

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    loginError.textContent = "";

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    const client = clients.find(function (item) {
        return (
            item.email.toLowerCase() === email &&
            item.password === password &&
            item.active === true
        );
    });

    if (!client) {
        loginError.textContent =
            "Incorrect email or password.";

        return;
    }

    currentClient = client;

    loginScreen.hidden = true;
    portalContent.hidden = false;

    loginPassword.value = "";

    renderPortal();
});

// ================================
// LOGOUT
// ================================

logoutButton.addEventListener("click", function () {
    currentClient = null;

    portalContent.hidden = true;
    loginScreen.hidden = false;

    loginForm.reset();
    loginError.textContent = "";

    showSection("dashboard");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ================================
// PORTAL INITIALIZATION
// ================================

function renderPortal() {
    if (!currentClient) return;

    renderClientInfo();
    renderDashboard();
    renderProject();
    renderFiles();
    renderInvoices();

    showSection("dashboard");
}

// ================================
// CLIENT INFORMATION
// ================================

function renderClientInfo() {
    const clientName = document.getElementById("clientName");
    const clientEmail = document.getElementById("clientEmail");

    if (clientName) {
        clientName.textContent = currentClient.name || "Client";
    }

    if (clientEmail) {
        clientEmail.textContent = currentClient.email || "";
    }
}

// ================================
// DASHBOARD
// ================================

function renderDashboard() {
    const project = currentClient.project || {};

    setText("dashboardClientName", currentClient.name || "Client");
    setText("dashboardProjectName", project.name || "No project");
    setText("dashboardProjectStatus", project.status || "Not started");

    const progress = Number(project.progress) || 0;

    setText("dashboardProgress", `${progress}%`);

    const progressBar = document.getElementById("dashboardProgressBar");

    if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    setText(
        "dashboardDeliveryDate",
        formatDate(project.deliveryDate)
    );

    renderRecentUpdates();
}

// ================================
// RECENT UPDATES
// ================================

function renderRecentUpdates() {
    const container = document.getElementById("recentUpdates");

    if (!container) return;

    const updates = currentClient.updates || [];

    container.replaceChildren();

    if (updates.length === 0) {
        container.textContent = "No updates available yet.";
        return;
    }

    updates.slice().reverse().forEach(function (update) {
        const item = document.createElement("div");
        item.className = "update-item";

        const title = document.createElement("h4");
        title.textContent = update.title || "Project update";

        const description = document.createElement("p");
        description.textContent = update.description || "";

        const date = document.createElement("span");
        date.textContent = formatDate(update.date);

        item.append(title, description, date);
        container.appendChild(item);
    });
}

// ================================
// PROJECT
// ================================

function renderProject() {
    const project = currentClient.project || {};

    setText("projectName", project.name || "No project");
    setText("projectDescription", project.description || "");
    setText("projectType", project.type || "Not specified");
    setText("projectStatus", project.status || "Not started");

    setText("projectStartDate", formatDate(project.startDate));
    setText("projectDeliveryDate", formatDate(project.deliveryDate));

    const progress = Number(project.progress) || 0;

    setText("projectProgress", `${progress}%`);

    const progressBar = document.getElementById("projectProgressBar");

    if (progressBar) {
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    renderTimeline();
}

// ================================
// PROJECT TIMELINE
// ================================

function renderTimeline() {
    const container = document.getElementById("projectTimeline");

    if (!container) return;

    const timeline = currentClient.timeline || [];

    container.replaceChildren();

    if (timeline.length === 0) {
        container.textContent = "No project milestones available.";
        return;
    }

    timeline.forEach(function (step) {
        const item = document.createElement("div");

        item.className = step.completed
            ? "timeline-item completed"
            : "timeline-item";

        const marker = document.createElement("div");
        marker.className = "timeline-marker";

        const content = document.createElement("div");
        content.className = "timeline-content";

        const title = document.createElement("h4");
        title.textContent = step.title || "Project milestone";

        const description = document.createElement("p");
        description.textContent = step.description || "";

        const date = document.createElement("span");
        date.textContent = formatDate(step.date);

        content.append(title, description, date);
        item.append(marker, content);

        container.appendChild(item);
    });
}

// ================================
// FILES
// ================================

function renderFiles() {
    const container = document.getElementById("filesList");

    if (!container) return;

    const files = currentClient.files || [];

    container.replaceChildren();

    if (files.length === 0) {
        container.textContent = "No files available yet.";
        return;
    }

    files.forEach(function (file) {
        const item = document.createElement("div");
        item.className = "file-item";

        const information = document.createElement("div");
        information.className = "file-info";

        const name = document.createElement("h4");
        name.textContent = file.name || "Unnamed file";

        const details = document.createElement("span");

        const fileDate = file.date
            ? formatDate(file.date)
            : "";

        const fileType = file.type || "File";

        details.textContent = [fileType, fileDate]
            .filter(Boolean)
            .join(" • ");

        information.append(name, details);
        item.appendChild(information);

        if (file.url) {
            const link = document.createElement("a");

            link.href = file.url;
            link.textContent = "Download";
            link.className = "file-download";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            item.appendChild(link);
        }

        container.appendChild(item);
    });
}

// ================================
// INVOICES
// ================================

function renderInvoices() {
    const container = document.getElementById("invoicesList");

    if (!container) return;

    const invoices = currentClient.invoices || [];

    container.replaceChildren();

    if (invoices.length === 0) {
        container.textContent = "No invoices available yet.";
        return;
    }

    invoices.forEach(function (invoice) {
        const item = document.createElement("div");
        item.className = "invoice-item";

        const information = document.createElement("div");
        information.className = "invoice-info";

        const number = document.createElement("h4");
        number.textContent = invoice.number || "Invoice";

        const date = document.createElement("span");
        date.textContent = formatDate(invoice.date);

        const amount = document.createElement("p");
        amount.textContent = formatCurrency(invoice.amount);

        information.append(number, date, amount);

        const status = document.createElement("span");

        const isPaid = String(invoice.status).toLowerCase() === "paid";

        status.className = isPaid
            ? "invoice-status paid"
            : "invoice-status unpaid";

        status.textContent = isPaid ? "Paid" : "Unpaid";

        item.append(information, status);

        if (invoice.url) {
            const link = document.createElement("a");

            link.href = invoice.url;
            link.textContent = "View invoice";
            link.className = "invoice-link";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            item.appendChild(link);
        }

        container.appendChild(item);
    });
}

// ================================
// NAVIGATION
// ================================

const navigationLinks = document.querySelectorAll("[data-section]");

navigationLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const section = link.dataset.section;

        showSection(section);
    });
});

function showSection(sectionName) {
    const sections = document.querySelectorAll(".portal-section");

    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(
        `${sectionName}Section`
    );

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    navigationLinks.forEach(function (link) {
        link.classList.toggle(
            "active",
            link.dataset.section === sectionName
        );
    });
}

// ================================
// HELPER FUNCTIONS
// ================================

function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}

function formatDate(dateString) {
    if (!dateString) return "Not specified";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null || amount === "") {
        return "Amount not specified";
    }

    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "EUR"
    }).format(Number(amount));
}

// ================================
// START
// ================================

document.addEventListener("DOMContentLoaded", loadClients);
