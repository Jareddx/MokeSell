let canvas = document.getElementById("scratch");
let context = canvas.getContext("2d");

const prizes = ["$0", "$5", "$10", "$15"]; // Possible prizes
let selectedPrize = ""; // Variable to store the selected prize

const init = () => {
        // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set the background color of the scratch area
    context.fillStyle = "#6414e9"; // Purple background
    context.fillRect(0, 0, 200, 200);

    // Add the "Scratch Me!" text
    context.font = "20px Arial"; // Set font size and family
    context.fillStyle = "#ffffff"; // White text color
    context.textAlign = "center"; // Center the text horizontally
    context.textBaseline = "middle"; // Center the text vertically
    context.fillText("Scratch Me!", canvas.width / 2, canvas.height / 2); // Draw the text
  
    // Weighted prize selection
    const prizes = [
      { value: "$0", weight: 50 },   // 50% chance
      { value: "$5", weight: 30 },   // 30% chance
      { value: "$10", weight: 15 },  // 15% chance
      { value: "$15", weight: 5 }    // 5% chance
    ];
  
    // Calculate total weight
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
  
    // Generate a random number between 0 and totalWeight
    const randomNum = Math.random() * totalWeight;
  
    // Select the prize based on the random number
    let cumulativeWeight = 0;
    for (let prize of prizes) {
      cumulativeWeight += prize.weight;
      if (randomNum <= cumulativeWeight) {
        selectedPrize = prize.value;
        break;
      }
    }
  };

//initially mouse X and mouse Y positions are 0
let mouseX = 0;
let mouseY = 0;
let isDragged = false;

//Events for touch and mouse
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = "";

//Detech touch device
const isTouchDevice = () => {
  try {
    //We try to create TouchEvent. It would fail for desktops and throw error.
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

//Get left and top of canvas
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;

//Exact x and y position of mouse/touch
const getXY = (e) => {
  mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft;
  mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop;
};

isTouchDevice();
//Start Scratch
canvas.addEventListener(events[deviceType].down, (event) => {
  isDragged = true;
  //Get x and y position
  getXY(event);
  scratch(mouseX, mouseY);
});

//mousemove/touchmove
canvas.addEventListener(events[deviceType].move, (event) => {
  if (!isTouchDevice()) {
    event.preventDefault();
  }
  if (isDragged) {
    getXY(event);
    scratch(mouseX, mouseY);
  }
});

//stop drawing
canvas.addEventListener(events[deviceType].up, () => {
  isDragged = false;
  // Check if the user has scratched enough to reveal the prize
  revealPrize();
});

//If mouse leaves the square
canvas.addEventListener("mouseleave", () => {
  isDragged = false;
});

const scratch = (x, y) => {
  //destination-out draws new shapes behind the existing canvas content
  context.globalCompositeOperation = "destination-out";
  context.beginPath();
  //arc makes circle - x,y,radius,start angle,end angle
  context.arc(x, y, 12, 0, 2 * Math.PI);
  context.fill();
};

const revealPrize = () => {
  // Calculate the percentage of the canvas that has been scratched
  let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imageData.data;
  let scratchedPixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] === 0) {
      scratchedPixels++;
    }
  }

  let scratchedPercentage = (scratchedPixels / (pixels.length / 4)) * 100;

  // If a certain percentage of the canvas is scratched, reveal the prize
  if (scratchedPercentage > 50) {
    document.getElementById("resultMessage").innerText = "You Won";
    document.getElementById("prizeAmount").innerText = selectedPrize;
  }
};

window.onload = init();