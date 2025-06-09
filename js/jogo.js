// filepath: /snake-game/snake-game/src/js/jogo.js
window.console.log("Debug");

const tela = document.getElementById("tela");
const contexto = tela.getContext("2d");

const tamanhoBloco = 20;
const totalBlocos = Math.floor(tela.width / tamanhoBloco);

const spanPontuacao = document.querySelector("#painel-controle span");
const somComer = new Audio("/audio/somPontos.mp3");
const musicaFundo = new Audio("audio/musicaFundo.mp4"); // Caminho para a música de fundo
musicaFundo.volume = 0.1; // Ajuste o volume da música de fundo
musicaFundo.loop = true;

let cobrinha = [{ x: 5, y: 5 }];
let direcao = "direita";
let comida = { x: 0, y: 0 };
let pontuacao = 0;
let jogoAtivo = false;




function iniciarJogo() {
    jogoAtivo = true;
    pontuacao = 0;
    cobrinha = [{ x: 5, y: 5 }];
    gerarComida();
    document.addEventListener("keydown", mudarDirecao);
    atualizar();
}

function gerarComida() {
    comida.x = Math.floor(Math.random() * totalBlocos);
    comida.y = Math.floor(Math.random() * totalBlocos);
}

function mudarDirecao(evento) {
    switch (evento.key) {
        case "ArrowUp":
            if (direcao !== "baixo") direcao = "cima";
            break;
        case "ArrowDown":
            if (direcao !== "cima") direcao = "baixo";
            break;
        case "ArrowLeft":
            if (direcao !== "direita") direcao = "esquerda";
            break;
        case "ArrowRight":
            if (direcao !== "esquerda") direcao = "direita";
            break;
    }
}

function atualizar() {
    if (!jogoAtivo) return;

    contexto.clearRect(0, 0, tela.width, tela.height);
    desenharCenario();
    desenharCobra();
    desenharComida();

    const cabeca = { x: cobrinha[0].x, y: cobrinha[0].y };

    switch (direcao) {
        case "cima":
            cabeca.y--;
            break;
        case "baixo":
            cabeca.y++;
            break;
        case "esquerda":
            cabeca.x--;
            break;
        case "direita":
            cabeca.x++;
            break;
    }

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        gerarComida();
    } else {
        cobrinha.pop();
    }

    cobrinha.unshift(cabeca);

    if (cabeca.x < 0 || cabeca.x >= totalBlocos || cabeca.y < 0 || cabeca.y >= totalBlocos || colisaoComCobra(cabeca)) {
        jogoAtivo = false;
        alert("Game Over! Sua pontuação foi: " + pontuacao);
    }

    setTimeout(atualizar, 100);
}

function colisaoComCobra(cabeca) {
    for (let i = 1; i < cobrinha.length; i++) {
        if (cobrinha[i].x === cabeca.x && cobrinha[i].y === cabeca.y) {
            return true;
        }
    }
    return false;
}

function desenharCenario() {
    contexto.fillStyle = "lightgreen";
    contexto.fillRect(0, 0, tela.width, tela.height);
}

function desenharCobra() {
    for (let parte of cobrinha) {
        contexto.fillStyle = "red";
        contexto.fillRect(parte.x * tamanhoBloco, parte.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
    }
}

function desenharComida() {
    contexto.fillStyle = "yellow";
    contexto.fillRect(comida.x * tamanhoBloco, comida.y * tamanhoBloco, tamanhoBloco, tamanhoBloco);
}

// ...existing code...

let tempoAtualizacao = 250; // valor padrão
let timeoutId = null; // para controlar o loop

function iniciarJogo() {
    // Definir velocidade conforme dificuldade
    const dificuldade = document.getElementById("Dificuldade").value;
    if (dificuldade === "facil") tempoAtualizacao = 250;
    else if (dificuldade === "medio") tempoAtualizacao = 120;
    else if (dificuldade === "dificil") tempoAtualizacao = 60;

    jogoAtivo = true;
    pontuacao = 0;
    spanPontuacao.textContent = pontuacao;
    cobrinha = [{ x: 5, y: 5 }];
    direcao = "direita";
    gerarComida();

    // Tocar música de fundo
    musicaFundo.currentTime = 0;
    musicaFundo.play();

    // Limpa qualquer loop anterior
    if (timeoutId) clearTimeout(timeoutId);

    atualizar();
}

function atualizar() {
    if (!jogoAtivo) {
        musicaFundo.pause();
        return;
    }

    contexto.clearRect(0, 0, tela.width, tela.height);
    desenharCenario();
    desenharCobra();
    desenharComida();

    const cabeca = { x: cobrinha[0].x, y: cobrinha[0].y };

    switch (direcao) {
        case "cima":
            cabeca.y--;
            break;
        case "baixo":
            cabeca.y++;
            break;
        case "esquerda":
            cabeca.x--;
            break;
        case "direita":
            cabeca.x++;
            break;
    }

    // Corrigir limites para não ultrapassar o canvas
    if (cabeca.x < 0) cabeca.x = 0;
    if (cabeca.x >= totalBlocos) cabeca.x = totalBlocos - 1;
    if (cabeca.y < 0) cabeca.y = 0;
    if (cabeca.y >= totalBlocos) cabeca.y = totalBlocos - 1;

    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontuacao++;
        spanPontuacao.textContent = pontuacao;
        gerarComida();
        somComer.currentTime = 0;
        somComer.play();
    } else {
        cobrinha.pop();
    }

    cobrinha.unshift(cabeca);

    if (
        cabeca.x < 0 || cabeca.x >= totalBlocos ||
        cabeca.y < 0 || cabeca.y >= totalBlocos ||
        colisaoComCobra(cabeca)
    ) {
        jogoAtivo = false;
        musicaFundo.pause();
        alert("Game Over! Sua pontuação foi: " + pontuacao);
    } else {
        timeoutId = setTimeout(atualizar, tempoAtualizacao);
    }
}

// Adicione o listener do teclado apenas uma vez
document.addEventListener("keydown", mudarDirecao);

// Adicione o listener do botão apenas uma vez
document.querySelector("button").addEventListener("click", iniciarJogo);

