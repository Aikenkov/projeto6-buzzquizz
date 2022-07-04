//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
let quizzes;
let selfIds = [];
let selfIdsJson;
let intervalRenderQuizz;
let content = document.querySelector(".content");

let object;   

let points = 0;
let plays = 0;
let quizz;
let myQuizzes;

let title;
let img;
let qntQuestions;
let qntLevels;

let colortest = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

let incorrectAnswer;
let incorrectImg;
let incorrectValue = [];
let imgIncorrectValue = [];

///////////////////////////////////////////////////////////////////////
//              Tela inicial para renderizar os quizzes              //
///////////////////////////////////////////////////////////////////////

function renderQuizzesTela1(array){
    const ids = localStorage.getItem("ids");
    const listIds = JSON.parse(ids);
    content.innerHTML = "";
    quizzes = array.data; 
    if(listIds === null){ 
        
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
        content.innerHTML+= 
        ` 
        <div class="title">
            <span>
            <h1>Seus Quizzes</h1>
            </span>
            <ion-icon name="add-circle" onclick="createQuizz()"></ion-icon>
        </div>    
        `
        ;
        content.innerHTML+=`
        <div class="createdQuizzes">
        </div>
        `
        content.innerHTML+=`
        <h1>Todos os Quizzes</h1>
        `
        content.innerHTML+=`
        <div class="all-quizzes">
        </div>  
        `
        let myQuizzes1 = document.querySelector(".createdQuizzes");
        let allQuizzes = document.querySelector(".all-quizzes");

  
        for(let i = 0; i < quizzes.length; i++){
            for(let j = 0; j < listIds.length; j++){
                if(listIds[j] === quizzes[i].id){
                    myQuizzes1.innerHTML+=`
                    <div class="quizz" id="${quizzes[i].id}" onclick="goToQuizz(this)">  
                        <img src="${quizzes[i].image}">
                        <span>${quizzes[i].title}</span>
                    </div>         
                `;
                }
            }
        }
        let temp = 0;
        for(let i = 0; i < quizzes.length; i++){
            temp = 0;
            for(let j = 0; j < listIds.length; j++){
                if(listIds[j] !== quizzes[i].id){
                    temp++;
                }
                if(listIds[j] !== quizzes[i].id && temp === listIds.length){
                    allQuizzes.innerHTML+= `
                        <div class="quizz" id="${quizzes[i].id}" onclick="goToQuizz(this)">  
                            <img src="${quizzes[i].image}">
                            <span>${quizzes[i].title}</span>
                        </div>         
                `;
                }
            }
            
        } 
    }
    window.scrollTo(0, 0);
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

///////////////////////////////////////////////////////////////////////
//Fim da parte para Renderizar tela inicial e ir para o quizz clicado//
///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////
//              Inicio lógica para criar um novo quizz               //
///////////////////////////////////////////////////////////////////////
function openLevels(elemento) {
    const lv = document.querySelectorAll(".levels-box");
    for(let i = 0; i < lv.length;i++){
        if(!(lv[i].classList.contains("fechada"))){
            lv[i].classList.add("fechada");
        }
    }
    elemento.parentNode.parentNode.classList.remove("fechada");
}
function openQuestion(elemento) {
    const lv = document.querySelectorAll(".question-box");
    for(let i = 0; i < lv.length;i++){
        if(!(lv[i].classList.contains("fechada"))){
            lv[i].classList.add("fechada");
        }
    }
    elemento.parentNode.parentNode.classList.remove("fechada");
}
function checkUrl(string) {
    try {
        let url = new URL(string)
        return true;
    }catch(err) {
        return false;
   }
 }

 function isHexColor(hex) {
    return colortest.test(hex);
}

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
    title = document.querySelector('input:nth-child(1)').value
    img = document.querySelector('input:nth-child(2)').value
    qntQuestions = document.querySelector('input:nth-child(3)').value
    qntLevels = document.querySelector('input:nth-child(4)').value
    if (
      title.length < 20 ||
      title.length > 65 ||
      !checkUrl(img) ||
      qntQuestions < 3 ||
      qntLevels < 2
    ) {
      alert('preencher os dados corretamente.')
    } else {
      createQuestions()
    }
}

