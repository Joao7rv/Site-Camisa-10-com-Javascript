document.addEventListener('DOMContentLoaded', function () {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const resumoDiv = document.getElementById('resumoCarrinho');

  let subtotal = 0;

  carrinho.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
      <p><strong>${item.nome}</strong></p> 
      <p>Tamanho: ${item.tamanho}</p> 
      <p>Qtd: ${item.quantidade}</p> 
      <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
      <hr>
    `;
    resumoDiv.appendChild(itemDiv);
    subtotal += item.preco * item.quantidade;
  });

  let frete = subtotal >= 199 ? 0 : 20;
  const taxas = 5;

  let descontoPrimeiraCompra = 0;
  if (usuarioLogado && !usuarioLogado.jaComprou) {
    descontoPrimeiraCompra = subtotal * 0.10;
  }

  window.resumoValores = {
    subtotal,
    frete,
    taxas,
    descontoPrimeiraCompra,
    descontoPix: 0,
    totalFinal: 0
  };

  const resumoFinal = document.createElement('div');
  resumoFinal.id = 'resumoValoresHtml';
  resumoDiv.appendChild(resumoFinal);

  atualizarResumo();

  carregarEnderecos();
});

document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
  radio.addEventListener('change', atualizarResumo);
});

function atualizarResumo() {
  const metodo = document.querySelector('input[name="pagamento"]:checked');
  if (!metodo || !window.resumoValores) return;

  const { subtotal, frete, taxas, descontoPrimeiraCompra } = window.resumoValores;

  let descontoPix = metodo.value === 'Pix' ? (subtotal - descontoPrimeiraCompra) * 0.05 : 0;

  const total = subtotal - descontoPrimeiraCompra - descontoPix + frete + taxas;

  window.resumoValores.descontoPix = descontoPix;
  window.resumoValores.totalFinal = total;

  const resumoHtml = `
    <p><strong>Subtotal:</strong> R$ ${subtotal.toFixed(2)}</p>
    <p><strong>Desconto primeira compra:</strong> -R$ ${descontoPrimeiraCompra.toFixed(2)}</p>
    <p><strong>Desconto pagamento via Pix:</strong> -R$ ${descontoPix.toFixed(2)}</p>
    <p><strong>Frete:</strong> R$ ${frete.toFixed(2)}</p>
    <p><strong>Taxas:</strong> R$ ${taxas.toFixed(2)}</p>
    <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
  `;

  document.getElementById('resumoValoresHtml').innerHTML = resumoHtml;
}

function carregarEnderecos() {
  const listaEnderecos = document.getElementById('listaEnderecos');
  if (!listaEnderecos) return;

  const enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
  listaEnderecos.innerHTML = '';

  if (enderecos.length === 0) {
    listaEnderecos.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
    return;
  }

  enderecos.forEach((endereco, index) => {
    const div = document.createElement('div');
    div.classList.add('endereco-item');
    div.dataset.index = index;
    div.innerHTML = `
      <strong>${endereco.rua}, ${endereco.numero}</strong><br>
      ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}<br>
      CEP: ${endereco.cep}
      <button class="btn-excluir-endereco" data-index="${index}" style="margin-left:10px; color: red; border:none; background:none; cursor:pointer;">Excluir</button>
    `;

    // Selecionar endereço ao clicar na div (exceto no botão)
    div.addEventListener('click', (e) => {
      if(e.target.classList.contains('btn-excluir-endereco')) return; // Ignorar clique no botão excluir
      document.querySelectorAll('.endereco-item').forEach(item => item.classList.remove('selected'));
      div.classList.add('selected');
      localStorage.setItem('enderecoSelecionado', JSON.stringify(endereco));
    });

    listaEnderecos.appendChild(div);
  });

  // Marca o endereço previamente selecionado, se houver
  const enderecoSelecionado = JSON.parse(localStorage.getItem('enderecoSelecionado'));
  if (enderecoSelecionado) {
    document.querySelectorAll('.endereco-item').forEach(div => {
      const idx = div.dataset.index;
      const end = JSON.parse(localStorage.getItem('enderecos'))[idx];
      if (JSON.stringify(end) === JSON.stringify(enderecoSelecionado)) {
        div.classList.add('selected');
      }
    });
  }

  // Adiciona eventos para os botões "Excluir"
  document.querySelectorAll('.btn-excluir-endereco').forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation(); // Para não ativar seleção
      const idx = Number(botao.dataset.index);
      removerEndereco(idx);
    });
  });
}

// Função para remover endereço por índice
function removerEndereco(index) {
  let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
  enderecos.splice(index, 1); // Remove o endereço do array
  localStorage.setItem('enderecos', JSON.stringify(enderecos));

  // Se o endereço selecionado foi removido, limpa seleção
  const enderecoSelecionado = JSON.parse(localStorage.getItem('enderecoSelecionado'));
  if (enderecoSelecionado && index === enderecos.findIndex(e => JSON.stringify(e) === JSON.stringify(enderecoSelecionado))) {
    localStorage.removeItem('enderecoSelecionado');
  }

  carregarEnderecos(); // Atualiza lista
}

const formEndereco = document.getElementById('formEndereco');
if (formEndereco) {
  formEndereco.addEventListener('submit', function(event) {
    event.preventDefault();

    const novoEndereco = {
      rua: document.getElementById('rua').value.trim(),
      numero: document.getElementById('numero').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      cidade: document.getElementById('cidade').value.trim(),
      estado: document.getElementById('estado').value.trim(),
      cep: document.getElementById('cep').value.trim(),
    };

    let enderecos = JSON.parse(localStorage.getItem('enderecos')) || [];
    enderecos.push(novoEndereco);
    localStorage.setItem('enderecos', JSON.stringify(enderecos));

    formEndereco.reset();
    carregarEnderecos();
  });
}

document.getElementById('formPagamento').addEventListener('submit', function (event) {
  event.preventDefault();

  const enderecoSelecionado = localStorage.getItem('enderecoSelecionado');
  if (!enderecoSelecionado) {
    alert('Por favor, selecione um endereço de entrega.');
    return;
  }

  const metodo = document.querySelector('input[name="pagamento"]:checked').value;

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuarioLogado) {
    usuarioLogado.jaComprou = true;
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
  }

  alert(`Pagamento com ${metodo} confirmado! Obrigado pela sua compra!\n\nEndereço de entrega:\n${JSON.parse(enderecoSelecionado).rua}, ${JSON.parse(enderecoSelecionado).numero} - ${JSON.parse(enderecoSelecionado).bairro}`);

  localStorage.removeItem('carrinho');
  localStorage.removeItem('enderecoSelecionado');
  window.location.href = "index.html";
});


