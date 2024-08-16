// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

/**
 * Function to initialize the canvas dimensions to match the window size.
 * This ensures that the Matrix Rain effect covers the entire screen.
 */
function initCanvas() {
    canvas.width = window.innerWidth;  // Set canvas width to match the window's width
    canvas.height = window.innerHeight; // Set canvas height to match the window's height
}

initCanvas(); // Initialize the canvas dimensions when the page loads

/**
 * Configuration object for the top rain effect.
 * Contains properties that define the behavior and appearance of the falling text.
 */
const topRainConfig = {
    words: ['TOP1', 'TOP2', 'TOP3', 'TOP4', 'TOP5'], // Words to be displayed in the top rain
    fontSize: 16, // Font size for the text in pixels
    baseFallSpeed: 0.2, // Base speed at which the words fall (in terms of position increment)
    baseFadingStrength: 0.05, // Base strength for the fading effect (controls the trail length)
    baseFadingSpeed: 0.05, // Base speed at which the words fade out
    variations: {
        fallSpeedVariation: 0.2, // Variability in fall speed (+/- 20%)
        fadingStrengthVariation: 0.3, // Variability in fading strength (+/- 30%)
        fadingSpeedVariation: 0.2, // Variability in fading speed (+/- 20%)
    },
    drops: [] // Array to store the properties of each column of falling words
};

/**
 * Configuration object for the bottom rain effect.
 * Contains properties that define the behavior and appearance of the rising text.
 */
const bottomRainConfig = {
    words: ['BOTTOM1', 'BOTTOM2', 'BOTTOM3', 'BOTTOM4', 'BOTTOM5'], // Words to be displayed in the bottom rain
    fontSize: 16, // Font size for the text in pixels
    baseFallSpeed: 0.2, // Base speed at which the words rise (in terms of position increment)
    baseFadingStrength: 0.05, // Base strength for the fading effect (controls the trail length)
    baseFadingSpeed: 0.05, // Base speed at which the words fade out
    variations: {
        fallSpeedVariation: 0.2, // Variability in rise speed (+/- 20%)
        fadingStrengthVariation: 0.3, // Variability in fading strength (+/- 30%)
        fadingSpeedVariation: 0.2, // Variability in fading speed (+/- 20%)
    },
    drops: [] // Array to store the properties of each column of rising words
};

/**
 * Function to generate a random color that is not black.
 * Ensures that the text color is always visible against the black background.
 * @returns {string} A random hex color code that is not black.
 */
function getRandomColor() {
    let color;
    do {
        color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random hex color
    } while (color === '#000000'); // Ensure the color is not black
    return color;
}

/**
 * Function to apply variations to a base value.
 * This function introduces variability into properties like fall speed and fading strength.
 * @param {number} baseValue - The base value to which the variation will be applied.
 * @param {number} variation - The variation percentage to apply.
 * @returns {number} The new value after applying the variation.
 */
function applyVariation(baseValue, variation) {
    const variationFactor = 1 + (Math.random() * (variation * 2) - variation); // Calculate a random variation factor
    return baseValue * variationFactor; // Apply the variation to the base value
}

/**
 * Function to initialize the drops for the rain effect.
 * Each drop represents a column of text that will fall or rise on the screen.
 * @param {Object} config - The configuration object for the rain effect.
 */
function initDrops(config) {
    const columns = canvas.width / config.fontSize; // Calculate the number of columns based on canvas width and font size
    for (let x = 0; x < columns; x++) {
        config.drops[x] = {
            yPos: Math.random() * (canvas.height / 2) / config.fontSize, // Random initial vertical position within the upper or lower half of the screen
            word: config.words[Math.floor(Math.random() * config.words.length)], // Randomly select a word from the config's word list
            color: getRandomColor(), // Assign a random color to the word
            fallSpeed: applyVariation(config.baseFallSpeed, config.variations.fallSpeedVariation), // Apply fall speed variation
            fadingStrength: applyVariation(config.baseFadingStrength, config.variations.fadingStrengthVariation), // Apply fading strength variation
            fadingSpeed: applyVariation(config.baseFadingSpeed, config.variations.fadingSpeedVariation) // Apply fading speed variation
        };
    }
}

// Initialize the drops for both top and bottom rain effects
initDrops(topRainConfig);
initDrops(bottomRainConfig);

/**
 * Function to draw the rain effect on the canvas.
 * This function is called repeatedly to animate the rain.
 * @param {Object} config - The configuration object for the rain effect.
 * @param {boolean} isTop - A boolean indicating if the drops are for the top or bottom rain.
 */
function drawRain(config, isTop) {
    const columns = canvas.width / config.fontSize; // Calculate the number of columns based on canvas width and font size

    // Clear the canvas with a fading effect based on the minimum fading strength among all drops
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(...config.drops.map(drop => drop.fadingStrength))})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = config.fontSize + 'px monospace'; // Set the font size and style for the text

    for (let i = 0; i < columns; i++) {
        const drop = config.drops[i];

        // Determine the vertical position based on whether it's top or bottom rain
        const yPos = isTop ? drop.yPos * config.fontSize : canvas.height - drop.yPos * config.fontSize;
        ctx.fillStyle = drop.color; // Set the fill color for the text
        ctx.fillText(drop.word, i * config.fontSize, yPos); // Draw the word at the calculated position

        // Increment the drop position based on the individualized fall speed
        drop.yPos += drop.fallSpeed;

        // Reset drop position, word, and properties if it goes beyond the center of the screen
        if (drop.yPos * config.fontSize > canvas.height / 2) {
            drop.yPos = Math.random() * (canvas.height / 2) / config.fontSize; // Reset to a random position within the upper or lower half
            drop.word = config.words[Math.floor(Math.random() * config.words.length)]; // Select a new random word
            drop.color = getRandomColor(); // Assign a new random color
            drop.fallSpeed = applyVariation(config.baseFallSpeed, config.variations.fallSpeedVariation); // Recalculate fall speed with variation
            drop.fadingStrength = applyVariation(config.baseFadingStrength, config.variations.fadingStrengthVariation); // Recalculate fading strength with variation
            drop.fadingSpeed = applyVariation(config.baseFadingSpeed, config.variations.fadingSpeedVariation); // Recalculate fading speed with variation
        }
    }
}

/**
 * Main draw function to combine top and bottom rain effects.
 * This function is repeatedly called to create the animation.
 */
function draw() {
    drawRain(topRainConfig, true); // Draw the top rain effect
    drawRain(bottomRainConfig, false); // Draw the bottom rain effect
}

// Set an interval to repeatedly call the draw function, creating the animation
setInterval(draw, 33); // 33ms interval gives roughly 30 frames per second

/**
 * Event listener to handle window resizing.
 * This ensures that the canvas and rain effect are resized appropriately.
 */
window.addEventListener('resize', () => {
    initCanvas(); // Reinitialize canvas dimensions to match the new window size
    initDrops(topRainConfig); // Reinitialize top drops
    initDrops(bottomRainConfig); // Reinitialize bottom drops
});