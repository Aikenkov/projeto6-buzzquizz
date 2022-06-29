//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let quizzes;
let selfIds = [];
let intervalRenderQuizz;
let content = document.querySelector(".content");

//setInterval(findQuizzes, 5000);


//parte para Renderizar tela inicial e ir para o quizz clicado

function renderQuizzesTela1(array) {
    content.innerHTML = "";
    quizzes = array.data;
    console.log(quizzes);
    if (selfIds.length === 0) {
        content.innerHTML += `
        <div class="my-quizzes-null">
            <span>
                Você não criou nenhum<br>
                quizz ainda :(
            </span>
            <button onclick="createQuizz()">Criar Quizz</button>
        </div>    
        `

        content.innerHTML += `
        <h1>Todos os Quizzes</h1>
        <div class="all-quizzes">
        </div>
        `;

        let allQuizzes = document.querySelector(".all-quizzes");
        for (let i = 0; i < quizzes.length; i++) {
            allQuizzes.innerHTML += `
            <div class="quizz" onclick="goToQuizz()">  
                <img src="${quizzes[i].image}">
                <span>${quizzes[i].title}</span>
            </div>         
            `;
        }

    } else {
        content.innerHTML += ` 
        <div class="title">
            <span><h1>Seus Quizzes</h1></span><span><ion-icon name="add-circle" onclick="createQuizz()></ion-icon></span>
        </div>

        <div class="my-quizzes">
        </div>    

        <h1>Todos os Quizzes</h1>

        <div class="all-quizzes">
        </div>    
        `;
        let myQuizzes = document.querySelector(".my-quizzes");
        let allQuizzes = document.querySelector(".all-quizzes");
        let flag = 0;
        for (let i = 0; i < quizzes.length; i++) {
            flag = 0;
            for (let j = 0; j < selfIds.length; j++) {
                if (quizzes[i].id === selfIds[j]) {
                    myQuizzes.innerHTML += `
                        <div class="quizz" onclick="goToQuizz()">  
                            <img src="${quizzes[j].image}">
                            <span>${quizzes[j].title}</span>
                        </div>         
                    `;
                    flag = 1;
                }
            }
            if (flag === 0) {
                allQuizzes.innerHTML += `
                    <div class="quizz" onclick="goToQuizz()">  
                        <img src="${quizzes[i].image}">
                        <span>${quizzes[i].title}</span>
                    </div>         
                `;
            }
        }
    }
}

function findQuizzes() {
    const promise = axios.get(url);
    promise.then(renderQuizzesTela1);
}

function goToQuizz() {
    content.innerHTML = "TAMO FAZENDO"
}

//Fim da parte para Renderizar tela inicial e ir para o quizz clicado

//Começo da parte para criar Quizz

function createQuizz() {
    content.innerHTML = ''
    content.innerHTML += `
        <div class="form"
            <h2>Comece pelo começo</h2>

            <div class="input-area">
                <input type="text" placeholder="Título do seu quizz" />

                <input type="text" placeholder="URL da imagem do seu quizz" />

                <input type="text" placeholder="Quantidade de perguntas do quizz" />

                <input type="text" placeholder="Quantidade de níveis do quizz" />
            </div>
            <div class="redButton1" onclick="createQuizzValidation()">
                <p>Prosseguir pra criar perguntas</p>
            </div>
        </div>          
    `
}

function createQuizzValidation() {
    let string = document.querySelector('input:nth-child(2)').value
    if (
        document.querySelector('input:nth-child(1)').value.length < 20 ||
        document.querySelector('input:nth-child(1)').value.length > 65 ||
        !checkUrl(string) ||
        document.querySelector('input:nth-child(3)').value < 3 ||
        document.querySelector('input:nth-child(4)').value < 2
    ) {
        alert('preencher os dados corretamente.')
    } else {
        createQuestions();
    }
}

function createQuestions() {

}

//Parte para verificar os niveis do quizz

function openLevels(elemento) {
    elemento.parentNode.parentNode.classList.toggle("fechada")
    elemento.classList.add("hidden");
}

function createQuizzLevels(qnt) {
    content.innerHTML = "";
    content.innerHTML += `<h2>Agora, Decida os níveis</h2>`
    for (let i = 0; i < qnt; i++) {
        content.innerHTML += `
        <div class="levels-box fechada" >
            <h3>Nível ${i} <ion-icon name="create-outline" onclick="openLevels(this)"></ion-icon></h3>
            <textarea name="titulo" class="titulo" placeholder="Título do nível"></textarea>
            <textarea name="acerto" class="acerto" placeholder="% de acerto mínima"></textarea>
            <textarea name="URL" type="url" class="url" placeholder="URL da imagem do nível"></textarea>
            <textarea name="Descrição" class="descricao" placeholder="Descrição do nível"></textarea>
        </div>
        `
    }
    content.innerHTML += ` 
            <div class="redButton1" onclick="verifyFinishQuiz(qnt)">
                <p>Finalizar Quizz</p>
            </div>
    `
}

