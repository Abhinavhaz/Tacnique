<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employee Form</title>
  <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
  <div class="form-container">
    <header class="form-header">
      <h1 id="formTitle">Add Employee</h1>
      <button class="btn btn-secondary back-btn" onclick="window.location.href='dashboard.ftl'">
        <span class="btn-icon">←</span> Back to Directory
      </button>
    </header>

    <main class="form-main">
      <form id="employeeForm" class="employee-form" novalidate>
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              class="form-input"
              placeholder="Enter first name"
              required
              autocomplete="given-name"
            >
            <div class="error-message" id="firstNameError"></div>
          </div>

          <div class="form-group">
            <label for="lastName" class="form-label">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              class="form-input"
              placeholder="Enter last name"
              required
              autocomplete="family-name"
            >
            <div class="error-message" id="lastNameError"></div>
          </div>

          <div class="form-group full-width">
            <label for="email" class="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              placeholder="Enter email address"
              required
              autocomplete="email"
            >
            <div class="error-message" id="emailError"></div>
          </div>

          <div class="form-group">
            <label for="department" class="form-label">Department *</label>
            <select id="department" name="department" class="form-select" required>
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
              <option value="Customer Support">Customer Support</option>
            </select>
            <div class="error-message" id="departmentError"></div>
          </div>

          <div class="form-group">
            <label for="role" class="form-label">Role *</label>
            <input
              type="text"
              id="role"
              name="role"
              class="form-input"
              placeholder="Enter job role"
              required
            >
            <div class="error-message" id="roleError"></div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="submitBtn">
            <span class="btn-icon">💾</span> Save Employee
          </button>
          <button type="button" class="btn btn-secondary" onclick="window.location.href='dashboard.ftl'">
            Cancel
          </button>
          <button type="reset" class="btn btn-outline" id="resetBtn">
            Reset Form
          </button>
        </div>
      </form>
    </main>
  </div>

  <!-- Success/Error Messages -->
  <div id="messageContainer" class="message-container"></div>

  <script src="../public/js/form.js"></script>
</body>
</html>