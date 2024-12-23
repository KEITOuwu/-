let animations = [[], []];
let currentAnimations = [[], []]; // 兩個角色的動畫陣列
let frames = [[], []];
let frameSizes = [[], []];
let currentAnimationIndex = [0, 0];
let framesIndex = [0, 0];
let characters = [];
let backgroundImg;

function preload() {
  // 載入兩個角色的圖片和背景圖片
  animations[0] = [
    loadImage('111.png'),
    loadImage('222.png'),
    loadImage('333.png')
  ];
  
  animations[1] = [
    loadImage('444.png'),
    loadImage('555.png'),
  ];
  
  backgroundImg = loadImage('background.png');

  // 設定每個角色每個動作的幀數
  frames[0] = [2, 4, 3];
  frames[1] = [6, 6];

  // 設定每個角色每個動作的幀大小
  frameSizes[0] = [[96, 150], [132, 143], [152, 149]];
  frameSizes[1] = [[161,95], [161, 95]];

  // 初始化角色
  characters.push({ x: 100, y: height - 150, vx: 0, vy: 0, isJumping: false });
  characters.push({ x: 400, y: height - 150, vx: 0, vy: 0, isJumping: false });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  imageMode(CENTER);
  
  // 設定文字屬性
  textAlign(RIGHT, TOP);
  textSize(32);
  textStyle(BOLD);

  // 初始化角色位置在畫面底部
  characters = [
    { x: 100, y: height - 150, vx: 0, vy: 0, isJumping: false },
    { x: 400, y: height - 150, vx: 0, vy: 0, isJumping: false }
  ];
}

function draw() {
  // 清除畫布
  clear();
  // 繪製全屏背景
  image(backgroundImg, width/2, height/2, width, height);

  // 在右上角繪製 TKU 文字
  fill(255);          // 白色文字
  stroke(0);         // 黑色邊框
  strokeWeight(3);    // 邊框粗細
  text('TKU', width - 20, 20);  // 位置在右上角，留 20 像素邊距

  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];
    // 移動角色
    character.x += character.vx;
    character.y += character.vy;
    // 重力
    character.vy += 0.5;
    // 地面碰撞
    if (character.y >= height - 150) {
      character.y = height - 150;
      character.vy = 0;
      character.isJumping = false;
    }

    // 確保角色不會超出畫面
    character.x = constrain(character.x, 50, width - 50);

    // 繪製角色動畫
    const { frameWidth, frameHeight, sx } = calculateFramePosition(i, currentAnimationIndex[i], framesIndex[i]);
    image(
      animations[i][currentAnimationIndex[i]],
      character.x,
      character.y,
      frameWidth,
      frameHeight,
      sx,
      0,
      frameWidth,
      frameHeight
    );

    // 更新幀數
    framesIndex[i] = (framesIndex[i] + 1) % frames[i][currentAnimationIndex[i]];
  }
}

function keyPressed() {
  // 第一個角色控制 (方向鍵)
  if (keyCode === LEFT_ARROW) {
    characters[0].vx = -5;
    currentAnimationIndex[0] = 1;
  } else if (keyCode === RIGHT_ARROW) {
    characters[0].vx = 5;
    currentAnimationIndex[0] = 1;
  } else if (keyCode === UP_ARROW && !characters[0].isJumping) {
    characters[0].vy = -15;
    characters[0].isJumping = true;
    currentAnimationIndex[0] = 2;
  }

  // 第二個角色控制 (WASD)
  if (key === 'a' || key === 'A') {
    characters[1].vx = -5;
    currentAnimationIndex[1] = 1;
  } else if (key === 'd' || key === 'D') {
    characters[1].vx = 5;
    currentAnimationIndex[1] = 1;
  } else if ((key === 'w' || key === 'W') && !characters[1].isJumping) {
    characters[1].vy = -15;  // 跳躍速度
    characters[1].isJumping = true;
    currentAnimationIndex[1] = 2;  // 切換到跳躍動畫
  }
}

function keyReleased() {
  // 第一個角色停止
  if (keyCode === LEFT_ARROW && characters[0].vx < 0) {
    characters[0].vx = 0;
    currentAnimationIndex[0] = 0;
  } else if (keyCode === RIGHT_ARROW && characters[0].vx > 0) {
    characters[0].vx = 0;
    currentAnimationIndex[0] = 0;
  }

  // 第二個角色停止
  if ((key === 'a' || key === 'A') && characters[1].vx < 0) {
    characters[1].vx = 0;
    currentAnimationIndex[1] = 0;
  } else if ((key === 'd' || key === 'D') && characters[1].vx > 0) {
    characters[1].vx = 0;
    currentAnimationIndex[1] = 0;
  }

  // 當角色著地時，恢復待機動畫
  if (characters[0].isJumping === false) {
    currentAnimationIndex[0] = 0;
  }
  if (characters[1].isJumping === false) {
    currentAnimationIndex[1] = 0;
  }
}

function calculateFramePosition(characterIndex, animationIndex, frameIndex) {
  const frameWidth = frameSizes[characterIndex][animationIndex][0];
  const frameHeight = frameSizes[characterIndex][animationIndex][1];
  const sx = frameIndex * frameWidth;
  
  return {
    frameWidth,
    frameHeight,
    sx
  };
}

// ... 其他函數
