const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit;
const colum = canvas.width / unit;

let snake = [];
function drawSnake() {
  snake[0] = {
    x: 60,
    y: 0,
  };
  snake[1] = {
    x: 40,
    y: 0,
  };
  snake[2] = {
    x: 20,
    y: 0,
  };
  snake[3] = {
    x: 0,
    y: 0,
  };
}

drawSnake();
//每一個果實都是一個 個別的object，使用constructor function或class，都可以節省記憶體
class Fruit {
  //宣告屬性
  constructor() {
    this.x = Math.floor(Math.random() * colum) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    //先執行do迴圈一次，再去檢查while迴圈
    do {
      new_x = Math.floor(Math.random() * colum) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);
    this.x = new_x;
    this.y = new_y;

    //如果蛇的任何一個部位碰到果實，overlapping=true，return跳出迴圈，while會再執行一次do迴圈，直到overlapping=false
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == new_x && snake[i].y == new_y) {
          // console.log("overlapping");
          overlapping = true;
          return;
        } else {
          //少了此行，會造成do...while迴圈，無限輪迴
          overlapping = false;
        }
      }
    }
  }
}
let fruit = new Fruit();

let score = 0;
let highestScore;
currentScore();
document.getElementById("myScore").innerHTML = "目前分數 : " + score;
document.getElementById("myScore2").innerHTML = "最高分數 : " + highestScore;

function currentScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}
function maxScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

// 蛇的外觀和行為
function snaking() {
  //(畫面) 背景設定為黑色，每0.1秒會更新蛇的長度，避免已覆蓋的方式呈現，都要讓背景重新設定
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //(畫面) 果實
  fruit.drawFruit();
  //畫出蛇的形狀
  for (let i = 0; i < snake.length; i++) {
    //(資料) snake array[i]的顏色
    if (i == 0) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "blue";
    }
    ctx.strokeStyle = "white";
    //(資料) 每0.1s呼叫的snake array都會變動，用來避免蛇頭跑到canvas外面
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }
    //(畫面) fillRect會畫出蛇的形狀, strokeRect會畫出蛇的外框
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }
  //(data)透過d的方向，來決定蛇頭下一幀的位置出現在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  }

  //儲存下一幀新的蛇頭座標
  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  //確認新的蛇頭位置，有沒有碰到果實
  if (snake[0].x == fruit.x && snake[0].y == fruit.y) {
    fruit.pickALocation();
    score++;
    maxScore(score);
    document.getElementById("myScore").innerHTML = "目前分數 : " + score;
    document.getElementById("myScore2").innerHTML =
      "最高分數 : " + highestScore;
  } else {
    //刪除arr的最後一項
    snake.pop();
  }
  //新增下一幀蛇頭座標
  snake.unshift(newHead);
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(game);
      setTimeout(() => alert("碰到身體了..."), 0);
      return;
    }
  }
  //蛇移動
  window.addEventListener("keydown", changeSnake);
  //下一幀蛇頭座標是否會碰到身體
}

let game = setInterval(snaking, 100);
//預設d的方向是right
let d = "Right";
function changeSnake(e) {
  // 蛇頭方向只可以90度轉向，不能180度轉向
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  }
  // 防止0.1秒的間隔內連續改變d方向，導致蛇頭180度轉彎
  window.removeEventListener("keydown", changeSnake);
}
