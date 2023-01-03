// Selecting the body, which contains everything
const body = document.querySelector("body");

// Setting some properties for the body, such as turning into flex
body.style.display = "flex";

// Setting default colors for the background, the pen and the border colors
const DEFAULT_BG_COLOR = "rgb(255,255,255)";
let PEN_COLOR = "rgb(0,0,0)";
const DEFAULT_BORDER_COLOR = "rgb(235, 235, 235)";

// Selecting the color selection buttons -- background, pen and grid border colors
let bgColorBtn = document.querySelector(".bg-color");
let penColorBtn = document.querySelector(".pen-color");
let borderColorBtn = document.querySelector(".border-color");

// Selecting the color pickers -- background, pen and grid border colors
let bgColorPick = document.querySelector(".bg-color-picker");
let penColorPick = document.querySelector(".pen-color-picker");
let borderColorPick = document.querySelector(".border-color-picker");

// Selecting the Grid Lines toggle
let borderLineToggle = document.querySelector(".toggle-grid");

// Setting the default Drawing Mode to draw
let drawingMode = "draw";

// Selecting the eraser button and state to false (not active)
let eraser = document.querySelector(".eraser");
let eraserStatus = false;

// Selecting the rainbow button and state to false (not active)
let rainbow = document.querySelector(".rainbow");
let rainbowStatus = false;

// Selecting the lighten button and state to false (not active)
let lighten = document.querySelector(".lighten");
let lightenStatus = false;

// Selecting the darken button and state to false (not active)
let darken = document.querySelector(".darken");
let darkenStatus = false;

// Selecting the clear grid button
let clearGrid = document.querySelector(".clear");

// Selecting the container for the grid
const gridContainer = document.querySelector(".grid-container");

// Setting the properties of the gridContainer, making it a flex container and setting it up to set its fixed proportions later
gridContainer.style.display = "grid";
gridContainer.style.backgroundColor = DEFAULT_BG_COLOR;

// Create a div for the grid itself
let grid = document.createElement("div");
grid.classList.add("grid");
grid.style.display = "grid";
gridContainer.appendChild(grid);

// Setting the initial resolution value
let resolution = 16;

// Function for the grid creation
function createGrid(resolution) {
    // Preventing the visual "drop" cursor from appearing (happens sometimes when the user clicks on a colored line trying to color it over)
    gridContainer.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });

    // For the resolution, just square the number, to reflect a square grid
    // Creating a repeating amount of columns and rows of the same size
    for (let i = 0; i < resolution ** 2; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        grid.style.gridTemplateColumns = `repeat(${resolution} ,1fr)`;
        grid.style.gridTemplateRows = `repeat(${resolution} ,1fr)`;

        // Give the grid a 700px width and height independent of device
        square.style.width = `${700 / resolution}px`;
        square.style.height = `${700 / resolution}px`;

        // Giving the squares only the top left borders and the grid container (the big box), the right and bottom, the effect of the borders "compounding" and creating a thicker look is avoided. So basically this is a way of creating thinner borders, sort of bypassing the inability to create borders that are thinner than 1px. The light color also helps with supporting this thinner look.
        square.style.borderTop = `1px solid ${DEFAULT_BORDER_COLOR}`;
        square.style.borderLeft = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderRight = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderBottom = `1px solid ${DEFAULT_BORDER_COLOR}`;

        // Marking that the grid container and its squares has borders
        square.classList.add("hasBorders");
        gridContainer.classList.add("hasBorders");

        // Appending the squares to the container.
        grid.appendChild(square);

        // Adding the listeners in the grid creation stage and not on mouse click ,this is crucial, as doing this outside of this, just makes it impossible to work properly (at least in my experience)
        square.addEventListener("mouseover", (e) => mClickDown(e, drawingMode));
        square.addEventListener("mousedown", (e) => mClickDown(e, drawingMode));
    }
}

