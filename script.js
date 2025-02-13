const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const startPauseBt = document.getElementById('start-pause');
const display = document.querySelector('#timer');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.getElementById('alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
window.musica = musica;
musica.loop = true;
const play = new Audio('./sons/play.wav');
const pause = new Audio('./sons/pause.mp3');
const beep = new Audio('./sons/beep.mp3');
window.beep = beep;
const mostraTempo = document.getElementById('timer');
const imagemBtComercar = document.querySelector('.app__card-primary-butto-icon');

let tempoDecorridoEmSegundos = 5;
let intervaloId = null;

musicaFocoInput.addEventListener('change', ()  => {
    if(musica.paused){
        musica.play();
    }else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 5;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})


function alterarContexto(contexto) {~
    mostrarTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active')
    })

    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `./imagens/${contexto}.png`)
    switch (contexto) {
        case "foco":
            titulo.innerHTML = 'Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa.</strong>'
            break;
        case "descanso-curto":
            titulo.innerHTML = 'Que tal dar uma respirada?<br> <strong class="app__title-strong">Faça uma pausa curta.</strong>'
            break;
        case "descanso-longo":
            titulo.innerHTML = 'Hora de voltar para a superfície.<br><strong class="app__title-strong">Faça uma pausa longa.</strong>'
            break;

        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0){
        beep.play();
        alert('Tempo Finalizado.');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if(intervaloId){
        pause.play();
        zerar();
        return
    }
    play.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    imagemBtComercar.setAttribute('src', './imagens/pause.png');
    iniciarOuPausarBt.textContent = 'Pausar';
}

function zerar() {
    clearInterval(intervaloId);
    imagemBtComercar.setAttribute('src', './imagens/play_arrow.png');
    iniciarOuPausarBt.textContent = 'Começar';
    intervaloId = null
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFomatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    mostraTempo.innerHTML = `${tempoFomatado}`;
}

mostrarTempo();