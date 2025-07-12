<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employee Dashboard</title>
  <link rel="stylesheet" href="../public/css/style.css">
  <#-- Assign mock employee data -->
  <#assign employees = [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "department": "Engineering",
      "role": "Senior Developer"
    },
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "department": "HR",
      "role": "HR Manager"
    },
    {
      "id": 3,
      "firstName": "Michael",
      "lastName": "Johnson",
      "email": "michael.johnson@example.com",
      "department": "Marketing",
      "role": "Marketing Specialist"
    },
    {
      "id": 4,
      "firstName": "Sarah",
      "lastName": "Williams",
      "email": "sarah.williams@example.com",
      "department": "Engineering",
      "role": "Frontend Developer"
    },
    {
      "id": 5,
      "firstName": "David",
      "lastName": "Brown",
      "email": "david.brown@example.com",
      "department": "Sales",
      "role": "Sales Representative"
    },
    {
      "id": 6,
      "firstName": "Emily",
      "lastName": "Davis",
      "email": "emily.davis@example.com",
      "department": "Finance",
      "role": "Financial Analyst"
    },
    {
      "id": 7,
      "firstName": "Robert",
      "lastName": "Miller",
      "email": "robert.miller@example.com",
      "department": "Engineering",
      "role": "Backend Developer"
    },
    {
      "id": 8,
      "firstName": "Lisa",
      "lastName": "Wilson",
      "email": "lisa.wilson@example.com",
      "department": "HR",
      "role": "HR Coordinator"
    },
    {
      "id": 9,
      "firstName": "James",
      "lastName": "Moore",
      "email": "james.moore@example.com",
      "department": "Marketing",
      "role": "Content Creator"
    },
    {
      "id": 10,
      "firstName": "Jennifer",
      "lastName": "Taylor",
      "email": "jennifer.taylor@example.com",
      "department": "Sales",
      "role": "Sales Manager"
    },
    {
      "id": 11,
      "firstName": "Christopher",
      "lastName": "Anderson",
      "email": "christopher.anderson@example.com",
      "department": "Finance",
      "role": "Accountant"
    },
    {
      "id": 12,
      "firstName": "Amanda",
      "lastName": "Thomas",
      "email": "amanda.thomas@example.com",
      "department": "Engineering",
      "role": "DevOps Engineer"
    }
  ]>

  <#-- Extract unique departments and roles for filters -->
  <#assign departments = []>
  <#assign roles = []>
  <#list employees as emp>
    <#if !departments?seq_contains(emp.department)>
      <#assign departments = departments + [emp.department]>
    </#if>
    <#if !roles?seq_contains(emp.role)>
      <#assign roles = roles + [emp.role]>
    </#if>
  </#list>

  <script>
    // Pass employee data to JavaScript
    window.employeeData = [
      <#list employees as emp>
        {
          id: ${emp.id},
          firstName: "${emp.firstName}",
          lastName: "${emp.lastName}",
          email: "${emp.email}",
          department: "${emp.department}",
          role: "${emp.role}"
        }<#sep>,</#sep>
      </#list>
    ];
  </script>
</head>
<body>
  <header class="header">
    <div class="header-top">
      <h1>Employee Directory</h1>
      <button class="btn btn-primary add-btn" onclick="window.location.href='form.ftl'">
        <span class="btn-icon">+</span> Add Employee
      </button>
    </div>

    <div class="controls">
      <div class="search-section">
        <input type="text" id="searchInput" placeholder="Search by name or email..." class="search-input">
        <button id="filterToggle" class="btn btn-secondary">
          <span class="btn-icon">⚙</span> Filters
        </button>
      </div>

      <div class="view-controls">
        <div class="view-toggle">
          <button id="gridView" class="view-btn active" title="Grid View">
            <span class="btn-icon">⊞</span>
          </button>
          <button id="tableView" class="view-btn" title="Table View">
            <span class="btn-icon">☰</span>
          </button>
        </div>

        <select id="itemsPerPage" class="select-input">
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>
    </div>
  </header>

  <!-- Filter Sidebar -->
  <div id="filterSidebar" class="filter-sidebar">
    <div class="filter-header">
      <h3>Filters</h3>
      <button id="closeFilters" class="btn-close">&times;</button>
    </div>

    <div class="filter-group">
      <label for="firstNameFilter">First Name:</label>
      <input type="text" id="firstNameFilter" placeholder="Filter by first name..." class="filter-input">
    </div>

    <div class="filter-group">
      <label for="departmentFilter">Department:</label>
      <select id="departmentFilter" class="filter-select">
        <option value="">All Departments</option>
        <#list departments as dept>
          <option value="${dept}">${dept}</option>
        </#list>
      </select>
    </div>

    <div class="filter-group">
      <label for="roleFilter">Role:</label>
      <select id="roleFilter" class="filter-select">
        <option value="">All Roles</option>
        <#list roles as role>
          <option value="${role}">${role}</option>
        </#list>
      </select>
    </div>

    <div class="filter-group">
      <label for="sortBy">Sort By:</label>
      <select id="sortBy" class="filter-select">
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="department">Department</option>
        <option value="role">Role</option>
      </select>
    </div>

    <div class="filter-actions">
      <button id="clearFilters" class="btn btn-secondary">Clear All</button>
    </div>
  </div>

  <!-- Main Content -->
  <main class="main-content">
    <div class="content-header">
      <div id="resultCount" class="result-count"></div>
      <div class="loading" id="loading" style="display: none;">Loading...</div>
    </div>

    <div id="employeeContainer" class="employee-container"></div>

    <div id="pagination" class="pagination"></div>
  </main>

  <!-- Delete Confirmation Modal -->
  <div id="deleteModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Confirm Delete</h3>
        <button class="btn-close" onclick="window.employeeDirectory.closeDeleteModal()">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete this employee? This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" onclick="window.employeeDirectory.confirmDelete()">Delete</button>
        <button class="btn btn-secondary" onclick="window.employeeDirectory.closeDeleteModal()">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Filter Overlay -->
  <div id="filterOverlay" class="filter-overlay"></div>

  <script src="../public/js/dashboard.js"></script>
</body>
</html>