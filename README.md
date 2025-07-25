# Employee Directory

This is a web-based employee management system that allows you to view, add, edit, and delete employee records. The interface is designed to work well on both desktop and mobile devices.

## What it does

The application provides a clean interface for managing employee information. You can browse through employee records in either a grid or table layout, search for specific employees, and filter the results by department or role. Adding new employees or editing existing ones is handled through a dedicated form with built-in validation.

## Main features

**Employee listing**
- View employees in grid cards or table format
- Search by name or email address
- Filter by first name, department, or job role
- Sort employees by different criteria
- Navigate through pages when you have many employees

**Employee management**
- Add new employees with a detailed form
- Edit existing employee information
- Delete employees with confirmation
- Form validates input to prevent errors

**Interface**
- Works on phones, tablets, and computers
- Filter panel slides out from the side
- Keyboard shortcuts for common actions
- Clear feedback when actions succeed or fail

## File organization

```
employee-directory/
├── templates/
│   ├── dashboard.ftl          # Main dashboard template
│   └── form.ftl              # Employee form template
├── public/
│   ├── css/
│   │   └── style.css         # All styling
│   └── js/
│       ├── dashboard.js      # Dashboard logic
│       └── form.js          # Form handling
├── test-dashboard.html      # Test version (open this)
├── test-form.html          # Test form
└── index.html              # Entry point
```

## Built with

- HTML5 and CSS3 for structure and styling
- JavaScript for interactivity and data management
- Freemarker templates for server-side rendering
- Local browser storage for data persistence

## How to run

**Local development server (recommended)**
1. Use VS Code with Live Server extension, or run a simple HTTP server
2. Navigate to http://127.0.0.1:5500/test-dashboard.html
3. This ensures all features work properly without CORS issues

**Alternative methods**
- Open `test-dashboard.html` directly in a browser (some features may be limited)
- Use Python: `python -m http.server 8000` then go to `http://localhost:8000/test-dashboard.html`

**Production setup**
1. Deploy to a web server that supports Freemarker
2. Configure template processing
3. Access through `dashboard.ftl`

## Sample data

The test version includes 12 employees across different departments like Engineering, HR, Marketing, Sales, and Finance. This gives you a good feel for how the interface handles real data.

## Design notes

The interface adapts to different screen sizes automatically. On mobile devices, the layout switches to a single column and the filter panel takes up the full screen. All buttons and interactive elements are sized appropriately for touch input.

Keyboard users can navigate through the interface using standard shortcuts. The search field can be focused with Ctrl+F, and Escape closes any open panels or modals.

## Technical details

**Browser compatibility**
Works in modern browsers including Chrome, Firefox, Safari, and Edge. The code uses standard web technologies without requiring any special plugins or frameworks.

**Data handling**
Employee information is stored in the browser's local storage, so your data persists between sessions. The form validates input in real-time and prevents common errors like duplicate email addresses or invalid formats.

**Performance considerations**
Search results update as you type, but the code includes debouncing to avoid excessive processing. The interface only updates the parts of the page that actually change, keeping things responsive even with larger employee lists.

**Code structure**
The JavaScript is organized into separate classes for the dashboard and form functionality. This makes the code easier to maintain and extend. All user input is properly escaped to prevent security issues.

## Customization

**Adding departments**
To add new departments, update the dropdown options in both the form template and the filter section of the dashboard.

**Changing colors**
The CSS uses custom properties (variables) for colors, so you can easily change the theme by modifying the values at the top of the style.css file.

**Adding fields**
To add new employee fields, you'll need to update the form template, add validation logic in the JavaScript, and modify how the data is displayed on the dashboard.

## Limitations

The Freemarker templates need a proper server setup to work. For quick testing, use the HTML versions instead. The application stores data in the browser's local storage, which has size limits and only works on the same device and browser.

## 📸 Screenshots

### Dashboard View
![Dashboard]https://github.com/Abhinavhaz/Tacnique/blob/main/screenshots/EmployeeDashboard.png



 
