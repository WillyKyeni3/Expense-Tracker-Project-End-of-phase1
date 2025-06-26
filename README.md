# 💸 Expense Tracker

A simple web application to track your daily expenses, visualize spending by category, and manage your budget.

## Features

- **Add Expenses:** Enter amount, category, description, and date.
- **Edit & Delete:** Update or remove any expense.
- **Filter:** Filter expenses by category and date range.
- **Reset Filters:** Quickly clear all filters.
- **Spending Chart:** Visual breakdown of spending by category (powered by Chart.js).
- **Dark Mode:** Toggle between light and dark themes.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [json-server](https://github.com/typicode/json-server) for the mock backend

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WillyKyeni3/Expense-Tracker-Project-End-of-phase1
   cd expense-tracker
   ```

2. **Install json-server globally (if not already):**
   ```
    npm install -g json-server
    ```

3. **Start the backend server:**
    ```bash
    json-server --watch db.json --port 3001
    ```

4. **IOpen index.html in your browser.**
   ```explorer.exe index.html # For Windows
   open index.html # For macOS/Linux
    ```

5. **Or **
- Click the github link to view the live demo: [Live Demo](https://willykyeni3.github.io/Expense-Tracker-Project-End-of-phase1/)

### Project Structure
.
├── [db.json](http://_vscodecontentref_/1)              # Mock database for expenses
├── [index.html](http://_vscodecontentref_/2)           # Main HTML file
├── Css/
│   └── [style.css](http://_vscodecontentref_/3)        # Stylesheet
├── src/
│   └── [index.js](http://_vscodecontentref_/4)         # Main JavaScript logic
└── [README.md](http://_vscodecontentref_/5)            # Project documentation

### Credits
- `Chart.js` for charts
- `Boxicons` for icons

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.