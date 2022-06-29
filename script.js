//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let quizzes;
let selfIds = [];
let intervalRenderQuizz;
let content = document.querySelector(".content");

//setInterval(findQuizzes, 5000);

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
            <div class="quizz" onclick="goToQuizz()">  
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
                        <div class="quizz" onclick="goToQuizz()">  
                            <img src="${quizzes[j].image}">
                            <span>${quizzes[j].title}</span>
                        </div>         
                    `;
                    flag = 1;
                }
            }
            if(flag === 0){
                allQuizzes.innerHTML+= `
                    <div class="quizz" onclick="goToQuizz()">  
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
        alert("para de trolar");
        findQuizzes;
    }
}


function goToQuizz(){
    content.innerHTML= "TAMO FAZENDO"
}

//Fim da parte para Renderizar tela inicial e ir para o quizz clicado

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
    let Questions = document.querySelector('input:nth-child(3)').value
    let Levels = document.querySelector('input:nth-child(4)').value
    if (
      title.length < 20 ||
      title.length > 65 ||
      !checkUrl(img) ||
      Questions < 3 ||
      Levels < 2
    ) {
      alert('preencher os dados corretamente.')
    } else {
      createQuestions(title, img, Questions, Levels)
    }
}

function createObject(title, img, Questions, Levels) {
let object = {
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
}   
let incorrectAnswer = [];
for(let i = 1; i <= Questions; i++){
    incorrectAnswer = document.querySelectorAll(`.incorrect-answer${i}`)
    incorrectAnswer = incorrectAnswer.filter(function (i) {
        return i;
      });
    object.questions[i].title = document.querySelector(`.questions${i}`)
    object.questions[i].color = document.querySelector(`.question-color${i}`)
    for(let j = 1; j < incorrectAnswer.length; j++){
        object.questions[i].answers[j].text = incorrectAnswer[j];
    }



    
}

}

function createQuestions(title, img, Questions, Levels) {
    content.innerHTML = "";
    content.innerHTML += '<h2>Crie suas perguntas</h2>';
    for (let i = 0; i < Questions; i++) {
        content.innerHTML += 
        `
            <div class="question-box fechada" >
                <h3>Pergunta ${i+1}<ion-icon name="create-outline" onclick="openLevels(this)"></ion-icon></h3>
                <textarea name="question" class="question${i+1}" placeholder="Texto da pergunta"></textarea>
                <textarea name="question-color" class="question-color${i+1}" placeholder="Cor de fundo da pergunta"></textarea>
  
                <h3>Resposta correta</h3>
                <textarea name="correct-answer" class="correct-answer${i+1}" placeholder="Resposta correta"></textarea>
                <textarea name="answer-img" class="answer-img" placeholder="URL da imagem"></textarea>
  
                <h3>Respostas incorretas</h3>
                <textarea name="incorrect-answer" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 1"></textarea>
                <textarea name="answer-img" class="answer-img" placeholder="URL da imagem 1"></textarea>
  
                <textarea name="incorrect-answer" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 2"></textarea>
                <textarea name="answer-img" class="answer-img" placeholder="URL da imagem 2"></textarea>
  
                <textarea name="incorrect-answer}" class="incorrect-answer${i+1}" placeholder="Resposta incorreta 3"></textarea>
                <textarea name="answer-img" class="answer-img" placeholder="URL da imagem 3"></textarea>
            </div>
        `
    };

    content.innerHTML +=  `
              <div class="redButton1" onclick="verifyFinishQuiz()">
                  <p>Prosseguir pra criar níveis</p>
              </div>
                `
    //createObject(title, img, Questions, Levels);
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

function checkUrl(string, qnt) {
    try {
        let url = new URL(string)
        return true;
    }catch(err) {
        return false;
   }
 }

//Finalizada parte para verificar niveis do quizz


findQuizzes();

//Fim mateus










