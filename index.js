document.addEventListener("DOMContentLoaded", () => {
  // get the grid size from user
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  const grid = createGrid();
  let squares = Array.from(grid.querySelectorAll("div"));
  const scoreDisplay = document.querySelector(".score-display");
  const linesDisplay = document.querySelector(".lines-score");
  const startBtn = document.querySelector(".button");
  const width = 10;
  let currentIndex = 0;
  let nextRandom = 0;
  let timerId;
  let timerIid;
  let score = 0;
  let lines = 0;
  let lives = 3;
  const colors = [
    "url(images/blue_block.png)",
    "url(images/green_block.png)",
    "url(images/orange_block.png)",
    "url(images/purple_block.png)",
    "url(images/red_block.png)",
  ];

  function createGrid() {
    //main grid
    let grid = document.querySelector(".grid");
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div");
      grid.appendChild(gridElement);
    }
    //set base of grid
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "block3");
      grid.appendChild(gridElement);
    }

    let previousGrid = document.querySelector(".previous-grid");
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }
  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
  ];
  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
  ];
  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
  ];
  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
    // jTetromino,
  ];
  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  }

  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
  }
  document.addEventListener("keydown", control);

  //move down function
  function moveDown() {
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "block3"
          ) ||
          squares[currentPosition + index + width].classList.contains("block2")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("block2")
      );
      //start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }
  freeze();

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //fix rotation of tetrominos at the edge
  function isAtRight() {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  }

  function isAtLeft() {
    return current.some((index) => (currentPosition + index) % width === 0);
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition; //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {
      //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
      if (isAtRight()) {
        //use actual position to check if it's flipped over to right side
        currentPosition += 1; //if so, add one to wrap it back around
        checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
      }
    } else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1;
        checkRotatedPosition(P);
      }
    }
  }

  //rotate the tetromino
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

  //show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll(".previous-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // the Tetrominos without rotations
  const smallTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
    //[1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1], //jTetromino
  ];

  //dispplay the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("block");
      square.style.backgroundImage = "none";
    });
    smallTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("block");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }
  //timer variables
  let [seconds, minutes] = [0, 0];
  let timerRef = document.querySelector(".timerDisplay");
  let int = null;
  //let seconds = 0;
  //timer function
  function displayTimer() {
    seconds += 1;
    console.log(seconds);
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerHTML = `${m} : ${s}`;
  }

  let now;
  let then = Date.now();
  let interval = 1000 / 1;
  let delta, dt;
  let time_now;
  let time_then = Date.now();
  let time_interval = 1000 / 1;
  let time_delta, time_dt;

  function playAnimation() {
    timerId = window.requestAnimationFrame(playAnimation);

    now = Date.now();
    delta = now - then;
    dt = delta / interval;
    if (delta > interval) {
      then = now - (delta % interval);
      moveDown();
    }
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );
    document.documentElement.style.setProperty("--hue", hue + delta * 0.0005);
  }

  function runTimer() {
    time_now = Date.now();
    time_delta = time_now - time_then;
    time_dt = time_delta / time_interval;

    if (time_delta > time_interval) {
      time_then = time_now - (time_delta % time_interval);
      displayTimer();
    }
    timerIid = window.requestAnimationFrame(runTimer);
  }
  //add functionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      cancelAnimationFrame(timerId);
      timerId = null;
      cancelAnimationFrame(timerIid);
    } else {
      playAnimation();
      displayShape();
      runTimer();
    }
  });

  //add score
  function addScore() {
    for (
      currentIndex = 0;
      currentIndex < GRID_SIZE;
      currentIndex += GRID_WIDTH
    ) {
      const row = [
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3,
        currentIndex + 4,
        currentIndex + 5,
        currentIndex + 6,
        currentIndex + 7,
        currentIndex + 8,
        currentIndex + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("block2"))) {
        score += 10;
        lines += 1;
        scoreDisplay.innerHTML = score;
        linesDisplay.innerHTML = lines;
        row.forEach((index) => {
          squares[index].classList.remove("block2") ||
            squares[index].classList.remove("block");
          squares[index].style.backgroundImage = "none";
        });
        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  //let lives_s = document.querySelector(".lives-s")
  //game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      lives--;
      scoreDisplay.innerHTML = "end";
      cancelAnimationFrame(timerId);
      cancelAnimationFrame(timerIid);
      reload();
    }
  }

  // Restart game
  const restartBtn = document.querySelector(".buttonr");
  function reload() {
    reload = location.reload();
  }
  restartBtn.addEventListener("click", reload, false); //=> {
});
