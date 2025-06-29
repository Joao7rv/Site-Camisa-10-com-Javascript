document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.barra-pesquisa form');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const input = form.querySelector('input[name="q"]');
    let termo = input.value.trim().toLowerCase();

    function removeAcentos(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    termo = removeAcentos(termo);

    const produtos = [
      { palavras: ["argentina", "camisa argentina"], link: "camisa_argentina.html" },
      { palavras: ["espanha", "camisa espanha"], link: "camisa_espanha.html" },
      { palavras: ["brasil", "camisa brasil", "camisa da selecao brasil"], link: "camisa_brasil.html" },
      { palavras: ["botafogo", "camisa botafogo"], link: "camisa_botafogo.html" },
      { palavras: ["santos", "camisa santos"], link: "camisa_santos.html" },
      { palavras: ["chuteira", "phantom", "chuteira nike"], link: "page_chuteira.html" },
      { palavras: ["tenis nike", "vapor max", "nike air"], link: "page_tenis.html" },
      { palavras: ["tenis olympikus", "corre 3", "olympikus"], link: "page_tenis2.html" },
      { palavras: ["bola", "ucl", "bola ucl"], link: "page_bola.html" },
      { palavras: ["bone", "boné", "bone nike"], link: "page_bone.html" }
    ];

    let encontrado = false;

    produtos.forEach(produto => {
      produto.palavras.forEach(palavra => {
        if (termo.includes(removeAcentos(palavra))) {
          window.location.href = produto.link;
          encontrado = true;
        }
      });
    });

    if (!encontrado) {
      alert("Produto não encontrado. Tente usar um nome diferente.");
    }
  });
});



