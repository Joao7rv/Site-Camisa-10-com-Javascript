function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const contadorElem = document.getElementById('contadorCarrinho');
  if (contadorElem) {
    contadorElem.textContent = carrinho.length;
  }
}

document.addEventListener('DOMContentLoaded', atualizarContadorCarrinho);
