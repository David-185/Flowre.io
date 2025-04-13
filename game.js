const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Background image
const background = new Image();
background.src = 'map1.svg';

// Set canvas size to match window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Camera properties
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

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
    color: '#3498db',
    lastX: canvas.width / 2,
    lastY: canvas.height / 2
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

// Obstacles data
const obstacles = [
    {x: 96, y: 55.67, width: 128, height: 125}, // block1

    //{x: 351, y: 233.67, width: 142, height: 141} // block2
];

// Check collision between player and obstacles
function checkObstacleCollision() {
    for (const obstacle of obstacles) {
        // Check if player circle intersects with obstacle rectangle
        const closestX = Math.max(obstacle.x, Math.min(player.x, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(player.y, obstacle.y + obstacle.height));
        
        const distanceX = player.x - closestX;
        const distanceY = player.y - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // calculate distancex and distancey for last position of player
        const closestXLast = Math.max(obstacle.x, Math.min(player.lastX, obstacle.x + obstacle.width));
        const closestYLast = Math.max(obstacle.y, Math.min(player.lastY, obstacle.y + obstacle.height));

        const distanceXLast = player.lastX - closestXLast;
        const distanceYLast = player.lastY - closestYLast;
        const distanceLast = Math.sqrt(distanceXLast * distanceXLast + distanceYLast * distanceYLast);

        // show distancex and distancey using html elements
        document.getElementById('distanceX').innerHTML = distanceX;
        document.getElementById('distanceY').innerHTML = distanceY;
        document.getElementById('distance').innerHTML = distance;



        if (distance < player.radius) {
        // if distancex is less than radius and larger than -player.radius, then it is colliding horizontally.
            if (distanceX < player.radius && distanceX > -player.radius && distanceX !==0) {
                // Collision detected, revert to last position
                player.x = player.lastX;
                
            }

            // if distancey is less than radius and larger than -radius, then it's colliding vertically.
            if (distanceY < player.radius && distanceY > -player.radius && distanceY!==0) {
                // Collision detected, revert to last position
                player.y = player.lastY;
                
            }

            if (distanceX !==0 && distanceY!==0) {
                // Collision detected, revert to last position
                player.x = player.lastX;
                player.y = player.lastY;
            }
            
            return true; 
        
        // Collision detected, revert to last position
            // if distancex is less than radius and larger than -player.radius, then it is colliding horizontally.
            // if distancey is less than radius and larger than -radius, then it's colliding vertically.
            // if distancex is less than radius and larger than -player.radius, then it is colliding horizontally.
            // Collision detected, revert to last position
        //    player.x = player.lastX;
       //     player.y = player.lastY;
       //     return true;
       }
    }
    return false;
}

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
    
    // Save last position before moving
    player.lastX = player.x;
    player.lastY = player.y;
    
    // Update player position based on speed
    player.x += player.xSpeed;
    player.y += player.ySpeed;
    
    // Check for obstacle collisions
    checkObstacleCollision();
    
    // Update camera position to follow player (keeping player centered)
    camera.x = player.x - canvas.width / 2;
    camera.y = player.y - canvas.height / 2;
    
    // Boundary checking (now relative to camera)
    if (player.x - player.radius < camera.x) player.x = camera.x + player.radius;
    if (player.x + player.radius > camera.x + canvas.width) player.x = camera.x + canvas.width - player.radius;
    if (player.y - player.radius < camera.y) player.y = camera.y + player.radius;
    if (player.y + player.radius > camera.y + canvas.height) player.y = camera.y + canvas.height - player.radius;
    
    // Save current canvas state
    ctx.save();
    
    // Translate canvas based on camera position
    ctx.translate(-camera.x, -camera.y);
    
    // Draw background (now relative to camera)
    if (background.complete) {
        ctx.drawImage(background, 
            //canvas.width/2 - background.width/2, canvas.height/2 - background.height/2);
            0, 0);
    }
    
    // Draw player (now relative to camera)
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
    
    // Restore canvas state
    ctx.restore();
    
    requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.width = canvas.width;
    camera.height = canvas.height;
});

// Start the game
gameLoop();