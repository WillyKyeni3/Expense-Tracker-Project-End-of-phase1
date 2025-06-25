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