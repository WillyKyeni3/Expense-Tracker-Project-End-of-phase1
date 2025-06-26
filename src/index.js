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
  setupEventListeners();
});

// fetch expenses from localStorage
function loadExpenses() {
    fetch('http://localhost:3000/expenses')
    .then(response => response.json())
    .then(expenses => {
        allExpenses = expenses;
        renderExpenses(allExpenses);
        renderChart(allExpenses);
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
        expenseList.innerHTML = '<li>No expenses found.</li>';
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
            <div class="actions">
            <button class="edit-btn" title="Edit"><i class='bx bx-edit'></i></button>
            <button class="delete-btn" title="Delete"><i class='bx bx-trash'></i></button>
            </div>
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
        renderChart(allExpenses); 
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

// Chart.js integration
function renderChart(expenses) {
    // Aggregate expenses by category
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    // Destroy existing chart if it exists
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    // Create new chart
    const ctx = expenseChartCanvas.getContext('2d');
  window.expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b', '#f44336', '#9c27b0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        title: { display: true, text: 'Spending Breakdown' }
      }
    }
  });
}

// Dark mode toggle
function setupDarkMode() {
  const icon = darkModeToggle.querySelector('i');
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update icon or add visual feedback
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('bx-moon');
      icon.classList.add('bx-sun');
    } else {
      icon.classList.remove('bx-sun');
      icon.classList.add('bx-moon');
    }
  });
}

// setup event listeners
function setupEventListeners() {
    // Handle form submission
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

      const newExpense = {
      amount: parseFloat(document.getElementById('amount').value),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value,
      date: document.getElementById('date').value
    };
    
    addExpense(newExpense);
    })

    // Handle category filter change: To be uncommented after fix
  categoryFilter.addEventListener('change', filterExpenses);
  startDateFilter.addEventListener('change', filterExpenses);
  endDateFilter.addEventListener('change', filterExpenses);

    // Handle reset filters button
    resetFiltersBtn.addEventListener('click', resetFilters);

    // Setup dark mode toggle
    setupDarkMode();
}