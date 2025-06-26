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

// Fetch all expenses from JSON Server
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
      expenseList.innerHTML = '<li>Error loading expenses</li>';
    });
}

// Render expense list
function renderExpenses(expenses) {
  expenseList.innerHTML = '';
  
  if (expenses.length === 0) {
    expenseList.innerHTML = '<li>No expenses found</li>';
    return;
  }

  expenses.forEach(expense => {
    const li = document.createElement('li');
    li.className = 'expense-item';
    li.dataset.id = expense.id;
    
    // Color code categories
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
      <div class="date">${expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</div>
      <div class="actions">
        <button class="edit-btn" title="Edit"><i class='bx bx-edit'></i></button>
        <button class="delete-btn" title="Delete"><i class='bx bx-trash'></i></button>
      </div>
    `;
    
    expenseList.appendChild(li);
  });
}

// Add new expense
function addExpense(expense) {
  fetch('http://localhost:3000/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  // Aggregate data by category
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

// Save updated expense
function saveExpense(expenseId, updatedData, expenseItem) {
  fetch(`http://localhost:3000/expenses/${expenseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      return response.json();
    })
    .then(updatedExpense => {
      // Update local state by finding the item and replacing it
      const index = allExpenses.findIndex(e => e.id === expenseId);
      if (index !== -1) {
        allExpenses[index] = updatedExpense;
      }
      
      // Re-render the entire list and chart with the updated data
      // This is much simpler and avoids bugs with manual DOM manipulation
      // and event listener re-attachment.
      renderExpenses(allExpenses);
      renderChart(allExpenses);
    })
    .catch(error => {
      console.error('Error saving expense:', error);
      alert('Failed to save changes. Please try again.');
    });
}

// Delete expense
function deleteExpense(expenseId, expenseItem) {
  fetch(`http://localhost:3000/expenses/${expenseId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }
      return response.json();
    })
    .then(() => {
      // Remove from local state
      allExpenses = allExpenses.filter(e => e.id !== expenseId);
      
      // Remove from DOM
      if (expenseItem && expenseItem.parentNode) {
        expenseItem.parentNode.removeChild(expenseItem);
      }
      
      // Update chart
      renderChart(allExpenses);
    })
    .catch(error => {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    });
}

// Make expense item editable
function makeEditable(expenseItem, expenseId) {
  const originalExpense = allExpenses.find(e => e.id === expenseId);
  if (!originalExpense) return;
  
  // Add edit mode class
  expenseItem.classList.add('edit-mode');
  
  // Create edit form
  const form = document.createElement('form');
  form.className = 'edit-form';
  
  form.innerHTML = `
    <input type="number" value="${originalExpense.amount}" required>
    <select>
      <option value="Food" ${originalExpense.category === 'Food' ? 'selected' : ''}>Food</option>
      <option value="Housing" ${originalExpense.category === 'Housing' ? 'selected' : ''}>Housing</option>
      <option value="Entertainment" ${originalExpense.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
      <option value="Transportation" ${originalExpense.category === 'Transportation' ? 'selected' : ''}>Transportation</option>
      <option value="Utilities" ${originalExpense.category === 'Utilities' ? 'selected' : ''}>Utilities</option>
    </select>
    <input type="text" value="${originalExpense.description}" required>
    <input type="date" value="${originalExpense.date}" required>
    
    <div class="edit-actions">
      <button type="submit" class="save-btn"><i class='bx bx-save'></i></button>
      <button type="button" class="cancel-btn"><i class='bx bx-x'></i></button>
    </div>
  `;
  
  // Replace content with form
  expenseItem.innerHTML = '';
  expenseItem.dataset.id = expenseId;
  expenseItem.appendChild(form);
  
  // Handle Save
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const inputs = form.querySelectorAll('input');
    const category = form.querySelector('select').value;
    
    const updatedExpense = {
      amount: parseFloat(inputs[0].value),
      category: category,
      description: inputs[1].value,
      date: inputs[2].value
    };
    
    saveExpense(expenseId, updatedExpense, expenseItem);
  });
  
  // Handle Cancel
  const cancelBtn = form.querySelector('.cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      renderExpenses(allExpenses);
    });
  }
}

// Dark mode toggle
function setupDarkMode() {
  const icon = darkModeToggle.querySelector('i');
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update icon
    if (document.body.classList.contains('dark-mode')) {
      icon.classList.remove('bx-moon');
      icon.classList.add('bx-sun');
    } else {
      icon.classList.remove('bx-sun');
      icon.classList.add('bx-moon');
    }
  });
}

// Setup all event listeners
function setupEventListeners() {
  // Form submission
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newExpense = {
      amount: parseFloat(document.getElementById('amount').value),
      category: document.getElementById('category').value,
      description: document.getElementById('description').value,
      date: document.getElementById('date').value
    };
    
    addExpense(newExpense);
  });

  // Filter events
  categoryFilter.addEventListener('change', filterExpenses);
  startDateFilter.addEventListener('change', filterExpenses);
  endDateFilter.addEventListener('change', filterExpenses);

  // Reset button
  resetFiltersBtn.addEventListener('click', resetFilters);

  // Dark mode
  setupDarkMode();
}

// Setup event listeners for dynamic elements
function setupDynamicEventListeners() {
  // Delegated event listener for edit/delete
  expenseList.addEventListener('click', (e) => {
    // e.preventDefault();
    const expenseItem = e.target.closest('.expense-item');
    if (!expenseItem) return;

    const expenseId = expenseItem.dataset.id; //parseIntparseInt
    
    // Handle Edit Button
    if (e.target.closest('.edit-btn')) {
      makeEditable(expenseItem, expenseId);
    }
    
    // Handle Delete Button
    if (e.target.closest('.delete-btn')) {
      if (confirm('Delete this expense?')) {
        deleteExpense(expenseId, expenseItem);
      }
    }
  });
}

// Call dynamic event listeners
setupDynamicEventListeners();