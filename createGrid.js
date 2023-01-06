import { GRID_SIZE, GRID_WIDTH } from "./constants.js";

// export let squares = Array.from(grid.querySelectorAll("div"));

export function createGrid() {
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
