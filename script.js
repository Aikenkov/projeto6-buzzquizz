//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes";
let quizzes;
let selfIds = [];
let intervalRenderQuizz;
let content = document.querySelector(".content");

let object;   

//parte para Renderizar tela inicial e ir para o quizz clicado

function renderQuizzesTela1(array){
    content.innerHTML = "";
    quizzes = array.data; 
    if(selfIds.length === 0){ 
        content.innerHTML += `
        <div class="my-quizzes-null">
            <span>
                Você não criou nenhum<br>
                quizz ainda :(
            </span>
            <button onclick="createQuizz()">Criar Quizz</button>
        </div>    
        `
        
        content.innerHTML+= `
        <h1>Todos os Quizzes</h1>
        <div class="all-quizzes">
        </div>
        `;

        let allQuizzes = document.querySelector(".all-quizzes");                
        for(let i = 0; i < quizzes.length; i++){
            allQuizzes.innerHTML+= `
            <div class="quizz" id="${quizzes[i].id}" onclick="goToQuizz(this)">  
                <img src="${quizzes[i].image}">
                <span>${quizzes[i].title}</span>
            </div>         
            `;
        }
        
    }else{
        content.innerHTML+= ` 
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
        for(let i = 0; i < quizzes.length; i++){
            flag = 0;
            for(let j = 0; j < selfIds.length; j++){
                if(quizzes[i].id === selfIds[j]){
                    myQuizzes.innerHTML+=`
                        <div class="quizz" id="${quizzes[j].id} onclick="goToQuizz(this)">  
                            <img src="${quizzes[j].image}">
                            <span>${quizzes[j].title}</span>
                        </div>         
                    `;
                    flag = 1;
                }
            }
            if(flag === 0){
                allQuizzes.innerHTML+= `
                    <div class="quizz" id="${quizzes[i].id} onclick="goToQuizz(this)">  
                        <img src="${quizzes[i].image}">
                        <span>${quizzes[i].title}</span>
                    </div>         
                `;
            }
        }
    }
}


function findQuizzes(){
   const promise = axios.get(url);
   promise.then(renderQuizzesTela1);
   promise.catch(tratarErro);
}

function tratarErro(erro){
    if(erro.response.status === 404){
        findQuizzes();
    }
}

//Fim da parte para Renderizar tela inicial e ir para o quizz clicado


function createObject(title, img, Questions1) {
    object = {
        title: title, 
        image: img,
        questions: [
            {
                title: "",
                color: "",
                answers: [
                    {
                        text: "",
                        image: "",
                        isCorrectAnswer: Boolean    
                    }
                ]
            }
        ],
        levels: [
            {
                title: "",
                image: "",
                text: "",
                minValue: Number
            }
        ]
    };
    let incorrectAnswer;
    let incorrectImg;
    for(let i = 0; i < Questions1; i++){
        object.questions[i].title = document.querySelector(`.questions${i}`).value;
        object.questions[i].color = document.querySelector(`.question-color${i}`).value;
        object.questions[i].answers[0].text = document.querySelectorAll(`.correct-answer${i}`).value;
        object.questions[i].answers[0].img = document.querySelectorAll(`.answerTrue-img${i}`).value;
        object.questions[i].answers[0].isCorrectAnswer = true;

        incorrectAnswer = document.querySelectorAll(`.incorrect-answer${i+1}`).value;
        incorrectAnswer = incorrectAnswer.filter(function (i) {
            return i;
        });

        incorrectImg = document.querySelectorAll(`answerFalse-img${i+1}`).value;
        incorrectAnswer = incorrectAnswer.filter(function (i) {
            return i;
        });
        for(let j = 1; j <= incorrectAnswer.length; j++){
            object.questions[i].answers[j].text = incorrectAnswer[j-1];
            object.questions[i].answers[j].image = incorrectImg[j-1];
            object.questions[i].answers[j].isCorrectAnswer = false;
        }    
    }  
}

//Começo da parte para criar Quizz

function createQuizz(){
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
    let title = document.querySelector('input:nth-child(1)').value
    let img = document.querySelector('input:nth-child(2)').value
    let Questions1 = document.querySelector('input:nth-child(3)').value
    let Levels = document.querySelector('input:nth-child(4)').value
    if (
      title.length < 20 ||
      title.length > 65 ||
      !checkUrl(img) ||
      Questions1 < 3 ||
      Levels < 2
    ) {
      alert('preencher os dados corretamente.')
    } else {
      createQuestions(title, img, Questions1, Levels)
    }
}

function createQuestions(title, img, Questions1, Levels) {
    content.innerHTML = "";
    content.innerHTML += '<h2>Crie suas perguntas</h2>';
    for (let i = 0; i < Questions1; i++) {
        content.innerHTML += 
        `
            <div class="question-box fechada" >
                <h3>Pergunta ${i+1}<ion-icon name="create-outline" onclick="openLevels(this)"></ion-icon></h3>
                <textarea name="question" class="question${i}" placeholder="Texto da pergunta"></textarea>
                <textarea name="question-color" class="question-color${i}" placeholder="Cor de fundo da pergunta"></textarea>
  
                <h3>Resposta correta</h3>
                <textarea name="correct-answer" class="correct-answer${i}" placeholder="Resposta correta"></textarea>
                <textarea name="answer-img" class="answerTrue-img${i}" placeholder="URL da imagem"></textarea>
  
                <h3>Respostas incorretas</h3>
                <textarea name="incorrect-answer" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 1"></textarea>
                <textarea name="answer-img" class="answerFalse-img${i+1}" placeholder="URL da imagem 1"></textarea>
  
                <textarea name="incorrect-answer" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 2"></textarea>
                <textarea name="answer-img" class="answerFalse-img${i+1}" placeholder="URL da imagem 2"></textarea>
  
                <textarea name="incorrect-answer}" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 3"></textarea>
                <textarea name="answer-img" class="answerFalse-img${i+1}" placeholder="URL da imagem 3"></textarea>
            </div>
        `
    };

    content.innerHTML +=  `
              <div class="redButton1" onclick="verifyFinishQuiz(${Questions1}, ${Levels})">
                  <p>Prosseguir pra criar níveis</p>
              </div>
                `
    createObject(title, img, Questions1);
}   

//Parte para verificar os niveis do quizz

function openLevels(elemento){
    elemento.parentNode.parentNode.classList.toggle("fechada")
    elemento.classList.add("hidden");
}

function createQuizzLevels(qnt){
    content.innerHTML= "";
    content.innerHTML+= `<h2>Agora, Decida os níveis</h2>`
    for(let i = 1; i <= qnt; i++){
        content.innerHTML+=`
        <div class="levels-box fechada">
            <h3>Nível ${i} <ion-icon name="create-outline" onclick="openLevels(this)"></ion-icon></h3>
            <textarea name="titulo" class="titulo" placeholder="Título do nível"></textarea>
            <textarea name="acerto" class="acerto" placeholder="% de acerto mínima"></textarea>
            <textarea name="URL" type="url" class="url" placeholder="URL da imagem do nível"></textarea>
            <textarea name="Descrição" class="descricao" placeholder="Descrição do nível"></textarea>
        </div>
        `
    }
    content.innerHTML+=` 
            <div class="redButton1" onclick="verifyFinishQuiz(qnt)">
                <p>Finalizar Quizz</p>
            </div>
    `
}

function verifyFinishQuizz(qnt){
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
    for(let i = 0; i < qnt; i++){
        if(!(checkUrl(urls[i]))){
            alert("Preencha os dados corretamente!!!")
            createQuizzLevels(qnt);
        }
        if(acertos[i] !== 0){
            flag++
            if(flag === qnt-1){
                alert("Preencha os dados corretamente!!!")
                createQuizzLevels(qnt);    
            }
        }
        if(titulos[i].length < 10 || (acertos[i] < 0 && acertos[i] > 100) || descricoes[i].length < 30){
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

function checkUrl(string) {
    try {
        let url = new URL(string)
        return true;
    }catch(err) {
        return false;
   }
 }

//Finalizada parte para verificar niveis do quizz

findQuizzes();


function goToQuizz(element){
    getQuizz(element);
}


let points = 0;
let plays = 0;
let quizz;
let myQuizzes;

function ramdomize() {
    return Math.random() - 0.5;
}

function getQuizz(element) {
    for (let i = 0; i < quizzes.length; i++) {
        if (Number(quizzes[i].id) === Number(element.id)) {
            myQuizzes = quizzes[i];
            showQuizz(quizzes[i])

        }
    }

}

function showQuizz(array) {
    quizz = array

    /*  quizz.questions */

    content.innerHTML = ` 
              <header class="header-quizz">
                  <div><span>${quizz.title}</span></div>
                  <img src="${quizz.image}">
               </header>
      `

    for (let i = 0; i < quizz.questions.length; i++) {
        let quest = quizz.questions[i];
        let answer = quest.answers;
        answer.sort(ramdomize);


        content.innerHTML += `
            <div class="question pending">
                <div class='question-title cl${i}'><h2>${quest.title}</h2></div>
                <div class="answers an${i} ">
                    <div class="overlay hidden"></div>
                </div>
            </div>
            
        `
        document.querySelector(`.cl${i}`).style.backgroundColor = `${quest.color}`;

        for (let j = 0; j < answer.length; j++) {
            let last = document.querySelector(`.an${i}`)
            last.innerHTML += `
                          <div class="${answer[j].isCorrectAnswer}" onclick="choose(this)">
                              <img src="${answer[j].image}">
                              <h3>${answer[j].text}</h3>
                       </div>`
        }
    }

    document.querySelector('.question').classList.add('first-margin')
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
    if (plays === myQuizzes.questions.length) {
        finalResult();
    }
}

function scrollToNext() {
    const nextQ = document.querySelector('.pending');
    nextQ.scrollIntoView({ block: "start", behavior: "smooth" });
}

function finalResult() {
    let average = Math.ceil((points / plays) * 100);

    let temp = 0;
    let temp2;

    for (let i = 0; i < quizz.levels.length; i++) {

        let minValue = quizz.levels[i].minValue;
        if (average >= temp && average >= minValue && minValue > temp) {

            temp = minValue;
            temp2 = quizz.levels[i];

        }
    }

    if (temp2 === undefined) {
        for (let i = 0; i < quizz.levels.length; i++) {
            if (quizz.levels[i].minValue === 0) {
                temp2 = quizz.levels[i];
            }
        }
    }
    showResult(average, temp2)
}



function showResult(average, resultlevel) {

    content.innerHTML += `
    <div class="result pending">
        <div class="result-title">${average}% de acerto: ${resultlevel.title}</div>
        <div>
                 <img src="${resultlevel.image}">
                 <p>${resultlevel.text}</p>
        </div>
    </div>

    <div class="restart-buttom">
        <div onclick="restartQuizz()" class="restart-quizz">Reiniciar Quizz</div>
        <span class="go-home" onclick="goHome()">Voltar pra home</span>
    </div>
    `
}

function restartQuizz() {
    plays = 0;
    points = 0;
    getQuizz(myQuizzes)
    document.querySelector(".header-quizz").scrollIntoView({ block: "start", behavior: "smooth" });
}

function goHome() {
    plays = 0;
    points = 0;

    findQuizzes();
}