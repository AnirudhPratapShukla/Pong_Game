// Pong Game
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 100;
const ballRadius = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Paddle positions
let leftPaddleY = (canvasHeight - paddleHeight) / 2;
let rightPaddleY = (canvasHeight - paddleHeight) / 2;

// Paddle speed for AI
const aiSpeed = 4;

// Ball
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

// Scores
let leftScore = 0;
let rightScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - paddleHeight / 2;

  // Clamp paddle within canvas
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY + paddleHeight > canvasHeight)
    leftPaddleY = canvasHeight - paddleHeight;
});

// Draw everything
function draw() {
  // Background
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Center line
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
  ctx.setLineDash([]);

  // Left paddle
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Right paddle
  ctx.fillRect(canvasWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  // Scores
  ctx.font = "48px Arial";
  ctx.fillText(leftScore, canvasWidth / 4, 60);
  ctx.fillText(rightScore, 3 * canvasWidth / 4, 60);
}

// Update positions
function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collisions
  if (ballY - ballRadius < 0) {
    ballY = ballRadius;
    ballSpeedY *= -1;
  }
  if (ballY + ballRadius > canvasHeight) {
    ballY = canvasHeight - ballRadius;
    ballSpeedY *= -1;
  }

  // Left paddle collision
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballX = paddleWidth + ballRadius;
    ballSpeedX *= -1;
    // Add some randomness to ball angle
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Right paddle collision
  if (
    ballX + ballRadius > canvasWidth - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballX = canvasWidth - paddleWidth - ballRadius;
    ballSpeedX *= -1;
    // Add some randomness to ball angle
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Score update
  if (ballX - ballRadius < 0) {
    rightScore++;
    resetBall();
  }
  if (ballX + ballRadius > canvasWidth) {
    leftScore++;
    resetBall();
  }

  // AI for right paddle (simple follow)
  if (rightPaddleY + paddleHeight / 2 < ballY - 10) {
    rightPaddleY += aiSpeed;
  } else if (rightPaddleY + paddleHeight / 2 > ballY + 10) {
    rightPaddleY -= aiSpeed;
  }
  // Clamp AI paddle
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY + paddleHeight > canvasHeight)
    rightPaddleY = canvasHeight - paddleHeight;
}

function resetBall() {
  ballX = canvasWidth / 2;
  ballY = canvasHeight / 2;
  // Randomize direction
  ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();