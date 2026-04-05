let carrinho = {};
let total = 0;

function adicionar(nome, preco) {
    if (carrinho[nome]) {
        carrinho[nome].quantidade++;
    } else {
        carrinho[nome] = {
            preco: preco,
            quantidade: 1
        };
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    total = 0;

    for (let produto in carrinho) {
        let item = carrinho[produto];

        let li = document.createElement("li");

        li.innerHTML = `
            ${produto} (x${item.quantidade}) - R$ ${item.preco * item.quantidade}
            <button onclick="remover('${produto}')">🗑️</button>
        `;

        lista.appendChild(li);

        total += item.preco * item.quantidade;
    }

    document.getElementById("total").innerText = total;
}

function finalizarCompra() {
    let nome = document.getElementById("nomeCliente").value.trim();

    if (nome === "") {
        abrirModalErro();
        return;
    }

    let mensagem = `🩺 *Pedido - Loja Médica*\n\n`;
    mensagem += `👤 Cliente: ${nome}\n\n`;
    mensagem += `📦 *Itens:*\n`;

    for (let produto in carrinho) {
        let item = carrinho[produto];
        mensagem += `- ${produto} (x${item.quantidade}) = R$ ${item.preco * item.quantidade}\n`;
    }

    mensagem += `\n💰 *Total: R$ ${total}*`;

    let telefone = "5599999999999";

    let url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

    fetch("/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cliente: nome,
            itens: carrinho,
            total: total
        })
    });
}

function remover(produto) {
    delete carrinho[produto];
    atualizarCarrinho();
}

function abrirModal() {
    document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

function confirmarLimpar() {
    carrinho = {};
    total = 0;
    atualizarCarrinho();
    document.getElementById("nomeCliente").value = "";
    fecharModal();
}

function abrirModalErro() {
    document.getElementById("modalErro").style.display = "flex";
}

function fecharModalErro() {
    document.getElementById("modalErro").style.display = "none";
}