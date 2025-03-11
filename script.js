document.addEventListener("DOMContentLoaded", () => {
  // 🎮 Captura de elementos del juego
  const character = document.getElementById("character"); // Personaje principal
  const gameContainer = document.getElementById("game-container"); // Contenedor del juego (mueve el fondo)
  const questionBox = document.querySelector(".question-box"); // Caja de preguntas
  const questionText = document.getElementById("question-text"); // Texto de la pregunta
  const answer1 = document.getElementById("answer1"); // Botón de respuesta 1
  const answer2 = document.getElementById("answer2"); // Botón de respuesta 2
  const walkSound = document.getElementById("walk-sound"); // Sonido al caminar
  const stopSound = document.getElementById("stop-sound"); // Sonido al detenerse
  const winSound = document.getElementById("win-sound"); // Sonido de victoria
  const winMessage = document.getElementById("win-message"); // Mensaje de victoria
  const obstacleContainer = document.getElementById("obstacle-container"); // Contenedor de obstáculos

  // 🎮 Modales de inicio y final del juego
  const startModal = document.getElementById("start-modal"); // Modal de inicio
  const startButton = document.getElementById("start-button"); // Botón para empezar el juego
  const endModal = document.getElementById("end-modal"); // Modal de fin del juego
  const restartButton = document.getElementById("restart-button"); // Botón para reiniciar el juego
  const menuButton = document.getElementById("menu-button"); // Botón para volver al menú principal

  // 📌 Posiciones de los obstáculos en el camino
  const obstaclePositions = [900, 1700, 2700, 3700, 4700, 5700];
  let currentObstacleIndex = 0; // Índice del obstáculo actual
  let characterPosition = 50; // Posición del personaje en píxeles
  let gameContainerPosition = 0; // Posición del fondo del juego
  let correctAnswers = 0; // Contador de respuestas correctas
  let moving = false; // Estado del movimiento del personaje
  let animationFrameId = null; // ID para manejar la animación

  // ▶ Evento para iniciar el juego al hacer clic en el botón "Iniciar"
  startButton.addEventListener("click", () => {
    startModal.classList.add("hidden"); // Oculta el modal de inicio
    moving = true; // Activa el movimiento del personaje
    moveCharacter(); // Inicia el movimiento del personaje
  });

  // 🔧 Función para crear obstáculos en sus posiciones definidas
  function createObstacles() {
    obstacleContainer.innerHTML = ""; // Limpia obstáculos previos
    obstaclePositions.forEach((position) => {
      let obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.left = position + "px";
      obstacle.style.display = "block";
      obstacleContainer.appendChild(obstacle); // Agregar obstáculos al contenedor
    });
  }
  createObstacles(); // Llamar a la función para inicializar los obstáculos

  // 🧠 Preguntas y respuestas del juego
  const questions = [
    { question: "¿Cuánto es 2 + 2?", options: ["4", "5"], correct: 0 },
    {
      question: "¿De qué color es el cielo?",
      options: ["Azul", "Verde"],
      correct: 0,
    },
    {
      question: "¿Cuántas patas tiene un perro?",
      options: ["4", "6"],
      correct: 0,
    },
    { question: "¿Cuánto es 3 * 3?", options: ["6", "9"], correct: 1 },
  ];

  // 🎭 Animación de caminata del personaje
  let characterWalkCycle = 0;
  function animateCharacterWalk() {
    if (!moving) return;
    characterWalkCycle += 0.2;
    let verticalOffset = Math.sin(characterWalkCycle) * 3;
    character.style.transform = `translateY(${verticalOffset}px)`; // Movimiento vertical
  }

  // 🚶‍♂️ Función que mueve al personaje y al fondo del juego
  function moveCharacter() {
    if (!moving) return; // Si el personaje no se mueve, salir

    try {
      if (walkSound.paused) {
        walkSound.play(); // Inicia sonido de caminar si no está sonando
      }
      walkSound.volume = 0.3; // Ajusta volumen
    } catch (e) {
      console.log("Error playing sound:", e);
    }

    // Mueve al personaje y al fondo del juego
    characterPosition += 5;
    gameContainerPosition -= 5;
    character.style.left = characterPosition + "px";
    gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
    animateCharacterWalk(); // Simula la caminata

    // Verifica si el personaje ha alcanzado un obstáculo
    if (characterPosition >= obstaclePositions[currentObstacleIndex] - 50) {
      moving = false;
      walkSound.volume = 0.1; // Reduce el volumen en lugar de pausar el sonido
      stopSound.play(); // Reproduce sonido de frenado
      showQuestion(); // Muestra una pregunta
      cancelAnimationFrame(animationFrameId); // Detiene la animación
    } else {
      animationFrameId = requestAnimationFrame(moveCharacter); // Continúa la animación
    }
  }

  // ❓ Muestra una pregunta al llegar a un obstáculo
  function showQuestion() {
    questionBox.style.display = "block";
    let randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    questionText.textContent = randomQuestion.question;
    answer1.textContent = randomQuestion.options[0];
    answer2.textContent = randomQuestion.options[1];

    answer1.onclick = () => checkAnswer(0, randomQuestion.correct);
    answer2.onclick = () => checkAnswer(1, randomQuestion.correct);
  }

  // ✅ Verifica si la respuesta es correcta o incorrecta
  function checkAnswer(selected, correct) {
    questionBox.style.display = "none"; // Oculta la caja de preguntas

    if (selected === correct) {
      // ✅ Respuesta correcta → avanzar en el juego
      correctAnswers++;
      if (correctAnswers >= 6) {
        winGame();
        return;
      }
      currentObstacleIndex++;
      moving = true;
      moveCharacter(); // Continúa el juego
    } else {
      // ❌ Respuesta incorrecta → mostrar mensaje antes de reiniciar
      let reason = "Respuesta incorrecta. ";

      // Agregar explicaciones personalizadas según la pregunta
      if (questionText.textContent === "¿Cuánto es 2 + 2?") {
        reason += "La respuesta correcta es 4.";
      } else if (questionText.textContent === "¿De qué color es el cielo?") {
        reason += "El cielo suele ser azul debido a la dispersión de la luz.";
      } else if (
        questionText.textContent === "¿Cuántas patas tiene un perro?"
      ) {
        reason += "Un perro tiene 4 patas.";
      } else if (questionText.textContent === "¿Cuánto es 3 * 3?") {
        reason += "El resultado correcto es 9.";
      }

      alert(reason); // Mostrar el mensaje explicativo
      resetGame(); // Luego, reiniciar el juego
    }
  }

  // 🎉 Función cuando el jugador gana el juego
  function winGame() {
    moving = true;
    document.getElementById("prize").style.display = "block"; // Muestra el premio

    function moveToPrize() {
      if (characterPosition < 6500) {
        characterPosition += 5;
        gameContainerPosition -= 5;
        character.style.left = characterPosition + "px";
        gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
        animateCharacterWalk();
        requestAnimationFrame(moveToPrize); // Sigue moviendo hasta el premio
      } else {
        winSound.play(); // Reproduce sonido de victoria
        showEndModal();
      }
    }

    moveToPrize(); // Inicia la animación de caminar hacia el premio
  }

  // 🏁 Muestra el modal de fin del juego
  function showEndModal() {
    endModal.classList.remove("hidden");
  }

  // 🔄 Evento para reiniciar el juego
  restartButton.addEventListener("click", () => {
    resetGame();
    endModal.classList.add("hidden");
  });

  // ⏪ Botón para volver al menú principal
  menuButton.addEventListener("click", () => {
    location.reload(); // Recarga la página para reiniciar el juego
  });

  // 🔄 Función para reiniciar el juego
  function resetGame() {
    characterPosition = 50;
    gameContainerPosition = 0;
    currentObstacleIndex = 0;
    correctAnswers = 0;
    characterWalkCycle = 0;

    character.style.left = characterPosition + "px";
    gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
    createObstacles();
    moving = true;
    requestAnimationFrame(moveCharacter);

    // Reiniciar la música del caminar
    try {
      walkSound.pause();
      walkSound.currentTime = 0;
      walkSound.play();
    } catch (e) {
      console.log("Error reiniciando la música:", e);
    }
  }
});
