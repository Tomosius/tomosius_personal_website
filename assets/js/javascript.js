/**
 * Get the canvas element and its 2D rendering context.
 * The context is used to draw on the canvas.
 */
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

/**
 * Set canvas dimensions to match the window size.
 * This ensures the Matrix Rain effect covers the entire screen.
 */
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas(); // Initialize canvas size on load

/**
 * Website will consist of 2 separate Matrix rains going from top to screen center
 * and from bottom to screen center, both meeting in the center of the screen.
 * None of the matrix falls beyond that point. Both rains will feature separate lists of words.
 */

// Top Part Matrix Rain settings
const topRainConfig = {
    words: ['TOP1', 'TOP2', 'TOP3', 'TOP4', 'TOP5'], // Words to be displayed in the top rain
    fontSize: 16, // Font size for the text
    baseFallSpeed: 0.2, // Base speed for the falling words
    baseFadingStrength: 0.05, // Base strength for the fading effect (trail length)
    baseFadingSpeed: 0.05, // Base speed at which the words fade
    drops: [] // Array to store the properties of each column of falling words
};

// Configuration object for the bottom rain effect
const bottomRainConfig = {
    words: ['BOTTOM1', 'BOTTOM2', 'BOTTOM3', 'BOTTOM4', 'BOTTOM5'], // Words to be displayed in the bottom rain
    fontSize: 16, // Font size for the text
    baseFallSpeed: 0.2, // Base speed for the rising words (same as falling speed)
    baseFadingStrength: 0.05, // Base strength for the fading effect (trail length)
    baseFadingSpeed: 0.05, // Base speed at which the words fade
    drops: [] // Array to store the properties of each column of rising words
};

/**
 * Function to initialize the drops for the rain effect.
 * Each drop represents a column of text that will fall or rise.
 * @param {Object} config - The configuration object for the rain effect.
 */
function initDrops(config) {
    const columns = canvas.width / config.fontSize; // Calculate the number of columns based on canvas width and font size
    for (let x = 0; x < columns; x++) {
        config.drops[x] = {
            yPos: Math.random() * (canvas.height / 2) / config.fontSize, // Random initial vertical position within the upper or lower half of the screen
            word: config.words[Math.floor(Math.random() * config.words.length)], // Randomly select a word from the config
            fallSpeed: config.baseFallSpeed, // Use the base fall speed
            fadingStrength: config.baseFadingStrength, // Use the base fading strength
            fadingSpeed: config.baseFadingSpeed // Use the base fading speed
        };
    }
}

// Initialize the drops for both top and bottom rain effects
initDrops(topRainConfig);
initDrops(bottomRainConfig);

/**
 * Function to draw the rain effect on the canvas.
 * @param {Object} config - The configuration object for the rain effect.
 */
function drawRain(config) {
    const columns = canvas.width / config.fontSize; // Calculate the number of columns based on canvas width and font size

    // Clear the canvas with a fading effect based on the minimum fading strength among all drops
    ctx.fillStyle = `rgba(0, 0, 0, ${config.baseFadingStrength})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = config.fontSize + 'px monospace'; // Set the font size and style
    ctx.fillStyle = "#0F0"; // Set the color for the text (green in this case)

    for (let i = 0; i < columns; i++) {
        const drop = config.drops[i];

        // Determine the vertical position based on whether it's top or bottom rain
        const yPos = config === topRainConfig ? drop.yPos * config.fontSize : canvas.height - drop.yPos * config.fontSize;
        ctx.fillText(drop.word, i * config.fontSize, yPos); // Draw the word at the calculated position

        // Increment the drop position based on the fall speed
        drop.yPos += drop.fallSpeed;

        // Reset drop position, word, and properties if it goes beyond the center of the screen
        if (drop.yPos * config.fontSize > canvas.height / 2) {
            drop.yPos = Math.random() * (canvas.height / 2) / config.fontSize; // Reset to a random position within the upper or lower half
            drop.word = config.words[Math.floor(Math.random() * config.words.length)]; // Select a new random word
            // Reset speeds to the base values
            drop.fallSpeed = config.baseFallSpeed;
            drop.fadingStrength = config.baseFadingStrength;
            drop.fadingSpeed = config.baseFadingSpeed;
        }
    }
}

/**
 * Main draw function to combine top and bottom rain effects.
 * This function is repeatedly called to create the animation.
 */
function draw() {
    drawRain(topRainConfig); // Draw the top rain effect
    drawRain(bottomRainConfig); // Draw the bottom rain effect
}

// Set an interval to repeatedly call the draw function, creating the animation
setInterval(draw, 33); // 33ms interval gives roughly 30 frames per second

// Add an event listener to handle window resizing
window.addEventListener('resize', () => {
    initCanvas(); // Reinitialize canvas dimensions
    initDrops(topRainConfig); // Reinitialize top drops
    initDrops(bottomRainConfig); // Reinitialize bottom drops
});