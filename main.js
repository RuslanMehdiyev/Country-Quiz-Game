const flagEl = document.querySelector(".country-flag");
const gameDiv = document.querySelector(".game");
const flagOrCapital = document.querySelector(".capital-flag");
const answerEl = document.querySelector(".answers");
const modeEl = document.querySelector(".mode");

let countries = [];
const getCountries = async () => {
  countries = await fetch("https://restcountries.com/v3.1/all").then((res) =>
    res.json()
  );
  makeQuestion();
};
getCountries();

let mode = 4;
let score = 0;

document.getElementById("mode").addEventListener("change", (e) => {
  mode = +e.target.value;
  score = 0;
  makeQuestion();
});

const makeQuestion = () => {
  let randomIndex = Math.floor(Math.random() * countries.length);
  let randomCountry = {
    name: countries[randomIndex].name.common,
    flag: countries[randomIndex].flags.svg,
    capital: countries[randomIndex].capital,
  };

  let twoRandom = Math.floor(Math.random() * 2);

  flagEl.classList.remove("none");
  modeEl.classList.remove("none");
  if (twoRandom == 0) {
    flagEl.classList.add("none");
    flagOrCapital.innerHTML = randomCountry.capital + " is the capital of?";
  } else {
    flagOrCapital.innerHTML = "Which country does this flag belong to?";
  }

  let answers = [randomCountry.name];

  for (let i = 0; i < mode - 1; i++) {
    let otherRandoms = Math.floor(Math.random() * countries.length);

    while (answers.includes(countries[otherRandoms].name.common)) {
      otherRandoms = Math.floor(Math.random() * countries.length);
    }

    answers.push(countries[otherRandoms].name.common);
  }

  flagEl.setAttribute("src", randomCountry.flag);
  answerEl.innerHTML = "";

  answers.sort(() => 0.5 - Math.random());

  answers.map((e) => {
    let asnSpan = document.createElement("span");
    asnSpan.textContent = e;
    answerEl.append(asnSpan);

    asnSpan.addEventListener("click", () => {
      if (e === randomCountry.name) {
        score++;
        asnSpan.classList.add("correct");
        asnSpan.innerHTML +=
          '<i class="fa fa-check" style="font-size:20px"></i>';

        let allAnswers = [...document.querySelectorAll(".answers span")];
        allAnswers.forEach((e) => {
          e.classList.add("eventNone");
        });

        setTimeout(makeQuestion, 2000);
      } else {
        asnSpan.classList.add("wrong");
        asnSpan.innerHTML +=
          '<i class="fa fa-close" style="font-size:20px"></i>';

        let allAnswers = [...document.querySelectorAll(".answers span")];
        allAnswers.forEach((e) => {
          e.classList.add("eventNone");
        });

        let correctAnswer = allAnswers.find(
          (e) => e.textContent === randomCountry.name
        );
        correctAnswer.classList.add("correct");
        setTimeout(resultPage, 2000);
      }
    });
  });
};

function resultPage() {
  flagEl.classList.add("none");
  flagOrCapital.innerHTML = "";
  answerEl.innerHTML = "";
  modeEl.classList.add("none");
  let div = document.createElement("div");
  div.classList.add("result-div");
  let resultImg = document.createElement("img");
  resultImg.classList.add("result-img");
  resultImg.src = "./img/cupImg.png";

  let resultText = document.createElement("p");
  resultText.innerHTML = `You got ${score} correct answers`;

  let tryAgainBtn = document.createElement("button");
  tryAgainBtn.classList.add("try-again-btn");
  tryAgainBtn.innerHTML = "Try Again";

  div.append(resultImg, resultText, tryAgainBtn);
  gameDiv.appendChild(div);
  tryAgainBtn.addEventListener("click", () => {
    div.innerHTML = "";
    score = 0;
    makeQuestion();
  });
}
