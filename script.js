// 1. Inicializar Animações (AOS)
AOS.init({
    duration: 800, // duração da animação em ms
    once: true,    // anima apenas uma vez ao descer
});


// 3. Lógica da Calculadora
const precos = {
    'guarda-roupa-3': { nome: 'Guarda-Roupa 3P', preco: 90 },
    'guarda-roupa-6': { nome: 'Guarda-Roupa 6P', preco: 180 },
    'cama-casal': { nome: 'Cama Casal', preco: 80 },
    'mesa-jantar': { nome: 'Mesa Jantar', preco: 70 },
    'painel-tv': { nome: 'Painel TV', preco: 60 },
    'comoda': { nome: 'Cômoda', preco: 50 },
    'armario-cozinha': { nome: 'Armário Coz.', preco: 60 }
};

function formatarMoeda(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// Máscara aprimorada para o campo de WhatsApp
const inputZap = document.getElementById('clienteZap');

inputZap.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número

    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (v.length > 11) v = v.substring(0, 11);

    // Aplica a formatação dinamicamente
    if (v.length > 10) {
        // Formato (XX) XXXXX-XXXX
        v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (v.length > 5) {
        // Formato (XX) XXXX-XXXX (para fixos ou enquanto digita)
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (v.length > 2) {
        // Formato (XX) XXXX
        v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.length > 0) {
        // Formato (XX
        v = v.replace(/^(\d{0,2})/, "($1");
    }

    e.target.value = v;
    renderizarLista();
});

// Validação simples de E-mail
function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email); // Verifica formato usuario@dominio.com
}

// Atualiza o resumo ao digitar nos outros campos
document.getElementById('clienteNome').addEventListener('input', renderizarLista);
document.getElementById('clienteEmail').addEventListener('input', renderizarLista);

// 1. Inicializar Animações (AOS)
AOS.init({ duration: 800, once: true });

// 2. Inicializar Carrossel (Swiper)
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1, spaceBetween: 30, loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    breakpoints: { 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    autoplay: { delay: 3000, disableOnInteraction: false }
});

// 3. Lógica da Lista (Sem Preços Visíveis)
const moveis = {
    'guarda-roupa-3': 'Guarda-Roupa 3P',
    'guarda-roupa-6': 'Guarda-Roupa 6P',
    'cama-casal': 'Cama Casal',
    'mesa-jantar': 'Mesa Jantar',
    'painel-tv': 'Painel TV',
    'comoda': 'Cômoda',
    'armario-cozinha': 'Armário Coz.'
};

let itens = [];

function removerItem(index) {
    itens.splice(index, 1);
    renderizarLista();
}
function renderizarLista() {
    const lista = document.getElementById('listaItens');
    const totalEl = document.getElementById('valorTotal');
    const nome = document.getElementById('clienteNome').value;
    const email = document.getElementById('clienteEmail').value;
    const zap = document.getElementById('clienteZap').value.replace(/\D/g, "");

    lista.innerHTML = '';

    if (itens.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-center text-muted py-4 bg-transparent border-dashed">Nenhum item adicionado ainda.</li>';
        totalEl.classList.add('blur-text');
        totalEl.innerText = "R$ 000,00";
    } else {
        itens.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center bg-transparent';
            li.innerHTML = `
                <div><span class="fw-bold">${item.qtd}x</span> ${item.nome}</div>
                <button onclick="removerItem(${index})" class="btn btn-sm btn-outline-danger border-0"><i class="fa-solid fa-trash"></i></button>
            `;
            lista.appendChild(li);
        });
    }

    // Lógica para instigar o clique
    const zapValido = zap.length === 11 || zap.length === 10;
    if (nome.length > 3 && /\S+@\S+\.\S+/.test(email) && zapValido && itens.length > 0) {
        totalEl.classList.remove('blur-text');
        totalEl.classList.add('text-instigante');
        totalEl.innerText = "Você está quase lá...";
    } else {
        totalEl.classList.remove('text-instigante');
        totalEl.classList.add('blur-text');
        totalEl.innerText = "R$ 000,00";
    }
}

function finalizarOrcamento() {
    const nome = document.getElementById('clienteNome').value;
    const email = document.getElementById('clienteEmail').value;
    const zap = document.getElementById('clienteZap').value;

    if (itens.length === 0) return mostrarModal('Adicione os móveis para calcularmos seu desconto!');

    const zapNumeros = zap.replace(/\D/g, "");
    if (!nome || zapNumeros.length < 10) {
        return mostrarModal('Preencha seus dados para liberarmos seu orçamento personalizado.', 'erro');
    }

    let msg = `Olá Leonardo!%0A%0AMeu nome é *${nome}* e acabei de montar minha lista no seu site.%0A%0A*Móveis para montagem:*%0A`;
    itens.forEach(item => { msg += `- ${item.qtd}x ${item.nome}%0A`; });

    msg += `%0A*Aguardo seu melhor orçamento e disponibilidade!*`;

    window.open(`https://wa.me/5513974130852?text=${msg}`, '_blank');
}
// Substitua sua função adicionarItem por esta:
function adicionarItem() {
    const movelDigitado = document.getElementById('tipoMovel').value;
    const qtd = parseInt(document.getElementById('quantidade').value);

    // Validação simples
    if (movelDigitado.trim() === "") {
        return mostrarModal('Por favor, digite o nome do móvel que deseja montar.');
    }
    if (qtd < 1 || isNaN(qtd)) {
        return mostrarModal('A quantidade deve ser pelo menos 1.', 'erro');
    }

    // Adiciona o item na lista usando o texto digitado pelo usuário
    itens.push({ 
        nome: movelDigitado, 
        qtd: qtd 
    });

    renderizarLista();
    
    // Limpa o campo de texto para a próxima entrada
    document.getElementById('tipoMovel').value = "";
    document.getElementById('quantidade').value = "1";
}

// Ouvidores de eventos e Máscara (Mesma lógica anterior)
document.getElementById('clienteNome').addEventListener('input', renderizarLista);
document.getElementById('clienteEmail').addEventListener('input', renderizarLista);
document.getElementById('clienteZap').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else if (v.length > 5) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    else if (v.length > 0) v = v.replace(/^(\d{0,2})/, "($1");
    e.target.value = v;
    renderizarLista();
});

function mostrarModal(m, t) {
    const me = document.getElementById('modalAviso');
    const mi = new bootstrap.Modal(me);
    document.getElementById('modalMensagem').innerText = m;
    mi.show();
}