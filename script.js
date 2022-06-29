//inicio Mateus
const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let quizzes;
let selfIds = [];


function renderQuizzes(array){
    quizzes = array.data;
    let content = document.querySelector(".content")
    content = "";

    if(selfIds.length===0){
        content.innerHTML+=`
        <div class="my-quizzes-null">
            <span>
                Você não criou nenhum<br>
                quizz ainda :(
            </span>
            <button>Criar Quizz</button>
        </div>    
        `
        content.innerHTML+= `
        <h1>Todos os Quizzes</h1>
        <div class="all-quizzes">
        </div>
        `
        let allQuizzes = document.querySelector(".all-quizzes");                
        for(let i = 0; i < quizzes.length; i++){
            allQuizzes.innerHTML+= `
            <div class="quizz">  
                <img src="${quizzes[i].image}">
                <span>${quizzes[i].title}</span>
            </div>         
            `
        }
    }else{
        content.innerHTML+= `<h1>Seus Quizzes<ion-icon name="add-circle"></ion-icon></h1>`
        for(let i = 0; i < quizzes.length; i++){
            for(let j = 0; j < selfIds.length; j++){
                if(quizzes[i].id === selfIds[j]){
                    
                }
            }
        }
    }

}

function findQuizzes(){
   const promise = axios.get(url);
   promise.then(renderQuizzes);
}


//Fim mateus










