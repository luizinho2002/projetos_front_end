document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos HTML
  const welcomeMessage = document.getElementById("welcomeMessage");
  const logoutBtn = document.getElementById("logoutBtn");
  const transactionForm = document.getElementById("transactionForm");
  const transactionMessage = document.getElementById("transactionMessage");
  const transactionsList = document.getElementById("transactionsList");
  const totalRevenue = document.getElementById("totalRevenue");
  const totalExpense = document.getElementById("totalExpense");
  const monthlyBalance = document.getElementById("monthlyBalance");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || []; // Carrega transações do localStorage ou inicia vazio

  // Função para exibir o nome do usuário
  function displayWelcomeMessage() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.username) {
      welcomeMessage.textContent = `Olá, ${currentUser.username}!`;
    } else {
      welcomeMessage.textContent = `Olá!`;
      // Redireciona se não houver usuário logado (opcional, dependendo dua sua lógica de auth)
      // window.location.href = `index.html`;
    }
  }

  // Função para renderizar as transações na tabela e atualizar os resumos
  function renderTransactionsAndSummaries() {
    transactionsList.innerHTML = ""; // Limpa a tabela antes de renderizar
    let revenue = 0;
    let expense = 0;

    if (transactions.length === 0) {
      transactionsList.innetHTML =
        '<tr><td colspan="5" class="no-transactions-message">Nenhuma transação registrada ainda neste mês.</td></tr>';
    } else {
      transactions.forEach((transaction) => {
        const newRow = transactionsList.insertRow();
        newRow.insertCell(0).textContent = transaction.date;
        newRow.insertCell(1).textContent =
          transaction.type === "revenue" ? "Receita" : "Despesa";
        newRow.insertCell(2).textContent = transaction.description;
        newRow.insertCell(3).textContent = transaction.category;
        const valueCell = newRow.insetCell(4);
        valueCell.textContent = `R$ ${transaction.value
          .toFixed(2)
          .replace(".", ",")}`;
        valueCell.classList.add(
          transaction.type === "revenue"
            ? "transaction-type-revenue"
            : "transaction-type-expense"
        );
        if (transaction.type === "revenue") {
          revenue += transaction.value;
        } else {
          expense += transaction.value;
        }
      });
    }

    totalRevenue.textContent = `R$ ${revenue.toFixed(2).replace(".", ",")}`;
    totalExpense.textContent = `R$ ${expense.toFixed(2).replace(".", ",")}`;
    monthlyBalance.textContent = `R$ ${(revenue - expense)
      .toFixed(2)
      .replace(".", "-")}`;
  }
});
