document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos HTML
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showLoginBtn = document.getElementById("showLogin");
  const showRegisterBtn = document.getElementById("showRegister");
  const loginMessage = document.getElementById("loginMessage");
  const registerMessage = document.getElementById("registerMessage");

  //  Funções para alternar entre os formulários
  function showForm(formToShow, formToHide, activeBtn, inactiveBtn) {
    formToShow.classList.add("active");
    formToShow.classList.remove("hidden");
    formToHide.classList.remove("active");
    formToHide.classList.add("hidden");

    activeBtn.classList.add("active");
    inactiveBtn.classList.remove("active");

    // Limpa mensagens ao alternar
    loginMessage.style.display = "none";
    registerMessage.style.display = "none";
  }

  //  Event Listeners para os botões de alternar
  showLoginBtn.addEventListener("click", () => {
    showForm(loginForm, registerForm, showLoginBtn, showRegisterBtn);
  });

  showRegisterBtn.addEventListener("click", () => {
    showForm(registerForm, loginForm, showRegisterBtn, showLoginBtn);
  });

  // ---- Lógica de Cadastro ----
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    const username = registerForm.elements["registerName"].value;
    const email = registerForm.elements["registerEmail"].value;

    const password = registerForm.elements["registerPassword"].value;

    const confirmPassword =
      registerForm.elements["registerConfirmPassword"].value;

    // Validação básica
    if (!username || !email || !password || !confirmPassword) {
      registerMessage.textContent = "Por favor, preencha todos os campos.";
      registerMessage.className = "message error";
      registerMessage.style.display = "block";
      return;
    }

    // Validação para verificar se as senhas coincidem
    if (password !== confirmPassword) {
      registerMessage.textContent = "As senhas não coincidem.";
      registerMessage.className = "message error";
      registerMessage.style.display = "block";
      return;
    }

    // Carregar usuários existentes (ou array vazio se não houver)
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar se o email está cadastrado
    if (users.some((user) => user.email === email)) {
      registerMessage.textContent = "Este e-mail já está cadastrado";
      registerMessage.className = "message error";
      registerMessage.style.display = "block";
      return;
    }

    // Adicionar novo usuário
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users)); // Salvar no localStorage

    registerMessage.textContent = "Cadastro realizado com sucesso! Faça login.";
    registerMessage.className = "message success";
    registerMessage.style.display = "block";

    registerForm.reset(); // Limpa o formulário

    //   Opcional: Redirecionar automaticamente para a tela de login após o cadastro
    setTimeout(() => {
      showForm(loginForm, registerForm, showLoginBtn, showRegisterBtn);
      loginForm.elements["loginEmail"].value = email; // Preenche o email para conveniência
    }, 1500);
  });

  // ---- Lógica de Login ----
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    const email = loginForm.elements["loginEmail"].value;
    const password = loginForm.elements["loginPassword"].value;

    // Carregar usuários
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Encontrar usuário
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      loginMessage.textContent = "Login bem-sucedido!";
      loginMessage.className = "message success";
      loginMessage.style.display = "block";

      // *** CRÍTICO: SALVAR O USUÁRIO LOGADO NO localStorage ***
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ username: foundUser.username, email: foundUser.email })
      );

      // Redirecionar para o dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000); // Pequeno atraso para a mensagem de sucesso aparecer
    } else {
      loginMessage.textContent = "E-mail ou senha incorretos";
      loginMessage.className = "message error";
      loginMessage.style.display = "block";
    }
  });

  // Inicializa a exibição do formulário de login no carregamento
  showForm(loginForm, registerForm, showLoginBtn, showRegisterBtn);

  // Verifica se já há um usuário logado (ex: se o usuário voltar para index.html pelo botão "voltar" do navegador)
  // Se quiser que o usuário seja redirecionado automaticamente para o dashboard se já estiver logado
  // const currentUser = localStorage.getItem('currentUser');
  // if (currentUser) {
  //     window.location.href = 'dashboard.html';
  // }
});
