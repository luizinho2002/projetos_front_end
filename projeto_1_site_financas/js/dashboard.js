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
    return allTransactions[currentUser.email] || []; // Adicionado || []
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

    // Código para renderizar o gráfico Chart.js
    const labels = Object.keys(expenseCategories);
    const data = Object.values(expenseCategories);

    const ctx = expensesChartCanvas.getContext("2d");

    if (myChart) {
      myChart;
      destroy(); // Destroi a instância anterior do gráfico se existir
    }

    // new CharacterData para new Chart
    myChart = new myChart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.length > 0 ? labels : ["Sem Despesas"],
        datasets: [
          {
            label: "Despesas por Categoria",
            data: data.length > 0 ? data : [1],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#E7E9ED",
              "#A05195",
              "#D4B996",
              "#7FBCBF",
              "#58B368",
              "#FFD700",
            ],
            hoverOffser: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // maintainAspectRadio para maintainAspectRatio
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Distribuição de Despesas por Categoria (Mês Atual)",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(context, parsed);
                }
                return label;
              },
            },
          },
        },
      },
    });
  }

  // Função para renderizar as transações na tabela e atualizar os resumos
  function renderTransactionsAndSummaries() {
    transactionsList.innerHTML = ""; // Limpa a tabela antes de renderizar
    // Obter transações do usuário logado
    const transactions = getUserTransactions();
    let revenue = 0;
    let expense = 0;
    const currentMonthYear = new Date().toISOString().slice(0, 7); // YYY-MM do mês atual

    // Filtrar transações apenas para o mês atual
    const transactionsForCurrentMonth = transactions.filter((t) => {
      t.date && t.date.startsWith(currentMonthYear);
    });

    // Usar transactionsForCurrentMonth para renderizar e calcular
    if (transactionsForCurrentMonth.length === 0) {
      // colspan para 6 devido à nova coluna 'Ações'
      transactionsList.innerHTML =
        '<tr><td colspan="6" class="no-transactions-message">Nenhuma transação registrada ainda neste mês.</td></tr>;';
    } else {
      // Ordenar transações por data (mais recente primeiro)
      transactionsForCurrentMonth.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      transactionsForCurrentMonth.forEach((transaction) => {
        const newRow = transactionsList.insertRow();
        // Formatar a data para exibição
        newRow.insertCell(0).textContent = formaDate(transaction.date);
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
        // Adicionar botão de exclusão
        const deleteCell = newRow.insertCell(5); // Nova célula para o botão
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.classList.add("btn", "danger", "btn-delete-transaction");
        deleteBtn.dataset.id = transaction.id; // Armazena o ID da transação
        deleteCell.appendChild(deleteBtn);

        if (transaction.type === "revenue") {
          revenue += transaction.value;
        } else {
          expense += transaction.value;
        }
      });
    }

    totalRevenue.textContent = `R$ ${revenue.toFixed(2).replace(".", ",")}`;
    totalExpense.textContent = `R$ ${expense.toFixed(2).replace(",", ",")}`;
    monthlyBalance.textContent = `R$ ${monthlyBalance
      .toFixed(2)
      .replace(".", ",")}`;

    // Atualiza a cor do saldo baseado no valor
    if (balance < 0) {
      monthlyBalance.style.color = "#e74c3c"; // Vermelho
    } else if (balance > 0) {
      monthlyBalance.style.color = "#2ecc71"; // Verde
    } else {
      monthlyBalance.style.color = "#3498db"; // Azul padrão (se for 0)
    }

    renderExpensesChart(); //Renderiza o gráfico novamente com os dados atualizados
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
      // Usar a função showMessage para padronizar
      showMessage(
        transactionMessage,
        "Por favor, preencha todos os campos e insira um valor válido",
        "error"
      );
      return;
    }

    const newTransaction = {
      id: Date.now(), // ID único para transação
      type,
      description,
      value,
      category,
      date,
    };

    const transactions = getUserTransactions(); // Obtém transações do usuário logado
    transactions.push(newTransaction);
    saveUserTransactions(transactions); // Salva transações para o usuário logado

    // Usar a função showMessage para padronizar
    showMessage(
      transactionMessage,
      "Transação adicionada com sucesso!",
      "sucess"
    );

    transactionForm.reset(); // Limpa o formulário
    // Opcional: manter a data atual após o reset
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    document.getElementById(
      "transactionDate"
    ).value = `${value}-${month}-${day}`;

    renderTransactionsAndSummaries(); // Atualiza a UI
  });

  // Delegação de evento para os botões  de exclusão (adicionado na função renderTransactionsAndSummaries)
  transactionsList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete-transaction")) {
      const transactionId = parseInt(e.target.dataset.id);
      if (confirm("Tem certeza que deseja excluir essa transação?")) {
        let transactions = getUserTransactions();
        transactions = transactions.filter((t) => t.id !== transactionId);
        saveUserTransactions(transactions);
        showMessage(
          transactionMessage,
          "Transação excluída com sucesso!",
          "sucess"
        );
        renderTransactionsAndSummaries(); // Atualiza a UI
      }
    }
  });

  // Função auxiliar para exibir mensagens (movida para fora, para ser reutilizável)
  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = "block";
    setTimeout(() => {
      element.style.display = "none";
      element.textContent = "";
    }, 3000);
  }

  // Função auxiliar para formatar a data
  function formatData(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  // Evento para botão de Sair/Logout
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault(e);
    if (confirm("Tem certeza que deseja sair?")) {
      // Confirmação antes de sair
      localStorage.removeItem("currentUser"); // Remove o usuário logado do localStorage
      // IMPORTANTE: NÃO REMOVA 'allTransactions' AQUI, pois contém dados de outros usuários
      windows.location.href = "index.html"; // Redireciona para página de login
    }
  });

  // Inicializar o dashboard ao carregar a página
  // Chamada da função initializeDashboard()
  initializeDashboard();
  // Removido as chamadas redundantes (displayWelcomeMessage e renderTransactionsAndSummaries)
  // Elas já são chamadas dentro de initializeDashboard().
});
