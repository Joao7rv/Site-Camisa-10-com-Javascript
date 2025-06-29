let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];


  document.getElementById('adicionarCarrinho').addEventListener('click', function() {
    const nomeProduto = document.querySelector('.info_prod h1').innerText;
    
    const precoTexto = document.querySelector('.info_prod p').innerText;
    const precoLimpo = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));
    
    const quantidade = parseInt(document.getElementById('quantidade').value);

    const tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked').nextElementSibling.innerText;

    let imagemSelecionada = '';
  if(document.getElementById('img1').checked) imagemSelecionada = document.getElementById('imagem1').src;

    const item = {
      imagem: imagemSelecionada,
      nome: nomeProduto,
      preco: precoLimpo,
      quantidade: quantidade,
      tamanho: tamanhoSelecionado
    };

    carrinho.push(item);

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    console.log(carrinho);  
    alert(`Adicionado: ${quantidade}x ${nomeProduto} - Tamanho: ${tamanhoSelecionado}`);
  });