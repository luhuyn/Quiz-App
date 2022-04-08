// TODO(you): Write the JavaScript necessary to complete the assignment.
const introduction = document.querySelector("#introduction");
const attemptQuiz = document.querySelector('#attempt-quiz');
const reviewQuiz = document.querySelector('#review-quiz');
let submitButton = document.querySelector('#submitquiz');

// Start game
const startButton = document.querySelector('#startquiz');
startButton.addEventListener('click', async ()=>{
  console.log('helo')
  let api = 'https://wpr-quiz-api.herokuapp.com/attempts';
  let data = await fetchApi(api);
  attemptQuiz.setAttribute('data-id',`${data._id}`);
  renderQuestion(data.questions)
  attemptQuiz.scrollIntoView();
  switchAttempt();
  submitButton = document.querySelector('#submitquiz');
  console.log(submitButton);
  submitButton.addEventListener('click', ()=>{
  id = attemptQuiz.getAttribute('data-id');
  switchReview();
  compareAns(id);
});
});

// Get list questions from api
const fetchApi = async (api) => {
  const result = await fetch(api, {
      method: "POST",
    })
    return result.json();
}

// Render list question into attemp quizz
const renderQuestion = (listQues)=>{
  for(let i=0;i<listQues.length;i++){
    let form = document.createElement('form');
    let h2 = document.createElement('h2');
    h2.textContent = `Question ${i+1} of 10`;
    let h3 = document.createElement('h3');
    h3.textContent = listQues[i].text;
    form.appendChild(h2);
    form.appendChild(h3);
    for(let j=0;j<listQues[i].answers.length;j++){
      let option = document.createElement('div');
      option.classList.add('option')
      let input = document.createElement('input');
      input.type = 'radio';
      input.setAttribute('id', `question${i+1}question${j+1}`);
      input.value = j;
      input.setAttribute('name', listQues[i]._id);
      let label = document.createElement('label');
      label.textContent = listQues[i].answers[j];
      label.setAttribute('for', `question${i+1}question${j+1}`);
      option.appendChild(input);
      option.appendChild(label);
      form.appendChild(option)
    }
    attemptQuiz.appendChild(form);
  }
  attemptQuiz.innerHTML+=`
  <div class="greenbutton">
    <button id = "submitquiz">Submit your answers ❯ </button>
  </div> `
}

function switchAttempt(){
  introduction.classList.add('hidden');
  attemptQuiz.classList.remove('hidden');
  
}

function switchReview(){
  let submit = document.querySelector('#submitquiz').parentElement.style.display = 'none';
  reviewQuiz.classList.remove('hidden');
}



const compareAns = async (id) => {
  let userAns = {
    answers: {
    }
  }
  // get answer from user
  let input = document.querySelectorAll('input');
    input.forEach(e=>{
      if(e.checked){
        userAns.answers[e.name] = e.value;
      }
    })
    let api = `https://wpr-quiz-api.herokuapp.com/attempts/${id}/submit`;
    let response = await getCorrectAns(api,userAns);
    let correctAns = response.correctAnswers;  
    input.forEach(e=>{
      var correctAnswer = document.createElement('div');
        correctAnswer.textContent = 'Correct answer';
        correctAnswer.classList.add('correctanswer')
        var wrongAns = document.createElement('div');
        wrongAns.textContent = 'Your answer';
        wrongAns.classList.add('youranswer')
      // If user has correct answers
      if(e.value == correctAns[e.name] && e.checked){
        console.log(e.nextSibling)
        e.classList.add('right')
        e.nextSibling.classList.add('right')
        e.parentElement.appendChild(correctAnswer);
      }
      // Correct answers but user dont select
      if(e.value == correctAns[e.name] && e.checked == false){
        e.classList.add('correct')
        e.nextSibling.classList.add('correct')
        e.parentElement.appendChild(correctAnswer);
      }
      // Answer's user is wrong
      if(e.checked==true && e.value != correctAns[e.name]){ 
        e.classList.add('wrong')
        e.parentElement.children[1].classList.add('wrong')
        e.parentElement.appendChild(wrongAns);
      }
    })
    document.querySelector('#numberofcorrectedanswers').textContent = `${response.score}/10`;
    document.querySelector('#percent').innerHTML =  `<strong>${response.score*10}%</strong>`
    document.querySelector('#text').textContent= response.scoreText;
}

const getCorrectAns = async (api, userAns) => {
  const result = await fetch(api, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userAns)
    })
    return result.json();
}



async function redoQuiz(){
  attemptQuiz.textContent = "";
  introduction.classList.remove('hidden');
  attemptQuiz.classList.add('hidden');
  reviewQuiz.classList.add('hidden');
}
const redoButton = document.querySelector('#tryagain');
redoButton.addEventListener('click', redoQuiz);

