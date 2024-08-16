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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * Characters that will be used in the Matrix Rain.
 * You can customize this string to include different characters.
 */
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Font size for the Matrix Rain characters.
 * The font size will determine the size of the characters and the spacing between them.
 */
const fontSize = 16;

/**
 * Calculate the number of columns based on the canvas width and font size.
 * Each column will contain a "drop" of characters falling down the screen.
 */
const columns = canvas.width / fontSize;

/**
 * Initialize the drops array, which will store the y-positions of each column's drop.
 * The drops will start off-screen, at the height of the canvas.
 */
const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = canvas.height / fontSize;
}

/**
 * Function to draw the Matrix Rain effect on the canvas.
 * This function is called repeatedly to create the animation.
 */
function draw() {
    // Fill the entire canvas with a semi-transparent black rectangle.
    // This creates a trailing effect by slightly fading the previous frames.
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the text color to green and the font style to monospace.
    ctx.fillStyle = "#0F0";
    ctx.font = `${fontSize}px monospace`;

    // Loop through each column to draw the characters.
    for (let i = 0; i < drops.length; i++) {
        // Select a random character from the characters string.
        const text = characters.charAt(Math.floor(Math.random() * characters.length));

        // Draw the character at the current position in the column.
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Randomly reset the drop to the top of the screen with a small probability.
        // This creates the effect of new drops starting at different times.
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move the drop down the screen by incrementing its y-position.
        drops[i]++;
    }
}

/**
 * Set an interval to repeatedly call the draw function.
 * The interval is set to 33 milliseconds, which results in approximately 30 frames per second.
 * This creates a smooth animation for the Matrix Rain effect.
 */
setInterval(draw, 33);

/**
 * Add an event listener to handle window resizing.
 * When the window is resized, the canvas size is reinitialized and the drops array is updated.
 */
window.addEventListener('resize', () => {
    // Reinitialize the canvas dimensions to match the new window size.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear and reinitialize the drops array to reset the positions.
    drops.length = 0;
    for (let x = 0; x < columns; x++) {
        drops[x] = canvas.height / fontSize;
    }
});