// Selecting the body, which contains everything
const body = document.querySelector("body");

// Selecting the big container, which contains the grid and other elements
const bigContainer = document.querySelector(".big-container");

// Selecting the container for the grid
const gridContainer = document.querySelector(".grid-container");

// Setting some properties for the body, such as turning into flex
body.style.display = "flex";

// Setting some properties for the big container, such as turning into flex and setting it's grow and shrink values to 0 so the is always the same size
bigContainer.style.display = "flex";
bigContainer.style.flex = "0 0 auto";

// Setting the properties of the gridContainer, making it a flex container and setting it up to set its fixed proportions later
gridContainer.style.position = "relative"
gridContainer.style.display = "flex";
gridContainer.style.flexWrap = "wrap";
gridContainer.style.flex = "0 0";


function createGrid (resolution) {
    for (let i = 0; i < resolution ** 2; i++) {
        const square = document.createElement("div");
        square.classList.add("square");

        square.style.border = "1px solid lightgrey";
        square.style.display = "flex";
        square.style.flexWrap = "wrap";
        square.style.flex = "0 0 auto";

        square.style.width = `${(300 / resolution) - 1}px`;
        square.style.height = `${(300 / resolution) - 1}px`;
        
        square.style.padding = `${(300 / resolution) - 1}px`;
        square.style.boxSizing = "border-box";
        
        gridContainer.appendChild(square);
    };

    // The objective of the next lines of code, is to implement the ability of the grid container to be the same size, independent of the zoom the user has set in their browser, be it 25%, be it 500% (on google chrome those seem to be the default min and max zoom). These lines of code are complementary to the lines 17-21, where the gridContainer styles are set to - position: relative; display: flex; flex-wrap: wrap; flex: 0 0;

    // Baseline for resolution of 1x1 squares (later will be in %)
    let resBaseline = 100;

    // If the resolution submitted by the user is 1x1, then just size the grid with the baseline.
    
    // And because of the properties of the number 1 with various mathematical operations, a separate condition is needed for any other number that is submitted as resolution input that is not 1 as for example 2x2, 8x8, 7x7, 32x32, 64x64, etc..
    
    // So, with this in mind, an if condition is set in place, where the first condition was mentioned before and the else statement sets the min and max width and height to an equation equal to ((baseline resolution parameter / resolution received from the user). 
    
    // The explanation for this is that when the user inputs a bigger pixel by pixel grid, the value of the resulting px by px grid is the same as multiplying a grid of 1x1 by that resolution input from the user, so for example:
    
    // User wants a 32x32 grid. This is the same as saying to the program that the 1x1 grid is multiplied by 32.
    
    // The problem with this is that if "security" measures are not set in place, the grid will be distorted, causing several grid cells to be displayed out of place, ruining the grid.
    
    // So, to solve this caveat, the proportions are set to the division mentioned earlier, thus essentially setting the proportions of the container to a min/max percentage of the page. 
    if (resolution === 1) {
        gridContainer.style.minWidth = `${resBaseline}%`;
        gridContainer.style.maxWidth = `${resBaseline}%`;
        gridContainer.style.minHeight = `${resBaseline}%`;
        gridContainer.style.maxHeight = `${resBaseline}%`;
    } else {
        gridContainer.style.minWidth = `${(resBaseline / resolution)}%`;
        gridContainer.style.maxWidth = `${(resBaseline / resolution)}%`;
        gridContainer.style.minHeight = `${(resBaseline / resolution)}%`;
        gridContainer.style.maxHeight = `${(resBaseline / resolution)}%`;
    }

    
};

createGrid(64);