// Function for handling each active "drawing" mode
// There are 5 modes - draw (default), erase, rainbow (random rgb color on each mouse pass), lighten (adds 10% white on each mouse pass) and darken (adds 10% black on each mouse pass)
function mClickDown(e, mode) {
    let square = document.querySelectorAll(".grid .square");

    if (mode === "draw") {
        // This if condition block repeats similarly for each mode. Upon activation of a certain mode, if there is any other flag that is active, turn it off by setting it's value to false. Those flags proc the setting of the active drawing mode, so if more than one is active at one time, it can cause conflicts in performance
        if (darkenStatus) {
            darkenStatus = !darkenStatus;
        } else if (lightenStatus) {
            lightenStatus = !lightenStatus;
        } else if (eraserStatus) {
            eraserStatus = !eraserStatus;
        } else if (rainbowStatus) {
            rainbowStatus = !rainbowStatus;
        }

        // For each mouse pass, paint the square to the active pen color
        square.forEach(function () {
            if (e.buttons > 0) {
                e.target.style.backgroundColor = `${PEN_COLOR}`;
                e.target.classList.add("colored");
            }
        });
    } else if (mode === "eraser") {
        if (darkenStatus) {
            darkenStatus = !darkenStatus;
        } else if (lightenStatus) {
            lightenStatus = !lightenStatus;
        } else if (rainbowStatus) {
            rainbowStatus = !rainbowStatus;
        }

        // Acts in a similar way to the draw functionality, but instead of painting, it resets the color to the initial background value, effectively deleting the color "on top" and as such, simulating the effect of an eraser.
        if (e.buttons > 0) {
            e.target.style.backgroundColor = "initial";
            e.target.classList.remove("colored");
        }
    } else if (mode === "rainbow") {
        if (darkenStatus) {
            darkenStatus = !darkenStatus;
        } else if (lightenStatus) {
            lightenStatus = !lightenStatus;
        } else if (eraserStatus) {
            eraserStatus = !eraserStatus;
        }
        // Creating new different Red, Green and Blue (RGB) values and making each pass of the mouse change the pixel color to a random combination of those three RGB values, painting the square to a new random color each time.
        let randValR = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
        let randValG = Math.floor(Math.random() * (255 - 0 + 1)) + 0;
        let randValB = Math.floor(Math.random() * (255 - 0 + 1)) + 0;

        if (e.buttons > 0) {
            e.target.style.backgroundColor = `rgb(${randValR}, ${randValG}, ${randValB})`;
            e.target.classList.add("colored");
        }
    } else if (mode === "lighten" || mode === "darken") {
        // When selecting a shading mode (lighten/darken), first the already existent value must be retrieved, to prevent bugs with not painting or painting the colors to black/white instead of applying a lighter/darker shade
        let computedStyle = window.getComputedStyle(e.target);
        let backgroundColor = "";

        // If the square is not yet colored, set the color to the grid container color value.
        if (e.target.classList.contains("colored")) {
            backgroundColor =
                computedStyle.getPropertyValue("background-color");
        } else {
            backgroundColor = gridContainer.style.backgroundColor;
        }

        // Regex expression to filter the values from the retrieved string that said "rgb(r, g, b)", which are retrieved as an array
        let values = backgroundColor.match(/\d+/g);

        // Selecting the values from the array and assigning to the respective colors
        let red = parseInt(values[0]);
        let green = parseInt(values[1]);
        let blue = parseInt(values[2]);
        let white = 255;

        if (mode === "lighten") {
            if (darkenStatus) {
                darkenStatus = !darkenStatus;
            } else if (eraserStatus) {
                eraserStatus = !eraserStatus;
            } else if (rainbowStatus) {
                rainbowStatus = !rainbowStatus;
            }

            // Adding 10% white to the retrieved color.
            red = Math.min(red + white * 0.1, 255);
            green = Math.min(green + white * 0.1, 255);
            blue = Math.min(blue + white * 0.1, 255);

            let newColor = `rgb(${red}, ${green}, ${blue})`;

            // Shading
            if (e.buttons > 0) {
                e.target.style.backgroundColor = newColor;
                e.target.classList.add("colored");
            }
        } else if (mode === "darken") {
            if (lightenStatus) {
                lightenStatus = !lightenStatus;
            } else if (eraserStatus) {
                eraserStatus = !eraserStatus;
            } else if (rainbowStatus) {
                rainbowStatus = !rainbowStatus;
            }

            // Shading the color of the pixel to 0.9 of what it was, effectively darkening it "adding" 10% black each time
            red = Math.round(red * 0.9);
            green = Math.round(green * 0.9);
            blue = Math.round(blue * 0.9);

            let newColor = `rgb(${red}, ${green}, ${blue})`;

            // Shading
            if (e.buttons > 0) {
                e.target.style.backgroundColor = newColor;
                e.target.classList.add("colored");
            }
        }
    }
}

