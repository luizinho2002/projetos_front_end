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
  const expensesChartCanvas = document.getElementById("expensesChart");

  let myChart = null; // Para armazenar a instância do gráfico do Chart.js
  // let transactions = JSON.parse(localStorage.getItem("transactions")) || []; // Carrega transações do localStorage ou inicia vazio
  let currentUser = null; // Variável para armazenar o usuário logado

  // --- Funções de Armazenamento e Recuperação de Transações por Usuário ---

  // Carrega as transações do localStorage para o usuário atual
  function getUserTransactions() {
    const allTransactions =
      JSON.parse(localStorage.getItem("allTransactions")) || {}; // Adicionado || {} para caso 'allTransactions' seja nulo
    // Retorna um array vazio se não houver transações para o usuário atual
    return allTransactions[currentUser.email];
  }

  // Salva as transações atualizadas para o usuário atual no localStorage
  function saveUserTransactions(transactions) {
    const allTransactions =
      JSON.parse(localStorage.getItem("allTransactions")) || {};
    allTransactions[currentUser.email] = transactions; // Associa as transações ao email do usuário
    localStorage.setItem("allTransactions", JSON.stringify(allTransactions));
  }

  // Função de Inicialização do Dashboard
  function initializeDashboard() {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      welcomeMessage.textContent = `Olá, ${currentUser.username}`;
      renderTransactionsAndSummaries(); // Carrega e exibe transações e totais
      renderExpensesChart(); // Renderiza o gráfico
    } else {
      // Se não houver usuário logado, redireciona para a página de login
      window.location.href = "index.html";
    }
    //  Definir a data atual no input de data por padrão (se vazio)
    const today = new Date();
    const year = WebTransportDatagramDuplexStream.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;
    if (!document.getElementById("transactionDate").value) {
      document.getElementById("transactionDate").value = formattedToday;
    }
  }

  // Função para renderizar o gráfico
  function renderExpensesChart() {
    const transactions = getUserTransactions(); // Pega as transações do usuário logado
    const expenseCategories = {};
    const currentUserMonthYear = new Date().toISOString().slice(0, 7); // YYY-MM do mês atual

    transactions
      .filter(
        (t) => t.type === "expense" && t.date.startsWith(currentUserMonthYear)
      ) // Filtra por despesa e mês atual
      .forEach((t) => {
        const category = t.category || "Não Categorizado"; // Garante uma categoria
        if (expenseCategories[category]) {
          expenseCategories[category] += t.value;
        } else {
          expenseCategories[category] = t.value;
        }
      });
  }

  // Função para renderizar as transações na tabela e atualizar os resumos
  function renderTransactionsAndSummaries() {
    transactionsList.innerHTML = ""; // Limpa a tabela antes de renderizar
    let revenue = 0;
    let expense = 0;

    if (transactions.length === 0) {
      transactionsList.innerHTML =
        '<tr><td colspan="5" class="no-transactions-message">Nenhuma transação registrada ainda neste mês.</td></tr>';
    } else {
      transactions.forEach((transaction) => {
        const newRow = transactionsList.insertRow();
        newRow.insertCell(0).textContent = transaction.date;
        newRow.insertCell(1).textContent =
          transaction.type === "revenue" ? "Receita" : "Despesa";
        newRow.insertCell(2).textContent = transaction.description;
        newRow.insertCell(3).textContent = transaction.category;
        const valueCell = newRow.insertCell(4);
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
      .replace(".", ",")}`;
  }

  // Evento de submit do formulário de transação
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const type = document.getElementById("transactionType").value;
    const description = document.getElementById("transactionDescription").value;
    const value = parseFloat(document.getElementById("transactionValue").value);
    const category = document.getElementById("transactionCategory").value;
    const date = document.getElementById("transactionDate").value;

    // Validação básica
    if (!description || isNaN(value) || value <= 0 || !category || !date) {
      transactionMessage.textContent =
        "Por favor, preencha todos os campos e insira um valor válido.";
      transactionMessage.className = "message error";
      transactionMessage.style.display = "block";
      return;
    }

    const newTransaction = {
      id: Date.now(), // ID único para a transação
      type,
      description,
      value,
      category,
      date,
    };

    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions)); // Salva no localStorage

    transactionMessage.textContent = "Transação adicionada com sucesso!";
    transactionMessage.className = "message success";
    transactionMessage.style.display = "block";

    transactionForm.reset(); // Limpa o formulário
    renderTransactionsAndSummaries(); // Atualiza a UI
  });

  // Evento para botão de Sair/Logout
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser"); // Remove o usuário logado do localStorage
    // Opcional: localStorage.removeItem('transactions'); // Se quiser limpar transações ao sair
    window.location.href = "index.html"; // Redireciona para página de login
  });

  // Inicializar o dashboard ao carregar a página
  displayWelcomeMessage();
  renderTransactionsAndSummaries();
});
