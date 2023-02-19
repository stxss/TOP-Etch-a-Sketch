const body = document.querySelector("body");
body.style.display = "flex";

const DEFAULT_BG_COLOR = "rgb(255,255,255)";
let PEN_COLOR = "rgb(0,0,0)";
const DEFAULT_BORDER_COLOR = "rgb(235, 235, 235)";

let bgColorBtn = document.querySelector(".bg-color");
let penColorBtn = document.querySelector(".pen-color");
let borderColorBtn = document.querySelector(".border-color");

let bgColorPick = document.querySelector(".bg-color-picker");
let penColorPick = document.querySelector(".pen-color-picker");
let borderColorPick = document.querySelector(".border-color-picker");

let borderLineToggle = document.querySelector(".toggle-grid");

let drawingMode = "draw";

let eraser = document.querySelector(".eraser");
let eraserStatus = false;

let rainbow = document.querySelector(".rainbow");
let rainbowStatus = false;

let lighten = document.querySelector(".lighten");
let lightenStatus = false;

let darken = document.querySelector(".darken");
let darkenStatus = false;

let clearGrid = document.querySelector(".clear");

const gridContainer = document.querySelector(".grid-container");

gridContainer.style.display = "grid";
gridContainer.style.backgroundColor = DEFAULT_BG_COLOR;

let grid = document.createElement("div");
grid.classList.add("grid");
grid.style.display = "grid";
gridContainer.appendChild(grid);

let resolution = 16;

function createGrid(resolution) {
    // Preventing the visual "drop" cursor from appearing (happens sometimes when the user clicks on a colored line trying to color it over)
    gridContainer.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });

    for (let i = 0; i < resolution ** 2; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        grid.style.gridTemplateColumns = `repeat(${resolution} ,1fr)`;
        grid.style.gridTemplateRows = `repeat(${resolution} ,1fr)`;

        square.style.width = `${700 / resolution}px`;
        square.style.height = `${700 / resolution}px`;

        // Giving the squares only the top left borders and the grid container (the big box), the right and bottom, the effect of the borders "compounding" and creating a thicker look is avoided. So basically this is a way of creating thinner borders, sort of bypassing the inability to create borders that are thinner than 1px. The light color also helps with supporting this thinner look.
        square.style.borderTop = `1px solid ${DEFAULT_BORDER_COLOR}`;
        square.style.borderLeft = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderRight = `1px solid ${DEFAULT_BORDER_COLOR}`;
        gridContainer.style.borderBottom = `1px solid ${DEFAULT_BORDER_COLOR}`;

        square.classList.add("hasBorders");
        gridContainer.classList.add("hasBorders");

        grid.appendChild(square);

        // Adding the listeners in the grid creation stage and not on mouse click ,this is crucial, as doing this outside of this, just makes it impossible to work properly (at least in my experience)
        square.addEventListener("mouseover", (e) => mClickDown(e, drawingMode));
        square.addEventListener("mousedown", (e) => mClickDown(e, drawingMode));
    }
}

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

        if (e.target.classList.contains("colored")) {
            backgroundColor =
                computedStyle.getPropertyValue("background-color");
        } else {
            backgroundColor = gridContainer.style.backgroundColor;
        }

        // Regex expression to filter the values from the retrieved string that said "rgb(r, g, b)", which are retrieved as an array
        let values = backgroundColor.match(/\d+/g);

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

            red = Math.min(red + white * 0.1, 255);
            green = Math.min(green + white * 0.1, 255);
            blue = Math.min(blue + white * 0.1, 255);

            let newColor = `rgb(${red}, ${green}, ${blue})`;

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

            red = Math.round(red * 0.9);
            green = Math.round(green * 0.9);
            blue = Math.round(blue * 0.9);

            let newColor = `rgb(${red}, ${green}, ${blue})`;

            if (e.buttons > 0) {
                e.target.style.backgroundColor = newColor;
                e.target.classList.add("colored");
            }
        }
    }
}

let slider = document.querySelector("#slider");
let output = document.querySelector("#output");

output.textContent = `Grid size: ${slider.value} x ${slider.value}`;

slider.oninput = function () {
    output.textContent = `Grid size: ${this.value} x ${this.value}`;
    resolution = parseInt(this.value);
    changeGrid();
};

function changeGrid() {
    const squares = document.querySelectorAll("div .square");
    for (let square of squares) {
        square.remove();
    }
    createGrid(resolution);
}

bgColorBtn.addEventListener("click", () => {
    bgColorPick.click();
});

penColorBtn.addEventListener("click", () => {
    penColorPick.click();
});

borderColorBtn.addEventListener("click", () => {
    borderColorPick.click();
    let square = document.querySelectorAll(".grid .square");

    square.forEach((square) => {
        if (!square.classList.contains("hasBorders")) {
            square.classList.add("hasBorders");
            square.style.border = "white";
        }
    });

    if (!gridContainer.classList.contains("hasBorders")) {
        gridContainer.classList.add("hasBorders");
    }
});

bgColorPick.oninput = function () {
    gridContainer.style.backgroundColor = bgColorPick.value;
};

penColorPick.oninput = function () {
    PEN_COLOR = penColorPick.value;
    drawingMode = "draw";
};

borderColorPick.oninput = function () {
    let square = document.querySelectorAll(".grid .square");
    square.forEach((square) => {
        square.style.borderTop = `1px solid ${borderColorPick.value}`;
        square.style.borderLeft = `1px solid ${borderColorPick.value}`;
        gridContainer.style.borderRight = `1px solid ${borderColorPick.value}`;
        gridContainer.style.borderBottom = `1px solid ${borderColorPick.value}`;
    });
};

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

eraser.addEventListener("click", () => {
    eraserStatus = !eraserStatus;

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
    rainbowStatus = !rainbowStatus;

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
    lightenStatus = !lightenStatus;

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
    darkenStatus = !darkenStatus;

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

createGrid(resolution);
