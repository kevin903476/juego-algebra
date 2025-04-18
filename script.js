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

  const btnComoJugar = document.getElementById("how-to-play");
  const modalComoJugar = document.getElementById("modal-como-jugar");
  const cerrar = document.getElementById("cerrar-modal");

  btnComoJugar.addEventListener("click", () => {
    modalComoJugar.classList.remove("hidden");
  });

  cerrar.addEventListener("click", () => {
    modalComoJugar.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modalComoJugar) {
      modalComoJugar.classList.add("hidden");
    }
  });

  const obstaclePositions = [900, 1700, 2700, 3700, 4700, 5700];
  let currentObstacleIndex = 0;
  let characterPosition = 50;
  let gameContainerPosition = 0;
  let correctAnswers = 0;
  let moving = false;
  let animationFrameId = null;

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
        "Demuestre que \\( {R}^2 \\to {R}^2 = T \\begin{pmatrix} X \\\\ Y \\end{pmatrix} = \\begin{pmatrix} x+3y \\\\ x+2y \\end{pmatrix} ;  u = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} ;  v = \\begin{pmatrix} 5 \\\\ 7 \\end{pmatrix} \\)",

      options: [
        "\\( T(u+v)= \\begin{pmatrix} 15 \\\\ 15 \\end{pmatrix} \\)",
        "\\( T(u+v)= \\begin{pmatrix} 22 \\\\ 16 \\end{pmatrix} \\)",
        "\\( T(u+v)= \\begin{pmatrix} 17 \\\\ 55 \\end{pmatrix} \\)",
        "\\( T(u+v)= \\begin{pmatrix} 40 \\\\ 56 \\end{pmatrix} \\)",
      ],
      correct: 1,
      feedback: `
  La opción correcta es:<br><br>
  \\( T(u+v) = \\begin{pmatrix} 22 \\\\ 16 \\end{pmatrix} \\)<br><br>
  Desglose paso a paso:<br><br>
  \\( T(u+v) = u + v = \\begin{pmatrix} 7 + 3 \\cdot 10 \\\\ 7 + 2 \\cdot 10 \\end{pmatrix} = \\begin{pmatrix} 37 \\\\ 27 \\end{pmatrix} \\)<br><br>
  \\( T(\\alpha \\cdot u) = 2 \\cdot \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 4 + 3 \\cdot 6 \\\\ 4 + 2 \\cdot 6 \\end{pmatrix} = \\begin{pmatrix} 22 \\\\ 16 \\end{pmatrix} \\)<br><br>
  \\( \\alpha \\cdot T(u) = 2 \\cdot \\begin{pmatrix} 11 \\\\ 8 \\end{pmatrix} = \\begin{pmatrix} 22 \\\\ 16 \\end{pmatrix} \\)`,
    },

    {
      question:
        "¿El dominio y codominio en las transformaciones lineales deben ser espacios vectoriales?",
      options: ["Verdadero", "Falso"],
      correct: 0,
      feedback: "La opcion correcta es VERDADERO",
    },

    {
      question:
        "\\( \\text{Consideremos } f: \\mathbb{R} \\to \\mathbb{R}, \\text{ función } f(x) = 3x; \\quad u = 6; \\quad v = 9; \\quad \\alpha = 2 \\)",
      options: [
        "\\( T(u+v) = 25 \\quad T(\\alpha \\cdot u) = 56 \\)",
        "\\( T(u+v) = 45 \\quad T(\\alpha \\cdot u) = 36 \\)",
        "\\( T(u+v) = 50 \\quad T(\\alpha \\cdot u) = 89 \\)",
        "\\( T(u+v) = 85 \\quad T(\\alpha \\cdot u) = 15 \\)",
      ],
      correct: 1,
      feedback: ` la opcion correcta es: <br><br>
         \\( T(u+v) = 45 \\quad T(\\alpha \\cdot u) = 36 \\)<br><br>
         Desglose paso a paso:<br><br>
         \\( T(u+v) = 3(15) = 45; \\quad T(u) + T(v) = 3(6) = 18 + 3(9) = 27 = 45 \\)<br><br>
         \\( T(\\alpha \\cdot u) = 2(6) = 12; \\quad 3(12) = 36 \\)<br><br>
         \\( \\alpha \\cdot T(u) = 3(18) = 36 \\)`,
    },

    {
      question: "El endomorfismo se presenta cuando?",
      options: [
        "El dominio es igual al codominio",
        "El dominio es mayor que el  codominio",
        "El dominio es diferente al  codominio",
      ],
      correct: 0,
      feedback:
        "La opcion correcta es El dominio es igual al codominio, ya que para poder cumplir como un endomorfismo se presenta cuando el dominio y el codominio son iguales",
    },
    {
      question: `
      \\( \\text{Determine si } \\mathbb{R}^3 \\to \\mathbb{R}^3, \\; T(x, y, z) = (-x + 2y, x + y + z, 2x - y + z); \\;
      u = (1, 2, -1); \\; v = (1, 3, 2); \\; \\alpha = 2 \\)
    `,
      options: [
        "\\( \\alpha \\cdot T(u) = (7, 5, -3) \\)",
        "\\( \\alpha \\cdot T(u) = (6, -4, 2) \\)",
        "\\( \\alpha \\cdot T(u) = (6, 4, -2) \\)",
        "\\( \\alpha \\cdot T(u) = (-6, 4, -2) \\)",
      ],
      correct: 2,
      feedback: `
      La opción correcta es: <br><br>
      \\( \\alpha \\cdot T(u) = (6, 4, -2) \\)<br><br>
      
      Desglose paso a paso:<br><br>
      \\( T(u+v) = (-2 + 2 \\cdot 5, 2 + 5 + 1, 2 \\cdot 2 - 5 + 1) = (8, 8, 0) \\)<br><br>
      
      \\( T(u) + T(v) = (-1 + 2 \\cdot 2, 1 + 2 + (-1), 2 \\cdot 1 - 2 + (-1)) + (-1 + 2 \\cdot 3, 1 + 3 + 2, 2 \\cdot 1 - 3 + 2) \\)<br>
      \\( = (3, 2, -1) + (5, 6, 1) = (8, 8, 0) \\)<br><br>
      
      \\( T(\\alpha \\cdot u) = 2(1,2,-1) = (2,4,-2) = (-2 + 2 \\cdot 4, 2 + 4 + (-2), 2 \\cdot 2 - 4 + (-2)) \\)<br><br>
      
      \\( \\alpha \\cdot T(u) = 2 \\cdot (3,2,-1) = (6,4,-2) \\)
    `,
    },

    {
      question:
        "\\( \\text{Determine el núcleo para } T: \\mathbb{R}^2 \\to \\mathbb{R}^2, \\; T(x, y) = (7x - 9y, 3x - 7y) \\)",
      options: [
        "\\( \\text{Núcleo} = \\left\\{ (y, x) \\right\\} = \\left\\{ (0, 0) \\right\\} \\)",
        "\\( \\text{Núcleo} = \\left\\{ (x, y) \\right\\} = \\left\\{ (1, 0) \\right\\} \\)",
        "\\( \\text{Núcleo} = \\left\\{ (x, y) \\right\\} = \\left\\{ (0, 1) \\right\\} \\)",
        "\\( \\text{Núcleo} = \\left\\{ (x, y) \\right\\} = \\left\\{ (0, 0) \\right\\} \\)",
      ],
      correct: 3,
      feedback: `
          La opción correcta es: <br><br>
        \\( \\text{Núcleo} = \\left\\{ (x, y) \\right\\} = \\left\\{ (0, 0) \\right\\} \\)<br><br>
        Desglose paso a paso:<br><br>
        \\( 7x - 9y = 0 \\)<br><br>
        \\( 3x - 7y = 0 \\)<br><br>
        x=0 / y=0`,
    },
    {
      question: "Un monomorfismo se presenta cuando",
      options: ["Es sobreyectiva", "Es biyectiva", "Es inyectiva"],
      correct: 2,
      feedback: `
          La opción correcta es: <br><br>
       Inyectiva, esto porque V: T(u)=T(v)`,
    },
    {
      question: `\\( \\text{Calcule la aplicación lineal de } T: \\mathbb{R}^3 \\to \\mathbb{R}^3, \\text{ encuentre la fórmula y calcule } (3,2,5) \\)<br>
      T(1,0,0)=(2,-3)<br><br>
      T(0,1,0)=(1,1)<br><br>
      T(0,0,1)=(6,5)`,
      options: [
        "\\( \\text{Fórmula} = (5x + 5y + z, 3x + 2y + 5z) \\quad \\text{y el cálculo de} \\quad (3,2,5) = (38,18) \\)",
        "\\( \\text{Fórmula} = (x + 2y + 7z, -8x + 9y + 2z) \\quad \\text{y el cálculo de} \\quad (3,2,5) = (38,18) \\)",
        "\\( \\text{Fórmula} = (2x + 1y + 6z, -3x + 1y + 5z) \\quad \\text{y el cálculo de} \\quad (3,2,5) = (38,18) \\)",
        "\\( \\text{Fórmula} = (-2x + 1y + 6z, 3x + 1y - 5z) \\quad \\text{y el cálculo de} \\quad (3,2,5) = (38,18) \\)",
      ],
      correct: 2,
      feedback: `
          La opción correcta es: <br><br>
       \\( \\text{Fórmula} = (2x + 1y + 6z, -3x + 1y + 5z) \\quad \\text{y el cálculo de} \\quad (3,2,5) = (38,18) \\)<br><br>
           Desglose paso a paso:<br><br>
           \\( T(x,y,z) = x T(1,0,0) + y T(0,1,0) + z T(0,0,1) \\)<br><br>
           \\( x(2,-3) + y(1,1) + z(6,5) \\)<br><br>
           \\( (2x, -3x) + (1y + 1y) + (6z, 5z) = (2x + 1y + 6z, -3x + 1y + 5z) \\)<br><br>
           \\( (3,2,5) = (2 \\cdot 3 + 1 \\cdot 2 + 6 \\cdot 5, -3 \\cdot 3 + 1 \\cdot 2 + 5 \\cdot 5) = (38,18) \\)`,
    },
    {
      question: "Es epimorfismo cuando",
      options: ["Es sobreyectiva", "Es biyectiva", "Es inyectiva"],
      correct: 0,
      feedback: `
          La opción correcta es: <br><br>
       Sobreyectiva, esto porque V/ w=T(v)`,
    },
    {
      question:
        "\\( \\text{Determine el núcleo para } T: \\mathbb{R}^2 \\to \\mathbb{R}^2, \\; T(a,b) = (10a + 7b, 5a - 3b, -15a - 12b) \\)",
      options: [
        "\\( \\text{Núcleo} = (a, b) = (0, 0) \\)",
        "\\( \\text{Núcleo} = (b, a) = (0, 0) \\)",
        "Infinitas",
      ],
      correct: 2,
      feedback: `
          La opción correcta es: Infinitas <br>
      Ya  que el nucleo da respuestas infinitas`,
    },
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Escoge un índice aleatorio entre 0 e i (inclusive)
      const j = Math.floor(Math.random() * (i + 1));

      // Intercambia el elemento actual con el elemento en la posición aleatoria
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  startButton.addEventListener("click", () => {
    //shuffleArray(questions); // Mezcla las preguntas al iniciar el juego
    startModal.classList.add("hidden");
    moving = true;
    moveCharacter();
  });

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

    // Esto fuerza a MathJax a renderizar las fórmulas nuevas
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