function createQuestions() {
    content.innerHTML = "";
    content.innerHTML += '<h2>Crie suas perguntas</h2>';
    for (let i = 0; i < qntQuestions; i++) {
        content.innerHTML += 
        `
            <div class="question-box fechada">
                <h3>Pergunta ${i+1}<ion-icon name="create-outline" onclick="openQuestion(this)"></ion-icon></h3>
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
              <div class="redButton1" onclick="verifyFinishQuestions()">
                  <p>Prosseguir pra criar níveis</p>
              </div>
                `
}   



function verifyFinishQuestions(){
    for(let i = 0; i < qntQuestions; i++){
        if(document.querySelector(`.question${i}`).value.length < 20){
            alert(`Prencha os dados corretamente da questão${i+1}`);
            return;
        }
        if(isHexColor(document.querySelector(`.question-color${i}`).value) === false){
            alert(`Prencha os dados corretamente da cor da questao${i+1}`);
            return; 
        }
        if(document.querySelector(`.correct-answer${i}`).value === ''){
            alert(`Prencha os dados corretamente da resposta correta${i+1}`);
            return;
        }
        if(checkUrl(document.querySelector(`.answerTrue-img${i}`).value) === false){
            alert(`Prencha os dados corretamente da imagem da resposta correta${i+1}`);
            return;
        }

        /*Verificar respostas incorretas vazias*/
        incorrectAnswer = document.querySelectorAll(`.incorrect-answer${i+1}`);
        for(let k = 0; k < incorrectAnswer.length; k++){
            incorrectAnswer[k] = incorrectAnswer[k].value;
        }
        incorrectValue = Array.from(incorrectAnswer);
        incorrectValue = incorrectValue.filter(function (i) {
            return i;
        });
        if(incorrectValue.length === 0){
            alert(`Prencha os dados corretamente da resposta incorreta${i+1}`);
            return;
        }
        
        /*Verificar imagens das respostas incorretas*/
        incorrectImg = document.querySelectorAll(`.answerFalse-img${i+1}`);
        for(let l = 0; l < incorrectImg.length; l++){
            incorrectImg[l] = incorrectImg[l].value;
        }
        imgIncorrectValue = Array.from(incorrectImg);
        imgIncorrectValue = imgIncorrectValue.filter(function (i) {
            return i;
        });
        if(imgIncorrectValue.length === 0){
            alert(`Prencha os dados corretamente da imagem da resposta incorreta${i+1}`);
            return;
        }
        incorrectValue = incorrectAnswer;
        imgIncorrectValue = incorrectImg;
        for(let m = 0; m < incorrectValue.length; m++){
            if(checkUrl(imgIncorrectValue[m].value) === false && imgIncorrectValue[m].value !== ''){
                alert(`Prencha corretamente as urls das respostas incorretas`);
                return;
            }
            if(incorrectValue[m].value === '' && imgIncorrectValue[m].value !== ''){
                alert(`Prencha os dados corretamente`);
                return;
            }
        }
        
    }
    createObject();
    createQuizzLevels();
}

function createObject() {
    object = {
        title: `${title}`, 
        image: `${img}`,
        questions: [
            {
                title: "",
                color: "",
                answers: [
                    {
                        text: "",
                        image: "",
                        isCorrectAnswer: Boolean    
                    },
                ]
            },
        ],
        levels: [
            {
                title: "",
                image: "",
                text: "",
                minValue: Number
            },
        ]
    };
    for(let i = 0; i < qntQuestions; i++){
        object.questions[i] = {
            title: "",
            color: "",
            answers: [
                {
                    text: "",
                    image: "",
                    isCorrectAnswer: Boolean    
                },
            ]
        }
        object.questions[i].title = document.querySelector(`.question${i}`).value;
        object.questions[i].color = document.querySelector(`.question-color${i}`).value;
        object.questions[i].answers[0].text = document.querySelector(`.correct-answer${i}`).value;
        object.questions[i].answers[0].image = document.querySelector(`.answerTrue-img${i}`).value;
        object.questions[i].answers[0].isCorrectAnswer = true;

        incorrectAnswer = document.querySelectorAll(`.incorrect-answer${i+1}`);
  
        incorrectImg = document.querySelectorAll(`.answerFalse-img${i+1}`);

        for(let j = 1; j <= incorrectAnswer.length; j++){
            if(incorrectAnswer[j-1].value !== ''){
                object.questions[i].answers[j] = {
                    text: "",
                    image: "",
                    isCorrectAnswer: Boolean    
                };
                object.questions[i].answers[j].text = incorrectAnswer[j-1].value;
                object.questions[i].answers[j].image = incorrectImg[j-1].value;
                object.questions[i].answers[j].isCorrectAnswer = false;
            }
        }    
    }  
}

function createQuizzLevels(){
    content.innerHTML= "";
    content.innerHTML+= `<h2>Agora, Decida os níveis</h2>`
    for(let i = 1; i <= qntLevels; i++){
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
            <div class="redButton1" onclick="verifyFinishQuizz()">
                <p>Finalizar Quizz</p>
            </div>
    `
}


function verifyFinishQuizz(){
    let titulos = document.querySelectorAll("textarea.titulo");
    let acertos = document.querySelectorAll("textarea.acerto");
    let urls = document.querySelectorAll("textarea.url");
    let descricoes = document.querySelectorAll("textarea.descricao");
    let flag = 0;
    for(let i = 0; i < qntLevels; i++){
        if(!(checkUrl(urls[i].value))){
            alert("Preencha os dados da url corretamente!!!")
            return;
        }
        if(acertos[i].value == 0){ 
            flag = 1;
        }
        if(flag == 0 && i == qntLevels-1){
            alert("Precisamos de um valor 0 de acertos em 1 nivel!!!")
            return;    
        }
        if(titulos[i].value.length < 10 || (acertos[i].value < 0 && acertos[i].value > 100) || descricoes[i].value.length < 30){
            alert("Preencha os dados da descrição/titulos corretamente!!!")
            return;
        }
        object.levels[i] = {
            title: "",
            image: "",
            text: "",
            minValue: Number
        };
        object.levels[i].title = titulos[i].value;
        object.levels[i].image = urls[i].value;
        object.levels[i].text = descricoes[i].value;
        object.levels[i].minValue = acertos[i].value;
    }
    finishQuizz();
}

function finishQuizz(){
    content.innerHTML = "";
    content.innerHTML +=   `            
        <div class="" >
            <h3>Seu quizz está pronto!</h3>
            <div class="quizz">  
                <img src="${object.image}">
                <span>${object.title}</span>
            </div>         
            <div class="redButton1" onclick="findToOpenQuizz()">
                <p>Acessar Quizz</p>
            </div>
            <div class = "redButton1 grey" onclick="findQuizzes()">Voltar pra home</div> 
        </div>
        `
    let promise = axios.post(url, object);
    promise.then(sendToApi);
}

let idTemp;
function sendToApi(resposta){
    idTemp = resposta.data.id;
    const Pids = localStorage.getItem("ids")
    const Jids = JSON.parse(Pids);
    if(Jids === null){
        selfIds.push(resposta.data.id);    
        selfIdsJson = JSON.stringify(selfIds);
        localStorage.setItem("ids", selfIdsJson);
    }else{
        selfIds = Jids;
        selfIds.push(resposta.data.id);
        selfIdsJson = JSON.stringify(selfIds);
        localStorage.setItem("ids", selfIdsJson);
    }
}

function findToOpenQuizz(){
    let promise = axios.get(url, idTemp);
    promise.then(openCreatedQuizz)
}

function openCreatedQuizz(resposta){
    showQuizz(resposta.data[0]);
}

////////////////////////////////////////////////////////////// 
//      Finalizada parte para verificar niveis do quizz     //
//////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
//      Tela de resposta do quiz a partir desse ponto      //
/////////////////////////////////////////////////////////////

function goToQuizz(element){
    getQuizz(element);
}


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
    document.querySelector(".header-quizz").scrollIntoView({ block: "start", behavior: "smooth" });
}

function choose(element) {

    let parent = element.parentNode;
    let pendind = document.querySelector('.pending')


    let overlay = parent.querySelector('.overlay');
    overlay.classList.remove('hidden')

    let allFalse = parent.querySelectorAll('.false');
    for (let i = 0; i < allFalse.length; i++) {
        allFalse[i].classList.add('color')
    }

    parent.querySelector('.true').classList.add('color')
    if (element.classList.contains('true') && !element.classList.contains('chosen')) {
        points++;
    }

    if (!element.classList.contains('chosen')) {
        plays++;
        element.classList.add('chosen');
        pendind.classList.remove('pending')
        setTimeout(scrollToNext, 2000);
        if (plays === myQuizzes.questions.length) {
            finalResult();
        }
    }

}


function scrollToNext() {
    const nextQ = document.querySelector('.pending');
    nextQ.scrollIntoView({ block: "start", behavior: "smooth" });
}

function finalResult() {
    let average = Math.ceil((points / plays) * 100);

    let temp = 0;
    let temp2 = quizz.levels[0];

    for (let i = 0; i < quizz.levels.length; i++) {

        let minValue = quizz.levels[i].minValue;
        if(average >= temp && average >= minValue){
            temp2 = quizz.levels[i];
        }
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

///////////////////////////////////////////////////////////////////////
//                               Fim                                 //
///////////////////////////////////////////////////////////////////////

findQuizzes();