// Function for the slider-grid generation
let slider = document.querySelector("#slider");
let output = document.querySelector("#output");

// Showing the initial value
output.textContent = `Grid size: ${slider.value} x ${slider.value}`;

// Slider and grid update
slider.oninput = function () {
    // Updating the appearance of the slider
    output.textContent = `Grid size: ${this.value} x ${this.value}`;
    resolution = parseInt(this.value);
    changeGrid();
};

// Function to proc when changing the grid resolution
function changeGrid() {
    // Deleting the squares to create a new grid
    const squares = document.querySelectorAll("div .square");
    for (let square of squares) {
        square.remove();
    }
    createGrid(resolution);
}

// Picker pop-up upon clicking the color choice button for the background
bgColorBtn.addEventListener("click", () => {
    bgColorPick.click();
});

// Picker pop-up upon clicking the color choice button for the pen
penColorBtn.addEventListener("click", () => {
    penColorPick.click();
});

// Picker pop-up upon clicking the color choice button for the grid borders
borderColorBtn.addEventListener("click", () => {
    borderColorPick.click();
    let square = document.querySelectorAll(".grid .square");

    // If the squares don't have the "hasBorders" class, add it.
    square.forEach((square) => {
        if (!square.classList.contains("hasBorders")) {
            square.classList.add("hasBorders");
            square.style.border = "white";
        }
    });

    // If the grid container doesn't have the "hasBorders" class, add it.
    if (!gridContainer.classList.contains("hasBorders")) {
        gridContainer.classList.add("hasBorders");
    }
});

// Changing the color of the background according to the picked color
bgColorPick.oninput = function () {
    gridContainer.style.backgroundColor = bgColorPick.value;
};

// Changing the color of the pen according to the picked color and setting the active drawingMode to "draw"
penColorPick.oninput = function () {
    PEN_COLOR = penColorPick.value;
    drawingMode = "draw";
};

// Changing the color of the border according to the picked color
borderColorPick.oninput = function () {
    let square = document.querySelectorAll(".grid .square");
    square.forEach((square) => {
        square.style.borderTop = `1px solid ${borderColorPick.value}`;
        square.style.borderLeft = `1px solid ${borderColorPick.value}`;
        gridContainer.style.borderRight = `1px solid ${borderColorPick.value}`;
        gridContainer.style.borderBottom = `1px solid ${borderColorPick.value}`;
    });
};

// Add a listener to the "Toggle Grid Lines" button and checking if the squares and container have the "hasBorders" class. If the class is present, turn the class off, effectively turning all the borders into "empty colors" aka turning off the borders. If the class is off, turn it on and color the borders to whatever color is chosen with the picker.
borderLineToggle.addEventListener("click", () => {
    let square = document.querySelectorAll(".grid .square");

    square.forEach((square) => {
        square.classList.toggle("hasBorders");
        square.style.border = "white";
    });
    gridContainer.classList.toggle("hasBorders");

    square.forEach((square) => {
        if (square.classList.contains("hasBorders")) {
            square.style.borderTop = `1px solid ${borderColorPick.value}`;
            square.style.borderLeft = `1px solid ${borderColorPick.value}`;
            gridContainer.style.borderRight = `1px solid ${borderColorPick.value}`;
            gridContainer.style.borderBottom = `1px solid ${borderColorPick.value}`;
        } else {
            square.style.borderTop = "";
            square.style.borderLeft = "";
            gridContainer.style.borderRight = "";
            gridContainer.style.borderBottom = "";
        }
    });
});

// Handling the clear grid button click.
// Upon click, the class "colored" for each square is removed and the existing colors are replaced by the background color value, with a smooth pleasant transition of 1.5 seconds. Upon these 1.5 seconds, a seamless new grid is regenerated, so no errors with the previous colors/functions occurs.
clearGrid.addEventListener("click", () => {
    let square = document.querySelectorAll(".grid .square");
    let form = document.querySelector(".color-buttons-form");
    suspendListeners();

    clearGrid.style.transition = "background-color 1.5s";
    clearGrid.style.backgroundColor = "#565f89";
    setTimeout(() => {
        clearGrid.style.transition = "background-color 0.5s";
        clearGrid.style.backgroundColor = "";
        lighten.style.backgroundColor = "";
        eraser.style.backgroundColor = "";
        rainbow.style.backgroundColor = "";
        darken.style.backgroundColor = "";
    }, 1500);

    square.forEach((square) => {
        if (
            square.classList.contains("colored") ||
            !square.classList.contains("colored")
        ) {
            square.classList.remove("colored");
            square.style.transition = "background-color 1.5s";
            square.style.transitionTimingFunction = "ease";
            square.style.backgroundColor = bgColorPick.value;
        }
    });

    // On clearing the grid, reset the status of the eraser to false, deactivating it again
    function resetEraser() {
        eraserStatus = false;
    }
    resetEraser();

    setTimeout(() => {
        changeGrid(resolution);
        form.reset();
    }, 1500);
});

