let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let total = 0;

// Page load होताच saved data show कर
window.onload = function () {
  expenses.forEach(exp => {
    addExpenseToUI(exp.amount, exp.category, exp.date);
    total += Number(exp.amount);
    updateChart();
  });
  document.getElementById("totalAmount").innerText = total;
   
  if(localStorage.getItem("theme") === "dark")
  {
    document.getElementById("themeToggle").innerText = "☀️ Light Mode";
  }
};

function addExpense() {
  let amount = document.getElementById("amount").value;
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  if (amount === "" || category === "" || date === "") {
    alert("Please fill all fields");
    return;
  }

  let expense = { amount, category, date };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  addExpenseToUI(amount, category, date);

  total += Number(amount);
  document.getElementById("totalAmount").innerText = total;

  // Clear inputs
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("date").value = "";
  updateChart();
}

function addExpenseToUI(amount, category, date) {
  let expenseList = document.getElementById("expenseList");
  let li = document.createElement("li");

  li.innerHTML = `
    <span>${date} - ${category}</span>
    <span>
      ₹${amount}
      <button class="delete-btn" onclick="deleteExpense(this, ${amount}, '${date}')">❌</button>
    </span>
  `;

  expenseList.appendChild(li);
}

function deleteExpense(button, amount, date) {
  let li = button.parentElement.parentElement;
  li.remove();

  total -= Number(amount);
  document.getElementById("totalAmount").innerText = total;

  // Remove from localStorage
  expenses = expenses.filter(exp => !(exp.amount == amount && exp.date == date));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
function filterByMonth() {
  let selectedMonth = document.getElementById("monthFilter").value;
  let expenseList = document.getElementById("expenseList");

  expenseList.innerHTML = "";
  total = 0;

  expenses.forEach(exp => {
    let expenseMonth = exp.date.split("-")[1]; // MM

    if (selectedMonth === "" || expenseMonth === selectedMonth) {
      addExpenseToUI(exp.amount, exp.category, exp.date);
      total += Number(exp.amount);
    }
    updateChart(
        selectedMonth === ""
          ? expenses
          : expenses.filter(exp => exp.date.split(".")[1] === selectedMonth)
    );
  });

  document.getElementById("totalAmount").innerText = total;
}
let chart;

function updateChart(filteredExpenses = expenses) {
  let food = 0, travel = 0, study = 0, other = 0;

  filteredExpenses.forEach(exp => {
    if (exp.category === "Food") food += Number(exp.amount);
    else if (exp.category === "Travel") travel += Number(exp.amount);
    else if (exp.category === "Study") study += Number(exp.amount);
    else other += Number(exp.amount);
  });

  let data = [food, travel, study, other];

  if (chart) {
    chart.destroy();
  }

  let ctx = document.getElementById("expenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Food", "Travel", "Study", "Other"],
      datasets: [{
        data: data,
        backgroundColor: ["#f87171", "#60a5fa", "#34d399", "#fbbf24"]
      }]
    }
  });
}
// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");

  if (document.documentElement.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    document.getElementById("themeToggle").innerText = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    document.getElementById("themeToggle").innerText = "🌙 Dark Mode";
  }
}