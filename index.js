import {
  GRID_SIZE,
  GRID_WIDTH,
  scoreDisplay,
  linesDisplay,
  startBtn,
  colors,
} from "./constants.js";
import { createGrid } from "./createGrid.js";
import { theTetrominoes } from "./tetrominoes.js";

//document.addEventListener("DOMContentLoaded", () => {
const startGame = () => {
  const grid = createGrid();

  let squares = Array.from(grid.querySelectorAll("div"));

  let width = 10;
  let currentIndex = 0;
  let nextRandom = 0;
  let timerId;
  let timerIid;
  let score = 0;
  let lines = 0;

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the tetromino
  const draw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  };

  //undraw the tetromino
  const undraw = () => {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  };

  //assign functions to keyCodes
  const control = (e) => {
    if (e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate();
    else if (e.keyCode === 39) moveRight();
    else if (e.keyCode === 40) moveDown();
  };
  //document.addEventListener("keydown", control);

  //move down function
  const moveDown = () => {
    document.addEventListener("keydown", control);
    undraw();
    currentPosition = currentPosition + width;
    draw();
    freeze();
  };

  //freeze function
  const freeze = () => {
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
  };
  //freeze();

  //move the tetromino left, unless is at the edge or there is a blockage
  const moveLeft = () => {
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
  };

  //move the tetromino right, unless is at the edge or there is a blockage
  const moveRight = () => {
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
  };

  //fix rotation of tetrominos at the edge
  const isAtRight = () => {
    return current.some((index) => (currentPosition + index + 1) % width === 0);
  };

  const isAtLeft = () => {
    return current.some((index) => (currentPosition + index) % width === 0);
  };

  const checkRotatedPosition = (P) => {
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
  };

  //rotate the tetromino
  const rotate = () => {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    checkRotatedPosition();
    draw();
  };

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
  const displayShape = () => {
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
  };
  //timer variables
  let [seconds, minutes] = [0, 0];
  let timerRef = document.querySelector(".timerDisplay");

  //timer function
  const displayTimer = () => {
    seconds += 1;
    if (seconds == 60) {
      seconds = 0;
      minutes++;
    }
    let m = minutes < 10 ? "0" + minutes : minutes;
    let s = seconds < 10 ? "0" + seconds : seconds;

    timerRef.innerHTML = `${m} : ${s}`;
  };

  let now;
  let then = Date.now();
  let interval = 1000 / 1;
  let delta /*, dt*/;
  let time_now;
  let time_then = Date.now();
  let time_interval = 1000 / 1;
  let time_delta /*, time_dt*/;

  const playAnimation = () => {
    timerId = window.requestAnimationFrame(playAnimation);

    now = Date.now();
    delta = now - then;
    if (delta > interval) {
      then = now - (delta % interval);
      moveDown();
    }
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );
    document.documentElement.style.setProperty("--hue", hue + delta * 0.0005);
  };

  const runTimer = () => {
    time_now = Date.now();
    time_delta = time_now - time_then;
    if (time_delta > time_interval) {
      time_then = time_now - (time_delta % time_interval);
      displayTimer();
    }
    timerIid = window.requestAnimationFrame(runTimer);
  };
  //add functionality to the button
  startBtn.addEventListener("click", () => {
    console.log(timerId);
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
  const addScore = () => {
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
  };

  const gameOver = () => {
    let lives_s = document.querySelector(".lives-score");
    let live = lives_s.textContent;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      live--;
      console.log(live);
      cancelAnimationFrame(timerId);
      cancelAnimationFrame(timerIid);
      document.removeEventListener("keydown", control);

      if (live <= 0) {
        lives_s.textContent = "";
        lives_s.textContent = `${live}`;
        scoreDisplay.innerHTML = "end";
      } else {
        gameInit();

        lives_s.textContent = "";
        lives_s.textContent = `${live}`;
        console.log(live);
        // timerIid = null;
        // // console.log(timerIid);
        // timerRef.innerHTML = `00 : 00`;
      }
    }
  };
  // Restart game
  const restartBtn = document.querySelector(".buttonr");

  const reload = () => {
    window.location.reload();
  };
  restartBtn.addEventListener("click", reload, false);
};
const gameInit = () => {
  clearGrid();
  startGame();
};
//game over

const clearGrid = () => {
  const list = document.querySelector(".grid");
  console.log(list);
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
};
gameInit();
