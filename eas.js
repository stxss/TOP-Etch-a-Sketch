// Selecting the body, which contains everything
const body = document.querySelector("body");

// Setting some properties for the body, such as turning into flex
body.style.display = "flex";

// Setting default colors for the background, the pen and the border colors 
const DEFAULT_BG_COLOR = "rgb(255,255,255)";
const DEFAULT_PEN_COLOR = "rgb(0,0,0)";
const DEFAULT_BORDER_COLOR = "rgb(235, 235, 235)"

// Selecting the container for the grid
const gridContainer = document.querySelector(".grid-container");

// Setting the properties of the gridContainer, making it a flex container and setting it up to set its fixed proportions later

gridContainer.style.display = "grid";
gridContainer.style.backgroundColor = DEFAULT_BG_COLOR;

// Create a div for the grid itself
let grid = document.createElement("div");
grid.classList.add("grid")
grid.style.display = "grid";
gridContainer.appendChild(grid)

// Function for the grid creation
function createGrid(resolution) {

    // Preventing the visual "drop" cursor from appearing (happens sometimes when the user clicks on a colored line trying to color it over)
    gridContainer.addEventListener('mousedown', function (e) {
        e.preventDefault()
    })

    for (let i = 0; i < resolution ** 2; i++) {
        let square = document.createElement('div');
        square.classList.add('square');
        grid.style.gridTemplateColumns = `repeat(${resolution} ,1fr)`
        grid.style.gridTemplateRows = `repeat(${resolution} ,1fr)`;

        // Give the grid a 700px width and height independent of device
        square.style.width = `${(700 / resolution)}px`;
        square.style.height = `${(700 / resolution)}px`;

        // Giving the squares only the top left borders and the grid container (the big box), the right and bottom, the effect of the borders "compounding" and creating a thicker look is avoided. So basically this is a way of creating thinner borders, sort of bypassing the inability to create borders that are thinner than 1px. The light color also helps with supporting this thinner look.
        square.style.borderTop = `1px solid ${DEFAULT_BORDER_COLOR}`;
        square.style.borderLeft = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderRight = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderBottom = `1px solid ${DEFAULT_BORDER_COLOR}`;

        // Appending the squares to the container.
        grid.appendChild(square);

        // Adding the listeners in the grid creation stage and not on mouse click ,this is crucial, as doing this outside of this, just makes it impossible to work properly (at least in my experience)
        square.addEventListener('mouseover', mClickDown)
        square.addEventListener('mousedown', mClickDown)
      };

};


// If any button is pressed, the user starts to draw on the grid.
function mClickDown(e) {
    if (e.buttons > 0) {
        this.style.backgroundColor = "black";
        this.classList.add("colored");
    };
};

// Function for the slider-grid generation
let slider = document.querySelector("#slider");
let output = document.querySelector("#output");

// Showing the initial value
output.textContent = slider.value; 

let resolution = 16;
// Updating the current slider value each time it is dragged 
slider.oninput = function() {
    output.innerHTML = this.value;
    resolution = parseInt(this.value);
    console.log(parseInt(resolution))
    changeGrid(this.value)
}

// test this down here
function changeGrid() {
    const squares = document.querySelectorAll("div .square");
    for (let square of squares) {
        square.remove()
    }
    createGrid(resolution)
}


createGrid(16);
mClickDown();




