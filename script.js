document.addEventListener("DOMContentLoaded", () => {
  const character = document.getElementById("character");
  const gameContainer = document.getElementById("game-container");
  const questionBox = document.querySelector(".question-box");
  const questionText = document.getElementById("question-text");
  const answerButtons = [
    document.getElementById("answer0"),
    document.getElementById("answer1"),
    document.getElementById("answer2"),
    document.getElementById("answer3"),
  ];

  const walkSound = document.getElementById("walk-sound");
  const stopSound = document.getElementById("stop-sound");
  const winSound = document.getElementById("win-sound");
  const winMessage = document.getElementById("win-message");
  const obstacleContainer = document.getElementById("obstacle-container");

  const startModal = document.getElementById("start-modal");
  const startButton = document.getElementById("start-button");
  const endModal = document.getElementById("end-modal");
  const restartButton = document.getElementById("restart-button");
  const menuButton = document.getElementById("menu-button");

  const feedbackModal = document.getElementById("feedback-modal");
  const feedbackText = document.getElementById("feedback-text");
  const feedbackOkButton = document.getElementById("feedback-ok-button");

  const obstaclePositions = [900, 1700, 2700, 3700, 4700, 5700];
  let currentObstacleIndex = 0;
  let characterPosition = 50;
  let gameContainerPosition = 0;
  let correctAnswers = 0;
  let moving = false;
  let animationFrameId = null;

  startButton.addEventListener("click", () => {
    startModal.classList.add("hidden");
    moving = true;
    moveCharacter();
  });

  function createObstacles() {
    obstacleContainer.innerHTML = "";
    obstaclePositions.forEach((position) => {
      let obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.left = position + "px";
      obstacle.style.display = "block";
      obstacleContainer.appendChild(obstacle);
    });
  }
  createObstacles();

  const questions = [
    {
      question:
        "¿Cuál de las siguientes funciones es una transformación lineal?",
      options: [
        "T(x,y) = (x+1, y)",
        "T(x,y) = (2x, y²)",
        "T(x,y) = (x−y, 3y)",
        "T(x,y) = (sin(x), y)",
      ],
      correct: 2,
      feedback:
        "La opción correcta es \\(T(x,y) = (x - y, 3y)\\), ya que cumple con las propiedades de linealidad (aditividad y homogeneidad).",
    },
    {
      question: "¿Cuál es el núcleo de \\(T(x,y,z) = (x + 2y - z, 0)\\)?",
      options: [
        "\\(\\{(0,0,0)\\}\\)",
        "\\(\\{(x,y,z) \\mid x + 2y - z = 0\\}\\)",
        "\\(\\{(x,y,z) \\mid x = z, y = 0\\}\\)",
        "\\(\\{(x,y,z) \\mid x = -2y + z\\}\\)",
      ],
      correct: 1,
      feedback:
        "El núcleo son los vectores que cumplen \\(x + 2y - z = 0\\), es decir, todos los que hacen \\(T(x,y,z) = (0,0)\\).",
    },
    {
      question:
        "Si \\(T\\) tiene la matriz \\(\\begin{bmatrix}2 & -1 \\\\ 0 & 3\\end{bmatrix}\\), ¿cuál es \\(T(1, -1)\\)?",
      options: [
        "\\((3, -3)\\)",
        "\\((1, 3)\\)",
        "\\((2, 0)\\)",
        "\\((-1, 0)\\)",
      ],
      correct: 0,
      feedback:
        "\\(T(1, -1) = (2 \\cdot 1 + (-1) \\cdot -1, 0 \\cdot 1 + 3 \\cdot (-1)) = (3, -3)\\).",
    },
    {
      question: "¿Cuál es la imagen de \\(T(x,y,z) = (x+z, 2y)\\)?",
      options: [
        "Todo \\(\\mathbb{R}^2\\)",
        "Una recta en \\(\\mathbb{R}^2\\)",
        "Un plano en \\(\\mathbb{R}^2\\)",
        "Un punto",
      ],
      correct: 0,
      feedback:
        "La matriz tiene rango 2, así que la imagen de \\(T\\) es todo \\(\\mathbb{R}^2\\).",
    },
    {
      question:
        "¿Cuál es la matriz de \\(T(ax + b) = (2a + b)x + 3a\\) respecto a \\(B = \\{1, x\\}\\)?",
      options: [
        "\\(\\begin{bmatrix}3 & 2 \\\\ 0 & 1\\end{bmatrix}\\)",
        "\\(\\begin{bmatrix}2 & 1 \\\\ 3 & 0\\end{bmatrix}\\)",
        "\\(\\begin{bmatrix}3 & 0 \\\\ 2 & 1\\end{bmatrix}\\)",
        "\\(\\begin{bmatrix}0 & 3 \\\\ 1 & 2\\end{bmatrix}\\)",
      ],
      correct: 2,
      feedback:
        "\\(T(1) = x \\Rightarrow [0,1],\\ T(x) = 2x + 3 \\Rightarrow [3,2]\\), por tanto matriz: \\(\\begin{bmatrix}3 & 0 \\\\ 2 & 1\\end{bmatrix}\\).",
    },
    {
      question: "Si \\(\\ker(T) = \\{(0,0)\\}\\), entonces \\(T\\) es:",
      options: ["Sobreyectiva", "Inyectiva", "Biyectiva", "No lineal"],
      correct: 1,
      feedback:
        "Si el núcleo solo contiene al vector cero, entonces \\(T\\) es inyectiva.",
    },
  ];

  let characterWalkCycle = 0;
  function animateCharacterWalk() {
    if (!moving) return;
    characterWalkCycle += 0.2;
    let verticalOffset = Math.sin(characterWalkCycle) * 3;
    character.style.transform = `translateY(${verticalOffset}px)`;
  }

  function moveCharacter() {
    if (!moving) return;

    try {
      if (walkSound.paused) walkSound.play();
      walkSound.volume = 0.3;
    } catch (e) {
      console.log("Error playing sound:", e);
    }

    characterPosition += 5;
    gameContainerPosition -= 5;
    character.style.left = characterPosition + "px";
    gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
    animateCharacterWalk();

    if (characterPosition >= obstaclePositions[currentObstacleIndex] - 50) {
      moving = false;
      walkSound.volume = 0.1;
      stopSound.play();
      showQuestion();
      cancelAnimationFrame(animationFrameId);
    } else {
      animationFrameId = requestAnimationFrame(moveCharacter);
    }
  }

  function showQuestion() {
    questionBox.style.display = "block";
    const currentQuestion = questions[currentObstacleIndex];
    questionText.innerHTML = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
      answerButtons[index].style.display = "block";
      answerButtons[index].innerHTML = option;
      answerButtons[index].onclick = () => checkAnswer(index, currentQuestion);
    });

    // Ocultar botones no necesarios si hay menos de 4
    for (let i = currentQuestion.options.length; i < 4; i++) {
      answerButtons[i].style.display = "none";
    }

    // 🔁 Esto fuerza a MathJax a renderizar las fórmulas nuevas
    if (window.MathJax) {
      MathJax.typeset();
    }
  }

  feedbackOkButton.addEventListener("click", () => {
    feedbackModal.classList.add("hidden");
    resetGame();
  });
  function checkAnswer(selected, questionData) {
    questionBox.style.display = "none";
    if (selected === questionData.correct) {
      correctAnswers++;
      if (correctAnswers >= 6) {
        winGame();
        return;
      }
      currentObstacleIndex++;
      moving = true;
      moveCharacter();
    } else {
      feedbackText.innerHTML = "❌ " + questionData.feedback;
      feedbackModal.classList.remove("hidden");
      if (window.MathJax) MathJax.typeset();
    }
  }

  function winGame() {
    moving = true;
    document.getElementById("prize").style.display = "block";

    function moveToPrize() {
      if (characterPosition < 6500) {
        characterPosition += 5;
        gameContainerPosition -= 5;
        character.style.left = characterPosition + "px";
        gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
        animateCharacterWalk();
        requestAnimationFrame(moveToPrize);
      } else {
        winSound.play();
        showEndModal();
      }
    }

    moveToPrize();
  }

  function showEndModal() {
    endModal.classList.remove("hidden");
  }

  restartButton.addEventListener("click", () => {
    resetGame();
    endModal.classList.add("hidden");
  });

  menuButton.addEventListener("click", () => {
    location.reload();
  });

  function resetGame() {
    correctAnswers = 0;
    currentObstacleIndex = 0;
    characterPosition = 50;
    gameContainerPosition = 0;
    character.style.left = characterPosition + "px";
    gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
    createObstacles();
    moving = true;
    moveCharacter();
  }
});
