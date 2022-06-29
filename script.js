//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let quizzes;
let selfIds = [];
let intervalRenderQuizz;
let content = document.querySelector(".content");

//setInterval(findQuizzes, 5000);

function renderQuizzesTela1(array){
    content.innerHTML = "";
    quizzes = array.data; 
    console.log(quizzes);
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
            <div class="quizz">  
                <img src="${quizzes[i].image}">
                <span>${quizzes[i].title}</span>
            </div>         
            `;
        }
        
    }else{
        content.innerHTML+= ` 
        <div class="title">
            <span><h1>Seus Quizzes</h1></span><span><ion-icon name="add-circle"></ion-icon></span>
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
                        <div class="quizz">  
                            <img src="${quizzes[j].image}">
                            <span>${quizzes[j].title}</span>
                        </div>         
                    `;
                    flag = 1;
                }
            }
            if(flag === 0){
                allQuizzes.innerHTML+= `
                    <div class="quizz">  
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
}

function createQuizz(){

}

findQuizzes();

//Fim mateus










