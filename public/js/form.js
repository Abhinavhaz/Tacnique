/**
 * Employee Form JavaScript
 * Handles form validation, submission, and user interactions
 */

class EmployeeForm {
  constructor() {
    this.form = document.getElementById('employeeForm');
    this.isEditMode = false;
    this.editId = null;

    this.init();
  }

  init() {
    this.checkEditMode();
    this.setupEventListeners();
    this.setupValidation();
  }

  checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    this.editId = urlParams.get('id');

    if (this.editId) {
      this.isEditMode = true;
      this.loadEmployeeData();
      document.getElementById('formTitle').textContent = 'Edit Employee';
      document.getElementById('submitBtn').innerHTML = '<span class="btn-icon">💾</span> Update Employee';
    }
  }

  loadEmployeeData() {
    const employees = JSON.parse(localStorage.getItem('employeeDirectory')) || [];
    const employee = employees.find(emp => emp.id == this.editId);

    if (employee) {
      document.getElementById('firstName').value = employee.firstName;
      document.getElementById('lastName').value = employee.lastName;
      document.getElementById('email').value = employee.email;
      document.getElementById('department').value = employee.department;
      document.getElementById('role').value = employee.role;
    } else {
      this.showMessage('Employee not found', 'error');
      setTimeout(() => {
        const currentPath = window.location.pathname;
        let dashboardUrl;

        if (currentPath.includes('test-form.html')) {
          dashboardUrl = 'test-dashboard.html';
        } else if (currentPath.includes('templates/form.html')) {
          dashboardUrl = 'dashboard.html';
        } else {
          dashboardUrl = 'dashboard.ftl';
        }

        window.location.href = dashboardUrl;
      }, 2000);
    }
  }

  setupEventListeners() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', this.handleReset.bind(this));

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
  }

  setupValidation() {
    // Email validation pattern
    const emailInput = document.getElementById('email');
    emailInput.pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required`;
    }
    // Email validation
    else if (fieldName === 'email' && value) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      } else {
        // Check for duplicate email (excluding current employee in edit mode)
        const employees = JSON.parse(localStorage.getItem('employeeDirectory')) || [];
        const duplicateEmployee = employees.find(emp =>
          emp.email.toLowerCase() === value.toLowerCase() &&
          (!this.isEditMode || emp.id != this.editId)
        );
        if (duplicateEmployee) {
          isValid = false;
          errorMessage = 'This email address is already in use';
        }
      }
    }
    // Name validation
    else if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(fieldName)} must be at least 2 characters long`;
      } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(fieldName)} can only contain letters, spaces, hyphens, and apostrophes`;
      }
    }
    // Role validation
    else if (fieldName === 'role' && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Role must be at least 2 characters long';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  getFieldLabel(fieldName) {
    const labels = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      department: 'Department',
      role: 'Role'
    };
    return labels[fieldName] || fieldName;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showMessage('Please fix the errors below', 'error');
      return;
    }

    const formData = new FormData(this.form);
    const employeeData = {
      firstName: formData.get('firstName').trim(),
      lastName: formData.get('lastName').trim(),
      email: formData.get('email').trim(),
      department: formData.get('department'),
      role: formData.get('role').trim()
    };

    try {
      const employees = JSON.parse(localStorage.getItem('employeeDirectory')) || [];

      if (this.isEditMode) {
        const index = employees.findIndex(emp => emp.id == this.editId);
        if (index !== -1) {
          employees[index] = { ...employeeData, id: parseInt(this.editId) };
          this.showMessage('Employee updated successfully!', 'success');
        } else {
          throw new Error('Employee not found');
        }
      } else {
        const newEmployee = {
          ...employeeData,
          id: Date.now()
        };
        employees.push(newEmployee);
        this.showMessage('Employee added successfully!', 'success');
      }

      localStorage.setItem('employeeDirectory', JSON.stringify(employees));

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        const currentPath = window.location.pathname;
        let dashboardUrl;

        if (currentPath.includes('test-form.html')) {
          dashboardUrl = 'test-dashboard.html';
        } else if (currentPath.includes('templates/form.html')) {
          dashboardUrl = 'dashboard.html';
        } else {
          dashboardUrl = 'dashboard.ftl';
        }

        window.location.href = dashboardUrl;
      }, 1500);

    } catch (error) {
      console.error('Error saving employee:', error);
      this.showMessage('An error occurred while saving. Please try again.', 'error');
    }
  }

  handleReset(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to reset the form? All changes will be lost.')) {
      this.form.reset();

      // Clear all error messages
      const errorElements = this.form.querySelectorAll('.error-message');
      errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
      });

      // Remove error classes
      const errorInputs = this.form.querySelectorAll('.error');
      errorInputs.forEach(input => input.classList.remove('error'));

      // If in edit mode, reload the original data
      if (this.isEditMode) {
        this.loadEmployeeData();
      }

      this.showMessage('Form reset successfully', 'success');
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      this.form.dispatchEvent(new Event('submit'));
    }

    // Escape to go back
    if (e.key === 'Escape') {
      if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
        const currentPath = window.location.pathname;
        let dashboardUrl;

        if (currentPath.includes('test-form.html')) {
          dashboardUrl = 'test-dashboard.html';
        } else if (currentPath.includes('templates/form.html')) {
          dashboardUrl = 'dashboard.html';
        } else {
          dashboardUrl = 'dashboard.ftl';
        }

        window.location.href = dashboardUrl;
      }
    }
  }

  showMessage(message, type = 'success') {
    let container = document.getElementById('messageContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'messageContainer';
      container.className = 'message-container';
      document.body.appendChild(container);
    }

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.innerHTML = `
      <span class="message-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
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

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new EmployeeForm();
});