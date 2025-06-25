// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expenses');
const expenseChartCanvas = document.getElementById('expense-chart');
const categoryFilter = document.getElementById('category-filter');
const startDateFilter = document.getElementById('start-date-filter');
const endDateFilter = document.getElementById('end-date-filter');
const resetFiltersBtn = document.getElementById('reset-filters');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// State to hold all expenses
let allExpenses = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadExpenses();
//   setupEventListeners();
});

// fetch expenses from localStorage
function loadExpenses() {
    fetch('http://localhost:3000/expenses')
    .then(response => response.json())
    .then(expenses => {
        allExpenses = expenses;
        renderExpenses(allExpenses);
        // renderChart(allExpenses);
    })
    .catch(error => {
        console.error('Error loading expenses:', error);
        expenseList.innerHTML = '<p>Error loading expenses. Please try again later.</p>';
    });
}

// render expenses in the list
function renderExpenses(expenses) {
    expenseList.innerHTML = '';
    if (expenses.length === 0) {
        expenseList.innerHTML = '<p>No expenses found.</p>';
        return;
    }
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item';

        //Color code categories
        const categoryColors = {
            Food: '#e0f7fa',
            Housing: '#fff8e1',
            Entertainment: '#fce4ec',
            Transportation: '#efefer',
            Utilities: '#e8f5e9'
        };

        li.style.backgroundColor = categoryColors[expense.category] || '#f5f5f5';

        li.innerHTML = `
            <div class="amount">KE ${expense.amount.toFixed(2)}</div>
            <div class="category-tag">${expense.category}</div>
            <div class="description">${expense.description}</div>
            <div class="date">${new Date(expense.date).toLocaleDateString()}</div>
    `;
        expenseList.appendChild(li);
    });
}

// Add new expense POST request
function addExpense(expense) {
    fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(expense)
    })
    .then(response => response.json())
    .then(createdExpense => {
        allExpenses.unshift(createdExpense);
        renderExpenses(allExpenses);
        // renderChart(allExpenses); uncomment when chart is implemented
        expenseForm.reset();
    })
    .catch(error => {
        console.error('Error adding expense:', error);
        // alert('Failed to add expense. Please try again.');
    });
}

// Filter expenses
function filterExpenses() {
  const category = categoryFilter.value;
  const startDate = startDateFilter.value;
  const endDate = endDateFilter.value;

  let filtered = [...allExpenses];

  if (category !== 'all') {
    filtered = filtered.filter(e => e.category === category);
  }

  if (startDate) {
    filtered = filtered.filter(e => e.date >= startDate);
  }

  if (endDate) {
    filtered = filtered.filter(e => e.date <= endDate);
  }

  renderExpenses(filtered);
  renderChart(filtered);
}

// Reset filters
function resetFilters() {
  categoryFilter.value = 'all';
  startDateFilter.value = '';
  endDateFilter.value = '';
  renderExpenses(allExpenses);
  renderChart(allExpenses);
}