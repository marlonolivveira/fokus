// const { parse } = require("path");

const adicionarTarefaBt = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRomoverTodasTarefas = document.querySelector('#btn-remover-todas');


let tarefaSelecionada = null;
let liTarefaSelecionada = null;


function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));//salva as informações no storage do navegador
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.classList.add('app__section-task-icon-status');
    svg.innerHTML = `
            <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
                <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
            </svg>
        `
    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        // debugger
        const novaDescricao = prompt("Qual é o novo nome da tarefa?");
        if(novaDescricao === ''){
            alert("Insira uma tarefa válida");
        }else if(novaDescricao === null){
            return
        }else{
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }

    }

    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if(tarefa.completa){
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    }else{
        li.onclick = () => {
            
            paragrafoDescricaoTarefa.textContent = tarefa.descricao
            document.querySelectorAll('.app__section-task-list-item-active').forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            })
            if(tarefaSelecionada == tarefa){
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
    
            li.classList.add('app__section-task-list-item-active');
        }
    }


    return li
}


adicionarTarefaBt.addEventListener('click', () => {
    //toggle faz aparecer e desaparecer conforme o click(Tira e bota o hidden conforme o click)
    formAdicionarTarefa.classList.toggle('hidden');
})

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault(); //para nao atualizar a pagina toda vez que enviar o formulario
    const tarefa = {
        descricao: textarea.value
    }
    tarefas.push(tarefa);
    // Caso queira bugar a aplicação
    // mostrarTarefa();
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
    
})

// function mostrarTarefa(){
//     tarefas.forEach(tarefa => {
//         const elementoTarefa = criarElementoTarefa(tarefa);
//         ulTarefas.append(elementoTarefa);
//     })
// }

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

document.addEventListener('FocoFinalizado', () =>{
    if (tarefaSelecionada && liTarefaSelecionada){
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

// btnRemoverConcluidas.onclick = () => {
//     //const seletor = "app__section-task-list-item-complete";
//     //para bugar a limpeza das tarefas basta usar a linha comentada ao inves da linha de baixo
//     const seletor = ".app__section-task-list-item-complete";
//     document.querySelectorAll(seletor).forEach(elemento => {
//         elemento.remove();
//     })

//     tarefas = tarefas.filter(tarefa => !tarefa.completa)
//     atualizarTarefas();
// }

// btnRomoverTodasTarefas.onclick = () => {
//     //app__section-task-list-item-active para bugar e não remover todas
//     const seletor = ".app__section-task-list-item";
//     document.querySelectorAll(seletor).forEach(elemento => {
//         elemento.remove();
//     })
    
//     tarefas = [];
//     atualizarTarefas();
// }

const removerTarefas = (somenteCompletas) => {

    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })

    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRomoverTodasTarefas.onclick = () => removerTarefas(false);