// 3D Ping Pong Game - Main Game Engine with First Person View
let scene, camera, renderer;
let playerPaddle, aiPaddle, ball, table;
let playerScore = 0, aiScore = 0;
let gameRunning = true;
let gamePaused = false;
let keys = {};
let ai;
let gameStarted = false;
let gameOverFlag = false;

const WINNING_SCORE = 5;
const GAME_WIDTH = 40;
const GAME_HEIGHT = 30;
const PADDLE_HEIGHT = 6;
const PADDLE_WIDTH = 1;
const PADDLE_DEPTH = 0.5;
const BALL_SIZE = 0.4;
const TABLE_HEIGHT = 0.2;

// First-person view settings
const PLAYER_EYE_HEIGHT = 1.5;
const PLAYER_EYE_DISTANCE = 2; // Distance in front of paddle

function init() {
    console.log('Initializing 3D Ping Pong Game (First Person View)...');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 150);

    // Camera setup - First Person View
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Initial position will be set after paddle is created
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    console.log('WebGL Renderer created');

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -60;
    directionalLight.shadow.camera.right = 60;
    directionalLight.shadow.camera.top = 60;
    directionalLight.shadow.camera.bottom = -60;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    console.log('Lighting setup complete');

    // Create game objects
    createTable();
    createPaddles();
    createBall();
    createWalls();
    createOpponentView();

    console.log('Game objects created');

    // Set camera to first person position
    updateCameraPosition();

    // Initialize AI
    ai = new AI(aiPaddle, ball);

    console.log('AI initialized');

    // Event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', onWindowResize);

    console.log('Event listeners attached');

    // Update UI
    updateGameStatus();
    updateGameUI();

    console.log('Game initialized successfully!');

    // Start animation loop
    animate();
}

function createTable() {
    // Table surface
    const tableGeometry = new THREE.BoxGeometry(GAME_WIDTH, TABLE_HEIGHT, GAME_HEIGHT);
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a5f1a,
        roughness: 0.6,
        metalness: 0.1
    });
    table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -0.1;
    table.castShadow = true;
    table.receiveShadow = true;
    scene.add(table);

    // Table net (center line)
    const netGeometry = new THREE.BoxGeometry(0.2, 3, GAME_HEIGHT);
    const netMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x444444
    });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.y = 1.5;
    net.castShadow = true;
    scene.add(net);
}

function createPaddles() {
    // Player paddle (right side)
    const paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH);
    const paddleMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0xff0000
    });
    playerPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    playerPaddle.position.set(GAME_WIDTH / 2 - 2, 0, 0);
    playerPaddle.castShadow = true;
    playerPaddle.receiveShadow = true;
    playerPaddle.userData = {
        velocity: { x: 0, y: 0, z: 0 },
        speed: 0.6
    };
    scene.add(playerPaddle);

    // AI paddle (left side)
    const aiPaddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.6,
        roughness: 0.4,
        emissive: 0x0066ff
    });
    aiPaddle = new THREE.Mesh(paddleGeometry, aiPaddleMaterial);
    aiPaddle.position.set(-GAME_WIDTH / 2 + 2, 0, 0);
    aiPaddle.castShadow = true;
    aiPaddle.receiveShadow = true;
    aiPaddle.userData = {
        velocity: { x: 0, y: 0, z: 0 },
        speed: 0.35
    };
    scene.add(aiPaddle);
}

function createBall() {
    const ballGeometry = new THREE.SphereGeometry(BALL_SIZE, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x888800
    });
    ball = {
        position: { x: 0, y: 2, z: 0 },
        velocity: { x: 0.3, y: 0, z: 0 },
        gravity: 0.02,
        mesh: new THREE.Mesh(ballGeometry, ballMaterial)
    };
    ball.mesh.castShadow = true;
    ball.mesh.receiveShadow = true;
    scene.add(ball.mesh);
}

function createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.3,
        roughness: 0.7
    });

    // Back wall
    const backWallGeometry = new THREE.BoxGeometry(GAME_WIDTH, 8, 1);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -GAME_HEIGHT / 2 - 0.5;
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Front wall
    const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    frontWall.position.z = GAME_HEIGHT / 2 + 0.5;
    frontWall.castShadow = true;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Left side wall
    const leftWallGeometry = new THREE.BoxGeometry(1, 8, GAME_HEIGHT);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -GAME_WIDTH / 2 - 0.5;
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right side wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.x = GAME_WIDTH / 2 + 0.5;
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createOpponentView() {
    // Add a visual representation showing the opponent paddle in the distance
    const helperGeometry = new THREE.BoxGeometry(PADDLE_WIDTH * 0.8, PADDLE_HEIGHT * 0.8, PADDLE_DEPTH * 0.8);
    const helperMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.4,
        roughness: 0.6,
        transparent: true,
        opacity: 0.3,
        emissive: 0x0044aa
    });
}

function updateCameraPosition() {
    // Position camera at player's eye level, behind the player paddle
    // Looking towards the opponent
    camera.position.set(
        playerPaddle.position.x - PLAYER_EYE_DISTANCE,
        PLAYER_EYE_HEIGHT,
        0
    );
    // Look at the center of the table
    camera.lookAt(0, PLAYER_EYE_HEIGHT, 0);
}

