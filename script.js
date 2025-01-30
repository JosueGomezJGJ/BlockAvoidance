const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const player = {
  x: window.innerWidth / 2 - 100,
  y: window.innerHeight / 2 - 150,
  width: 100,
  height: 100,
  color: "red",
  speed: 50,
};
const blocks = [];

let score = 0;

let gameOver = false;

let gameStarted = false;

const movePlayer = (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  }
  if (e.key === "ArrowRight" && player.x < window.innerWidth - player.width) {
    player.x += player.speed;
  }
  if (e.key === "ArrowUp" && player.y > 0) {
    player.y -= player.speed;
  }
  if (e.key === "ArrowDown" && player.y < window.innerHeight - player.height) {
    player.y += player.speed;
  }
};

document.addEventListener("keydown", movePlayer);

const resizeCanvas = () => {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const drawPlayer = () => {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
};

const createBlock = () => {
  blocks.push({
    x: Math.random() * (window.innerWidth - 50),
    y: 0,
    width: 50,
    height: 50,
    color: "blue",
    speed: 2 + score * 0.5,
  });
};

const drawBlocks = () => {
  blocks.forEach((block) => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });
};

let pointBlock = {
  x: Math.random() * (window.innerWidth - 50),
  y: Math.random() * (window.innerHeight - 50),
  radius: 25,
  color: "yellow",
  active: true,
};

const drawPointBlock = () => {
  if (pointBlock.active) {
    ctx.beginPath();
    ctx.arc(pointBlock.x, pointBlock.y, pointBlock.radius, 0, 2 * Math.PI);
    ctx.fillStyle = pointBlock.color;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }
};

const checkPointBlockCollision = () => {
  if (pointBlock.active) {
    const dx = player.x + player.width / 2 - pointBlock.x;
    const dy = player.y + player.height / 2 - pointBlock.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pointBlock.radius + player.width / 2) {
      score += 1;
      pointBlock.active = false;
    }
  }
};

setInterval(() => {
  pointBlock.x = Math.random() * (window.innerWidth - 50);
  pointBlock.y = Math.random() * (window.innerHeight - 50);
  pointBlock.active = true;
}, 5000);

const moveBlocks = () => {
  blocks.forEach((block, index) => {
    block.y += block.speed;

    if (block.y > window.innerHeight) {
      blocks.splice(index, 1);
    }

    if (
      block.y + block.height > player.y &&
      block.y < player.y + player.height &&
      block.x + block.width > player.x &&
      block.x < player.x + player.width
    ) {
      gameOver = true;
    }
  });
};

const drawScore = () => {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
};

const drawMenu = () => {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("Press any key to start", c.width / 2 - 150, c.height / 2);
};

const startGame = () => {
  if (!gameStarted) {
    gameStarted = true;
    score = 0;
    blocks.length = 0;
    gameLoop();
  }
};

document.addEventListener("keydown", startGame);

document.addEventListener("click", startGame);

const restartGame = (e) => {
  if (gameOver && e.key === " ") {
    gameOver = false;
    score = 0;
    blocks.length = 0;
    player.x = window.innerWidth / 2 - player.width / 2;
    player.y = window.innerHeight / 2 - player.height / 2;

    gameLoop();
  }
};

document.addEventListener("keydown", restartGame);

const gameLoop = (e) => {
  if (!gameStarted) {
    drawMenu();
    return;
  }
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(c.width / 2 - 275, c.height / 2 - 150, 550, 300);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", c.width / 2 - 225, c.height / 2 - 50);
    ctx.fillText(`FINAL SCORE: ${score}`, c.width / 2 - 225, c.height / 2);
    ctx.fillText(
      "PRESS SPACE TO START OVER",
      c.width / 2 - 225,
      c.height / 2 + 100
    );
    return;
  }

  ctx.clearRect(0, 0, c.width, c.height);

  drawPlayer();
  drawBlocks();
  drawPointBlock();
  drawScore();
  moveBlocks();
  checkPointBlockCollision();

  requestAnimationFrame(gameLoop);
};

setInterval(createBlock, 1000);

gameLoop();
