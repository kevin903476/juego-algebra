document.addEventListener("DOMContentLoaded", () => {
    const character = document.getElementById("character");
    const gameContainer = document.getElementById("game-container");
    const questionBox = document.querySelector(".question-box");
    const questionText = document.getElementById("question-text");
    const answer1 = document.getElementById("answer1");
    const answer2 = document.getElementById("answer2");
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

    const obstaclePositions = [900, 1700, 2700, 3700, 4700, 5700]; // Obstáculos más separados
    let currentObstacleIndex = 0;
    let characterPosition = 50;
    let gameContainerPosition = 0;
    let correctAnswers = 0;
    let moving = false;
    let animationFrameId = null;

    

    // Ocultar modal de inicio y comenzar el juego
    startButton.addEventListener("click", () => {
        startModal.classList.add("hidden");
        moving = true;
        moveCharacter();
    });
    


    // Crear obstáculos en sus posiciones
    function createObstacles() {
        obstacleContainer.innerHTML = ''; // Limpiar obstáculos anteriores
        obstaclePositions.forEach(position => {
            let obstacle = document.createElement("div");
            obstacle.classList.add("obstacle");
            obstacle.style.left = position + "px";
            obstacle.style.display = "block";
            obstacleContainer.appendChild(obstacle);
        });
    }

    // Llamar para inicializar obstáculos
    createObstacles();

    const questions = [
        { question: "¿Cuánto es 2 + 2?", options: ["4", "5"], correct: 0 },
        { question: "¿De qué color es el cielo?", options: ["Azul", "Verde"], correct: 0 },
        { question: "¿Cuántas patas tiene un perro?", options: ["4", "6"], correct: 0 },
        { question: "¿Cuánto es 3 * 3?", options: ["6", "9"], correct: 1 }
    ];

    let characterWalkCycle = 0;

    function animateCharacterWalk() {
        // Configurar volumen inicial más bajo
        walkSound.volume = 0.3;
        if (!moving) return;
        characterWalkCycle += 0.2;
        let verticalOffset = Math.sin(characterWalkCycle) * 3;
        character.style.transform = `translateY(${verticalOffset}px)`;
    }

    function moveCharacter() {
        if (!moving) return;

        try {
            if (walkSound.paused) {
                walkSound.play();
            }

            // Restaurar el volumen cuando vuelva a moverse
            walkSound.volume = 0.3;
        } catch (e) {
            console.log("Error playing sound:", e);
        }
        
        // Mover el personaje y el contenedor del juego
        characterPosition += 5;
        gameContainerPosition -= 5;

        // Actualizar posiciones visualmente
        character.style.left = characterPosition + "px";
        gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;

        // Simular animación de caminar
        animateCharacterWalk();

        // Verificar si llegó al obstáculo
        if (characterPosition >= obstaclePositions[currentObstacleIndex] - 50) {
            moving = false;

            // Reducir volumen en lugar de pausar la música
            walkSound.volume = 0.1;

            try {
                stopSound.volume = 0.6;
                stopSound.play();
            } catch (e) {
                console.log("Error with sound:", e);
            }

            showQuestion();
            cancelAnimationFrame(animationFrameId);
        } else {
            animationFrameId = requestAnimationFrame(moveCharacter);
        }
    }

    function showQuestion() {
        questionBox.style.display = "block";
        let randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        questionText.textContent = randomQuestion.question;
        answer1.textContent = randomQuestion.options[0];
        answer2.textContent = randomQuestion.options[1];

        answer1.onclick = () => checkAnswer(0, randomQuestion.correct);
        answer2.onclick = () => checkAnswer(1, randomQuestion.correct);
    }

    function checkAnswer(selected, correct) {
        questionBox.style.display = "none";
        if (selected === correct) {
            correctAnswers++;
            if (correctAnswers >= 6) {
                winGame();
                return;
            }

            currentObstacleIndex++;
            moving = true;
            moveCharacter();
        } else {
            alert("Respuesta incorrecta. Vuelves al inicio.");
            resetGame();
        }
    }

    function winGame() {
        moving = true;
        document.getElementById("prize").style.display = "block"; // Mostrar premio

        function moveToPrize() {
            if (characterPosition < 6500) { // Mientras no haya llegado al premio
                characterPosition += 5;
                gameContainerPosition -= 5;
                character.style.left = characterPosition + "px";
                gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
                animateCharacterWalk();
                requestAnimationFrame(moveToPrize);
            } else {
                try {
                    winSound.play();
                } catch (e) {
                    console.log("Error playing win sound:", e);
                }
                showEndModal(); // Mostrar modal al ganar
            }
        }

        moveToPrize(); // Iniciar la animación hasta el premio
    }

    // Mostrar el modal de fin del juego
    function showEndModal() {
        endModal.classList.remove("hidden");
    }

    // Reiniciar el juego al hacer clic en "Reiniciar Juego"
    restartButton.addEventListener("click", () => {
        resetGame();
        endModal.classList.add("hidden");
        
    });

    // Volver al menú principal
    menuButton.addEventListener("click", () => {
        location.reload();
    });

    function resetGame() {
        characterPosition = 50;
        gameContainerPosition = 0;
        currentObstacleIndex = 0;
        correctAnswers = 0;
        characterWalkCycle = 0;
    
        character.style.left = characterPosition + "px";
        gameContainer.style.transform = `translateX(${gameContainerPosition}px)`;
    
        createObstacles();
    
        // Asegurar que el personaje vuelva a moverse después de reiniciar
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
