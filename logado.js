document.addEventListener('DOMContentLoaded', function() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const header = document.querySelector('header');

  if (usuarioLogado && usuarioLogado.nome) {
    const divUsuario = document.createElement('div');
    divUsuario.classList.add('usuario-logado');
    divUsuario.innerHTML = `
      <p>👋 Olá, ${usuarioLogado.nome}!</p>
      <button id="logout" class="btn-logout">Sair</button>  <!-- Adicionei a classe aqui -->
    `;
    header.appendChild(divUsuario);

    document.getElementById('logout').addEventListener('click', function() {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('carrinho');  
      window.location.href = 'index.html';  
    });
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = 'login.html';
    loginLink.textContent = 'Login';
    loginLink.classList.add('btn-login');  
    header.appendChild(loginLink);
  }
});
