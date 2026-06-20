
const board = document.getElementById("board");

const GRID_SIZE = 20;

let score = 0;
let highScore =
    localStorage.getItem("highScore") || 0;

let currentPath = [];

let aiMode = true;

let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
];

let direction = "RIGHT";

let food = {
    x: 5,
    y: 5
};

document.getElementById("highScore")
.innerText =
"High Score: " + highScore;

// Keyboard Controls
document.addEventListener("keydown", (event) => {

    if(event.key === "a" || event.key === "A"){

        aiMode = true;

        currentPath = [];
        document.getElementById("mode").innerText =
        "Mode: AI";
    }

    if(event.key === "m" || event.key === "M"){

        aiMode = false;

        currentPath = [];

        document.getElementById("mode").innerText =
        "Mode: Manual";
    }

    if(event.key === "r" || event.key === "R"){

        localStorage.removeItem("highScore");

        highScore = 0;

        document.getElementById("highScore").innerText =
        "High Score: 0";
    }

    if(!aiMode){

        if(event.key === "ArrowUp" &&
           direction !== "DOWN"){
            direction = "UP";
        }

        if(event.key === "ArrowDown" &&
           direction !== "UP"){
            direction = "DOWN";
        }

        if(event.key === "ArrowLeft" &&
           direction !== "RIGHT"){
            direction = "LEFT";
        }

        if(event.key === "ArrowRight" &&
           direction !== "LEFT"){
            direction = "RIGHT";
        }
    }

});

function drawBoard() {

    board.innerHTML = "";

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {

        const cell = document.createElement("div");

        cell.classList.add("cell");

        board.appendChild(cell);
    }

    if(aiMode){
        drawPath();
   }

   drawSnake();
   drawFood();
}

function drawSnake() {

    const cells = document.querySelectorAll(".cell");

    snake.forEach((part, index) => {

        let cellIndex = part.y * GRID_SIZE + part.x;

        if (!cells[cellIndex]) return;

        // Reset styles
        cells[cellIndex].innerHTML = "";
        cells[cellIndex].style.backgroundImage = "";
        cells[cellIndex].style.transform = "";
        cells[cellIndex].style.boxShadow = "";

        // HEAD
        if (index === 0) {

    cells[cellIndex].style.background =
        "radial-gradient(circle, #adff2f, #00ff00, #006400)";

    cells[cellIndex].style.borderRadius = "50%";

    cells[cellIndex].style.boxShadow =
        "0 0 25px #39ff14";

    cells[cellIndex].style.transform =
        "scale(1.2)";

    cells[cellIndex].innerHTML = `
        <div class="head">
            <span class="eye left"></span>
            <span class="eye right"></span>
        </div>
    `;
}

        // BODY
        else {

            cells[cellIndex].style.background =
                "linear-gradient(135deg,#00ff00,#008000)";

            cells[cellIndex].style.borderRadius = "50%";

            cells[cellIndex].style.boxShadow =
                "0 0 5px #00ff00";
        }
    });
}

function drawFood() {

    const cells = document.querySelectorAll(".cell");
    
    let index = food.y * GRID_SIZE + food.x;

    if (cells[index]) {
        cells[index].style.background =
    "radial-gradient(circle,#ff5555,#cc0000)";
cells[index].style.borderRadius = "20%";
cells[index].style.boxShadow =
    "0 0 12px red";
    }
}

function generateFood() {

    let valid = false;

    while (!valid) {

        let newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        valid = true;

        for (let part of snake) {

            if (
                part.x === newFood.x &&
                part.y === newFood.y
            ) {
                valid = false;
                break;
            }
        }

        if (valid) {
            food = newFood;
        }
    }
}

function drawPath(){

    const cells =
        document.querySelectorAll(".cell");

    currentPath.slice(0,5).forEach(node => {

        let index =
            node.y * GRID_SIZE + node.x;

        if(cells[index]){

            cells[index].style.background =
    "radial-gradient(circle, rgba(255,255,255,0.15) 20%, transparent 25%)";
        }
    });
}

function checkSelfCollision(head) {

    for (let i = 1; i < snake.length; i++) {

        if (
            snake[i].x === head.x &&
            snake[i].y === head.y
        ) {
            return true;
        }
    }

    return false;
}

function moveManual(){

    let head = {...snake[0]};

    if(direction === "RIGHT") head.x++;
    if(direction === "LEFT") head.x--;
    if(direction === "UP") head.y--;
    if(direction === "DOWN") head.y++;

    if(head.x < 0){
        head.x = GRID_SIZE - 1;
    }

    if(head.x >= GRID_SIZE){
        head.x = 0;
    }

    if(head.y < 0){
        head.y = GRID_SIZE - 1;
   }

    if(head.y >= GRID_SIZE){
        head.y = 0;
    }

    if(checkSelfCollision(head)){

        alert("Game Over! Score: " + score);

        resetGame();

        return;
    
    }
    snake.unshift(head);

    if(
        head.x === food.x &&
        head.y === food.y
    ){
        score++;

document.getElementById("score").innerText =
    "Score: " + score;

if(score > highScore){

    highScore = score;

    localStorage.setItem(
        "highScore",
        highScore
    );

    document.getElementById(
        "highScore"
    ).innerText =
    "High Score: " + highScore;
}
        

        generateFood();
    }
    else{
        snake.pop();
    }
}

function resetGame(){

    score = 0;

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = "RIGHT";

    currentPath = [];

    document.getElementById("score").innerText =
        "Score: 0";

    generateFood();
}

function moveAI() {

    let parent = bfs(
        snake[0],
        food
    );

    currentPath = getPath(
    parent,
    snake[0],
    food
);

    if(currentPath.length === 0){

        alert(
            "AI Stuck! Restarting..."
        );

        resetGame();

        return;
    }

    let head = {
        x: currentPath[0].x,
        y: currentPath[0].y
    };

    if(checkSelfCollision(head)){

    alert("Game Over! Score: " + score);

    resetGame();

    return;
    }

    snake.unshift(head);

    if(
        head.x === food.x &&
        head.y === food.y
    ){

        score++;

document.getElementById("score").innerText =
    "Score: " + score;

if(score > highScore){

    highScore = score;

    localStorage.setItem(
        "highScore",
        highScore
    );

    document.getElementById(
        "highScore"
    ).innerText =
    "High Score: " + highScore;
}


        generateFood();
    }
    else{

        snake.pop();
    }
}

drawBoard();

const gameLoop = setInterval(() => {

    if(aiMode){
        moveAI();
    }
    else{
        moveManual();
    }

    drawBoard();

}, 200);