function verifyFinishQuizz(qnt) {
    let arrayLevels = [
        {
            titulo: '',
            acerto: '',
            URL: '',
            descricao: ''
        }
    ];
    let titulos = document.querySelectorAll("textarea.titulo").value;
    let acertos = document.querySelectorAll("textarea.acerto").value;
    let urls = document.querySelectorAll("textarea.url").value;
    let descricoes = document.querySelectorAll("textarea.descricao").value;
    let flag = 0;
    for (let i = 0; i < qnt; i++) {
        if (!(checkUrl(urls[i]))) {
            alert("Preencha os dados corretamente!!!")
            createQuizzLevels(qnt);
        }
        if (acertos[i] !== 0) {
            flag++
            if (flag === qnt - 1) {
                alert("Preencha os dados corretamente!!!")
                createQuizzLevels(qnt);
            }
        }
        if (titulos[i].length < 10 || (acertos[i] < 0 && acertos[i] > 100) || descricoes[i].length < 30) {
            alert("Preencha os dados corretamente!!!")
            createQuizzLevels(qnt);
        }
        arrayLevels[i].titulo = titulos[i];
        arrayLevels[i].acerto = acertos[i];
        arrayLevels[i].URL = urls[i];
        arrayLevels[i].descricao = descricoes[i];
    }
    finishQuizz(arrayLevels);
}

function checkUrl(string, qnt) {
    try {
        let url = new URL(string)
        return true;
    } catch (err) {
        return false;
    }
}

//Finalizada parte para verificar niveis do quizz


findQuizzes();

//Fim mateus




































































































































/* Inicio Fabio */

let answer;
let points = 0;
let plays = 0;
let questions;
let quizz;


function ramdomize() {
    return Math.random() - 0.5;
}


/* getQuizz();  chamar essa função para carregar o quizz   */
function getQuizz() {
    const promise = axios.get(`${url}/1`); /* <----- esse 1 tem que ser o id do quizz */
    promise.then(showQuizz);
}

function showQuizz(array) {
    quizz = array.data

    questions = quizz.questions

    let content = document.querySelector(".content");

    content.innerHTML = ` 
              <header class="header-quizz">
                  <div><span>${quizz.title}</span></div>
                  <img src="${quizz.image}">
               </header>
      `
    for (let i = 0; i < questions.length; i++) {
        const quest = questions[i];
        answer = quest.answers;

        answer.sort(ramdomize);

        content.innerHTML += `
            <div class="question pending">
                <div class='question-title'>${quest.title}</div>
                <div class="answers">
                    <div class="overlay hidden"></div>
                    <div class="${answer[0].isCorrectAnswer}" onclick="choose(this)">
                         <img src="${answer[0].image}">
                         <h3>${answer[0].text}</h3>
                    </div>

                    <div class="${answer[1].isCorrectAnswer}" onclick="choose(this)">
                         <img src="${answer[1].image}">
                         <h3>${answer[1].text}</h3>
                    </div>

                    <div class="${answer[2].isCorrectAnswer}" onclick="choose(this)">
                         <img src="${answer[2].image}">
                         <h3>${answer[2].text}</h3>
                    </div>

                    <div class="${answer[3].isCorrectAnswer}" onclick="choose(this)">
                         <img src="${answer[3].image}">
                         <h3>${answer[3].text}</h3>
                    </div>
                </div>
            </div>
        `
    }

}


function choose(element) {
    element.classList.add('chosen');
    let parent = element.parentNode;

    let pendind = document.querySelector('.pending')
    pendind.classList.remove('pending')

    let overlay = parent.querySelector('.overlay');
    overlay.classList.remove('hidden')

    let allFalse = parent.querySelectorAll('.false');

    for (let i = 0; i < allFalse.length; i++) {
        allFalse[i].classList.add('color')
    }

    parent.querySelector('.true').classList.add('color')

    if (element.classList.contains('true')) {
        points++;
    }

    plays++;

    setTimeout(scrollToNext, 2000);

    if (plays === questions.length) {
        showResult();
    }

}

function scrollToNext() {
    const nextQ = document.querySelector('.pending');
    nextQ.scrollIntoView({ block: "start", behavior: "smooth" });
}


function showResult() {

    let content = document.querySelector(".content");
    content.innerHTML += `
    <div class="result pending">
        <div class="result-title"> 88% de acerto: Você é praticamente um aluno de Hogwarts!</div>
        <div>
                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1vzu6nGA7j1-4pz4eeM-6WzZPPHZb_6ckwA&usqp=CAU">
                 <p>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão
            abaixo para usar o vira-tempo e reiniciar este teste.</p>
        </div>
    </div>
    `
}


/* Fim Fabio */