// Create a function that suspends the ability to draw on the grid for the duration of the clearing effect when the user clears the grid
function suspendListeners() {
    let square = document.querySelectorAll(".grid .square");

    square.forEach((square) => {
        square.removeEventListener("mouseover", mClickDown);
        square.removeEventListener("mousedown", mClickDown);
    });
    if (darkenStatus) {
        darkenStatus = !darkenStatus;
    } else if (lightenStatus) {
        lightenStatus = !lightenStatus;
    } else if (eraserStatus) {
        eraserStatus = !eraserStatus;
    } else if (rainbowStatus) {
        rainbowStatus = !rainbowStatus;
    }

    drawingMode = "";
    setTimeout(function () {
        drawingMode = "draw";
    }, 1500);
}

// Event listener to toggle eraser. At the start of the code, the eraserStatus is set to false, so the eraser isn't active. Upon clicking, the eraser mode is toggled, allowing the user to delete the desired colors/pixels.
eraser.addEventListener("click", () => {
    // Here, the flag for the activation of the eraser is set to the opposite of what it was before. So if it was true, it's set to false. If it's false, it is set to a new boolean of true.
    eraserStatus = !eraserStatus;

    // Upon toggling, the drawing mode is set to eraser. When toggling again, the mode is set back to draw
    if (eraserStatus) {
        drawingMode = "eraser";
        eraser.style.backgroundColor = "#565f89";
        rainbow.style.backgroundColor = "";
        lighten.style.backgroundColor = "";
        darken.style.backgroundColor = "";
    } else {
        drawingMode = "draw";
        eraser.style.backgroundColor = "";
    }
});

rainbow.addEventListener("click", () => {
    // Here, the flag for the activation of the rainbow is set to the opposite of what it was before. So if it was true, it's set to false. If it's false, it is set to a new boolean of true.
    rainbowStatus = !rainbowStatus;

    // Upon toggling, the drawing mode is set to rainbow. When toggling again, the mode is set back to draw
    if (rainbowStatus) {
        drawingMode = "rainbow";
        rainbow.style.backgroundColor = "#565f89";
        eraser.style.backgroundColor = "";
        lighten.style.backgroundColor = "";
        darken.style.backgroundColor = "";
    } else {
        drawingMode = "draw";
        rainbow.style.backgroundColor = "";
    }
});

lighten.addEventListener("click", () => {
    // Here, the flag for the activation of the lighten is set to the opposite of what it was before. So if it was true, it's set to false. If it's false, it is set to a new boolean of true.
    lightenStatus = !lightenStatus;

    // Upon toggling, the drawing mode is set to lighten. When toggling again, the mode is set back to draw
    if (lightenStatus) {
        drawingMode = "lighten";
        lighten.style.backgroundColor = "#565f89";
        eraser.style.backgroundColor = "";
        rainbow.style.backgroundColor = "";
        darken.style.backgroundColor = "";
    } else {
        drawingMode = "draw";
        lighten.style.backgroundColor = "";
    }
});

darken.addEventListener("click", () => {
    // Here, the flag for the activation of the darken is set to the opposite of what it was before. So if it was true, it's set to false. If it's false, it is set to a new boolean of true.
    darkenStatus = !darkenStatus;

    // Upon toggling, the drawing mode is set to darken. When toggling again, the mode is set back to draw
    if (darkenStatus) {
        drawingMode = "darken";
        darken.style.backgroundColor = "#565f89";
        lighten.style.backgroundColor = "";
        eraser.style.backgroundColor = "";
        rainbow.style.backgroundColor = "";
    } else {
        drawingMode = "draw";
        darken.style.backgroundColor = "";
    }
});

// Creating the first/default grid
createGrid(resolution);
