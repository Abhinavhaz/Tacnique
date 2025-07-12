/**
 * Employee Directory Dashboard JavaScript
 * Handles filtering, sorting, pagination, and view management
 */

class EmployeeDirectory {
  constructor() {
    this.employees = window.employeeData || [];
    this.filteredEmployees = [...this.employees];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.currentView = "grid";
    this.deleteEmployeeId = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
    this.renderEmployees();
    this.updateResultCount();
  }

  setupEventListeners() {
    // Search and filters
    document.getElementById("searchInput").addEventListener("input", this.debounce(this.handleSearch.bind(this), 300));
    document.getElementById("firstNameFilter").addEventListener("input", this.debounce(this.handleFilter.bind(this), 300));
    document.getElementById("departmentFilter").addEventListener("change", this.handleFilter.bind(this));
    document.getElementById("roleFilter").addEventListener("change", this.handleFilter.bind(this));
    document.getElementById("sortBy").addEventListener("change", this.handleSort.bind(this));

    // View controls
    document.getElementById("gridView").addEventListener("click", () => this.setView("grid"));
    document.getElementById("tableView").addEventListener("click", () => this.setView("table"));
    document.getElementById("itemsPerPage").addEventListener("change", this.handleItemsPerPageChange.bind(this));

    // Filter sidebar
    document.getElementById("filterToggle").addEventListener("click", this.toggleFilterSidebar.bind(this));
    document.getElementById("closeFilters").addEventListener("click", this.closeFilterSidebar.bind(this));
    document.getElementById("filterOverlay").addEventListener("click", this.closeFilterSidebar.bind(this));
    document.getElementById("clearFilters").addEventListener("click", this.clearAllFilters.bind(this));

    // Modal
    document.getElementById("deleteModal").addEventListener("click", (e) => {
      if (e.target.id === "deleteModal") {
        this.closeDeleteModal();
      }
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", this.handleKeyboardShortcuts.bind(this));
  }

  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem("employeeDirectory");
    if (data) {
      this.employees = JSON.parse(data);
      this.filteredEmployees = [...this.employees];
    }
  }

  saveToLocalStorage() {
    localStorage.setItem("employeeDirectory", JSON.stringify(this.employees));
  }

  handleSearch() {
    const value = document.getElementById("searchInput").value.toLowerCase().trim();
    this.filteredEmployees = this.employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return fullName.includes(value) || emp.email.toLowerCase().includes(value);
    });
    this.currentPage = 1;
    this.renderEmployees();
    this.updateResultCount();
  }

  handleFilter() {
    const department = document.getElementById("departmentFilter").value;
    const role = document.getElementById("roleFilter").value;
    const search = document.getElementById("searchInput").value.toLowerCase().trim();
    const firstName = document.getElementById("firstNameFilter").value.toLowerCase().trim();

    this.filteredEmployees = this.employees.filter((emp) => {
      const matchSearch =
        search === "" ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search);
      const matchFirstName =
        firstName === "" ||
        emp.firstName.toLowerCase().includes(firstName);
      const matchDept = department === "" || emp.department === department;
      const matchRole = role === "" || emp.role === role;
      return matchSearch && matchFirstName && matchDept && matchRole;
    });

    this.applySort();
    this.currentPage = 1;
    this.renderEmployees();
    this.updateResultCount();
  }

  handleSort() {
    this.applySort();
    this.renderEmployees();
  }

  applySort() {
    const sortBy = document.getElementById("sortBy").value;
    this.filteredEmployees.sort((a, b) => {
      const valA = a[sortBy].toLowerCase();
      const valB = b[sortBy].toLowerCase();
      return valA.localeCompare(valB);
    });
  }

  handleItemsPerPageChange() {
    this.itemsPerPage = parseInt(document.getElementById("itemsPerPage").value);
    this.currentPage = 1;
    this.renderEmployees();
  }

  setView(view) {
    this.currentView = view;
    document.querySelectorAll(".view-btn").forEach((btn) => btn.classList.remove("active"));
    document.getElementById(view + "View").classList.add("active");
    this.renderEmployees();
  }

  getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
  }

  renderEmployees() {
    const container = document.getElementById("employeeContainer");
    const employees = this.getPaginatedEmployees();

    if (this.filteredEmployees.length === 0) {
      container.innerHTML = `<div class="empty">No employees found</div>`;
      return;
    }

    if (this.currentView === "grid") {
      container.className = "employee-grid";
      container.innerHTML = employees.map((e) => this.createEmployeeCard(e)).join("");
    } else {
      container.className = "employee-table";
      container.innerHTML = this.createEmployeeTable(employees);
    }

    this.renderPagination();
  }

  createEmployeeCard(emp) {
    return `
      <div class="card">
        <h3>${this.escapeHtml(emp.firstName)} ${this.escapeHtml(emp.lastName)}</h3>
        <p>ID: ${emp.id}</p>
        <p>${this.escapeHtml(emp.email)}</p>
        <p>${this.escapeHtml(emp.department)} | ${this.escapeHtml(emp.role)}</p>
        <div class="card-actions">
          <button class="btn btn-sm btn-secondary" onclick="window.employeeDirectory.editEmployee(${emp.id})" title="Edit Employee">
            <span class="btn-icon">✏️</span> Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="window.employeeDirectory.showDeleteModal(${emp.id})" title="Delete Employee">
            <span class="btn-icon">🗑️</span> Delete
          </button>
        </div>
      </div>
    `;
  }

  createEmployeeTable(emps) {
    return `
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${emps
            .map(
              (e) => `
            <tr>
              <td>${e.id}</td>
              <td>${this.escapeHtml(e.firstName)} ${this.escapeHtml(e.lastName)}</td>
              <td>${this.escapeHtml(e.email)}</td>
              <td>${this.escapeHtml(e.department)}</td>
              <td>${this.escapeHtml(e.role)}</td>
              <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="window.employeeDirectory.editEmployee(${e.id})" title="Edit Employee">
                  <span class="btn-icon">✏️</span>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.employeeDirectory.showDeleteModal(${e.id})" title="Delete Employee">
                  <span class="btn-icon">🗑️</span>
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    const container = document.getElementById("pagination");

    if (totalPages <= 1) return (container.innerHTML = "");

    let buttons = "";

    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button class="${this.currentPage === i ? "active" : ""}" onclick="window.employeeDirectory.goToPage(${i})">${i}</button>`;
    }

    container.innerHTML = buttons;
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderEmployees();
  }

  updateResultCount() {
    const count = document.getElementById("resultCount");
    const total = this.filteredEmployees.length;
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, total);
    count.textContent = `Showing ${start}-${end} of ${total}`;
  }

  editEmployee(id) {
    // Check if we're in test mode (HTML files) or production mode (FTL files)
    const isTestMode = window.location.pathname.includes('test-dashboard.html');
    const formUrl = isTestMode ? `test-form.html?id=${id}` : `form.ftl?id=${id}`;
    window.location.href = formUrl;
  }

  showDeleteModal(id) {
    this.deleteEmployeeId = id;
    const modal = document.getElementById("deleteModal");
    modal.classList.add("show");
    modal.style.display = "flex";
  }

  closeDeleteModal() {
    this.deleteEmployeeId = null;
    const modal = document.getElementById("deleteModal");
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }

  toggleFilterSidebar() {
    const sidebar = document.getElementById("filterSidebar");
    const overlay = document.getElementById("filterOverlay");

    if (sidebar.classList.contains("open")) {
      this.closeFilterSidebar();
    } else {
      sidebar.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  closeFilterSidebar() {
    const sidebar = document.getElementById("filterSidebar");
    const overlay = document.getElementById("filterOverlay");

    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("firstNameFilter").value = "";
    document.getElementById("departmentFilter").value = "";
    document.getElementById("roleFilter").value = "";
    document.getElementById("sortBy").value = "firstName";

    this.handleFilter();
    this.showMessage("Filters cleared", "success");
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showMessage(message, type = "success") {
    const container = document.getElementById("messageContainer");
    if (!container) return;

    const messageEl = document.createElement("div");
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
      <span class="message-icon">${type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span>
      <span class="message-text">${this.escapeHtml(message)}</span>
    `;

    container.appendChild(messageEl);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.parentNode.removeChild(messageEl);
      }
    }, 5000);
  }

  confirmDelete() {
    if (this.deleteEmployeeId) {
      const employee = this.employees.find(emp => emp.id === this.deleteEmployeeId);
      this.employees = this.employees.filter((emp) => emp.id !== this.deleteEmployeeId);
      this.saveToLocalStorage();
      this.handleFilter(); // Use handleFilter instead of handleSearch to maintain current filters
      this.closeDeleteModal();

      if (employee) {
        this.showMessage(`Employee ${employee.firstName} ${employee.lastName} deleted successfully`, "success");
      }
    }
  }

  handleKeyboardShortcuts(e) {
    if (e.key === "Escape") {
      this.closeDeleteModal();
      this.closeFilterSidebar();
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      document.getElementById("searchInput").focus();
    }

    // Ctrl/Cmd + N to add new employee
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      const isTestMode = window.location.pathname.includes('test-dashboard.html');
      const formUrl = isTestMode ? 'test-form.html' : 'form.ftl';
      window.location.href = formUrl;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.employeeDirectory = new EmployeeDirectory();
});