function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;

    if (e.key === ' ') {
        e.preventDefault();
        gamePaused = !gamePaused;
        updateGameStatus();
    }
    if (e.key.toLowerCase() === 'r') {
        resetGame();
    }
    if (e.key.toLowerCase() === 'd') {
        if (ai) ai.cycleDifficulty();
        updateGameStatus();
    }
}

function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function updatePaddleMovement() {
    // Player paddle movement
    let playerVelocity = 0;
    if (keys['arrowup'] || keys['w']) playerVelocity = playerPaddle.userData.speed;
    if (keys['arrowdown'] || keys['s']) playerVelocity = -playerPaddle.userData.speed;

    playerPaddle.position.z += playerVelocity;
    playerPaddle.position.z = Math.max(-GAME_HEIGHT / 2 + PADDLE_DEPTH, 
                                        Math.min(GAME_HEIGHT / 2 - PADDLE_DEPTH, playerPaddle.position.z));

    // AI paddle movement
    if (ai) ai.update();
}

function updateGame() {
    if (!gameRunning || gamePaused) return;

    // Update physics
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
    ball.position.z += ball.velocity.z;

    // Ball physics
    ball.velocity.y -= ball.gravity;
    ball.position.y = Math.max(BALL_SIZE, ball.position.y); // Keep above table

    updatePaddleMovement();

    // Collision with paddles
    if (checkPaddleCollision(playerPaddle, ball)) {
        ball.velocity.x = Math.abs(ball.velocity.x);
        ball.velocity.x *= 1.05; // Increase speed
        ball.position.x = playerPaddle.position.x - (PADDLE_WIDTH / 2 + BALL_SIZE);
    }

    if (checkPaddleCollision(aiPaddle, ball)) {
        ball.velocity.x = -Math.abs(ball.velocity.x);
        ball.velocity.x *= 1.05;
        ball.position.x = aiPaddle.position.x + (PADDLE_WIDTH / 2 + BALL_SIZE);
    }

    // Collision with walls (z-axis)
    if (Math.abs(ball.position.z) > GAME_HEIGHT / 2 - BALL_SIZE) {
        ball.velocity.z *= -1;
        ball.position.z = Math.max(-GAME_HEIGHT / 2 + BALL_SIZE, 
                                    Math.min(GAME_HEIGHT / 2 - BALL_SIZE, ball.position.z));
    }

    // Collision with top/bottom
    if (ball.position.y < BALL_SIZE) {
        ball.velocity.y *= -0.7;
        ball.position.y = BALL_SIZE;
    }

    // Score check
    if (ball.position.x > GAME_WIDTH / 2 + 5) {
        aiScore++;
        resetBall();
        checkGameOver();
    }

    if (ball.position.x < -GAME_WIDTH / 2 - 5) {
        playerScore++;
        resetBall();
        checkGameOver();
    }

    // Update mesh positions
    ball.mesh.position.copy(ball.position);
    
    // Update camera position to follow player paddle movement
    updateCameraPosition();
    
    updateGameUI();
}

function checkPaddleCollision(paddle, ball) {
    const dx = ball.position.x - paddle.position.x;
    const dy = ball.position.y - paddle.position.y;
    const dz = ball.position.z - paddle.position.z;

    return Math.abs(dx) < PADDLE_WIDTH / 2 + BALL_SIZE &&
           Math.abs(dy) < PADDLE_HEIGHT / 2 + BALL_SIZE &&
           Math.abs(dz) < PADDLE_DEPTH / 2 + BALL_SIZE;
}

function resetBall() {
    ball.position = { x: 0, y: 2, z: 0 };
    ball.velocity = {
        x: (Math.random() > 0.5 ? 1 : -1) * 0.3,
        y: 0,
        z: (Math.random() - 0.5) * 0.2
    };
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    gameOverFlag = false;
    document.getElementById('gameOver').style.display = 'none';
    resetBall();
    gameRunning = true;
    gamePaused = false;
    updateGameStatus();
}

function checkGameOver() {
    if (playerScore >= WINNING_SCORE) {
        gameOverFlag = true;
        showGameOver('You Win!', `Final Score: ${playerScore} - ${aiScore}`);
    } else if (aiScore >= WINNING_SCORE) {
        gameOverFlag = true;
        showGameOver('AI Wins!', `Final Score: ${playerScore} - ${aiScore}`);
    }
}

function showGameOver(title, message) {
    gameRunning = false;
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('gameOverMessage').textContent = title;
    document.getElementById('gameOverScore').textContent = message;
    document.getElementById('gameOver').style.display = 'block';
}

function updateGameUI() {
    document.getElementById('score').textContent = `You: ${playerScore} | AI: ${aiScore}`;
    const speed = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y + ball.velocity.z * ball.velocity.z);
    document.getElementById('ballSpeed').textContent = speed.toFixed(2);
}

function updateGameStatus() {
    const status = gamePaused ? 'PAUSED' : 'Running';
    document.getElementById('gameStatus').textContent = `Status: ${status}`;
    document.getElementById('difficulty').textContent = ai ? ai.difficulty.toUpperCase() : 'N/A';
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    updateGame();

    renderer.render(scene, camera);
}

// Start the game
window.addEventListener('load', init);
