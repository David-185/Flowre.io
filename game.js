const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to match window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    maxSpeed: 3,
    xSpeed: 0,
    ySpeed: 0,
    acceleration: 0.2,
    deceleration: 0.2,
    color: '#3498db'
};

// Track key states
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

// Event listeners for key presses
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() in keys) {
        keys[e.key.toLowerCase()] = false;
    }
});

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update x-axis speed
    if (keys.a) {
        player.xSpeed = Math.max(player.xSpeed - player.acceleration, -player.maxSpeed);
    } else if (keys.d) {
        player.xSpeed = Math.min(player.xSpeed + player.acceleration, player.maxSpeed);
    } else {
        // Apply deceleration when no horizontal keys pressed
        if (player.xSpeed > 0) {
            player.xSpeed = Math.max(player.xSpeed - player.deceleration, 0);
        } else if (player.xSpeed < 0) {
            player.xSpeed = Math.min(player.xSpeed + player.deceleration, 0);
        }
    }
    
    // Update y-axis speed
    if (keys.w) {
        player.ySpeed = Math.max(player.ySpeed - player.acceleration, -player.maxSpeed);
    } else if (keys.s) {
        player.ySpeed = Math.min(player.ySpeed + player.acceleration, player.maxSpeed);
    } else {
        // Apply deceleration when no vertical keys pressed
        if (player.ySpeed > 0) {
            player.ySpeed = Math.max(player.ySpeed - player.deceleration, 0);
        } else if (player.ySpeed < 0) {
            player.ySpeed = Math.min(player.ySpeed + player.deceleration, 0);
        }
    }
    
    // Update player position based on speed
    player.x += player.xSpeed;
    player.y += player.ySpeed;
    
    // Boundary checking
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;
    
    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
    
    requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the game
gameLoop();