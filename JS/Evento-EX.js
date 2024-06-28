document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById("game-container");
    let score = 0; //puntos
    let record = 0; //record
    let limite = 0; //limite de michis
    let interval; // Variable para almacenar el intervalo del juego

    gameContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("square")) {
            // Eliminar el cuadrado clicado y actualizar el puntaje y el límite
            event.target.parentNode.removeChild(event.target);
            score++;
            limite--;
            updateScore();
            updateLimite();
        }
    });

    startGame(); // Iniciar el juego al cargar la página

    function startGame() {
        // Crear un intervalo que agregue un cuadrado cada segundo
        interval = setInterval(addSquare, 1000);
    }

    function addSquare() {
        // Crear un nuevo cuadrado con la clase 'square'
        const square = document.createElement("div");
        square.classList.add("square");

        const size = 50; // Tamaño del cuadrado
        const maxX = gameContainer.clientWidth - size;
        const maxY = gameContainer.clientHeight - size;

        // Colocar el cuadrado en una posición aleatoria dentro del contenedor
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        square.style.left = randomX + "px";
        square.style.top = randomY + "px";

        gameContainer.appendChild(square);
        limite++; // Incrementar el límite al agregar un nuevo cuadrado
        updateLimite(); // Actualizar el límite en pantalla
        
        // Calcular la velocidad de aparición basada en el puntaje actual
        const speed = 1000 - (score * 10);

        // Limpiar el intervalo anterior y establecer uno nuevo con la velocidad actualizada
        clearInterval(interval);
        interval = setInterval(addSquare, speed > 0 ? speed : 100); // Evitar que la velocidad sea menor a 100 ms

        if (limite >= 11) { 
            // Detener el juego cuando el límite alcanza o supera 11
            stopGame();
            if (score > record) {
                // Actualizar el récord si el puntaje actual es mayor
                record = score;
                document.getElementById("record").innerText = "Record: " + record;
            }
            alert("¡Game Over! Has conseguido " + score + " puntos"); // Mostrar mensaje de fin del juego
        }
    }

    function stopGame() {
        // Detener el intervalo para detener el juego
        clearInterval(interval);
        document.getElementById("limite").innerText = "El límite es " + 0;
        // Eliminar todos los cuadrados de la pantalla
        gameContainer.innerHTML = ''; // Limpia todos los cuadrados

        // Cambiar el contenido del contenedor del juego por una imagen
        const endImage = document.createElement("div");
        endImage.style.backgroundImage = "url('../Imagenes/gameover.jpg')"; // Reemplaza 'game_over.png' con la ruta a tu imagen
        endImage.style.width = "100%";
        endImage.style.height = "100%";
        endImage.style.backgroundSize = "cover";
        endImage.style.backgroundPosition = "center";
        gameContainer.appendChild(endImage); // Agrega la imagen de "game over"
    }

    function updateScore() {
        // Actualizar el texto de puntaje
        document.getElementById("score").innerText = "Puntuación: " + score;
    }

    function updateLimite() {
        // Actualizar el texto de límite
        document.getElementById("limite").innerText = "El límite es " + (10 - limite);
    }

    document.getElementById("restart-btn").addEventListener("click", function() {
        clearInterval(interval); // Limpiar el intervalo actual al reiniciar
        score = 0; // Reiniciar el puntaje
        limite = 0; // Reiniciar el límite
        updateScore();
        updateLimite();
        gameContainer.innerHTML = ''; // Limpiar el contenedor del juego

        startGame(); // Iniciar el juego nuevamente
    });
});
