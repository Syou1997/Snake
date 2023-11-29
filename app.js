const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext()method會回傳一個Canvas的drawing context
//drawing context 可以用來在canvas內畫圖

//蛇的身體1格式多少
const unit = 20;
//遊戲的高有幾格
const row = canvas.height / unit; //320 / 20 = 16
//遊戲的寬有幾格
const column = canvas.width / unit; //320 / 20 = 16

let snake = []; //array中的每一個元素，都是一個物件
//創造蛇的方法
function create() {
    snake[0] = {
        x: 80,
        y: 0,
    };

    snake[1] = {
        x: 60,
        y: 0,
    };

    snake[2] = {
        x: 40,
        y: 0,
    };

    snake[3] = {
        x: 20,
        y: 0,
    }
}
//物件的工作是，儲存身體的x,y座標

//製作果實
class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }

    drawFruit() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    //選定新的座標
    pickALocation() {
        //檢查果實新出現的位置是否與蛇的位置重疊
        let overlapping = false;
        let new_x = Math.floor(Math.random() * column) * unit;
        let new_y = Math.floor(Math.random() * row) * unit;
        //是否重疊的方法
        function checkOverlap(new_x, new_y) {
            for (let i = 0; i < snake.length; i++) {
                if (new_x == snake[i].x && new_y == snake[i].y) {
                    // console.log("overlapping...");
                    overlapping = true;
                    return;
                } //防止無限次執行
                else {
                    overlapping = false;
                }
            }
        }
        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        } while (overlapping);

        this.x = new_x;
        this.y = new_y;
    }
}
//蛇的身體的每一個位置(初始設定)
create();
let myFruit = new Fruit();


//按鍵盤後改變蛇的方向(監聽)
window.addEventListener("keydown", changeDirection)
//蛇的預設行走方向
let d = "Right"
//按鍵盤後改變蛇的方向(方法)
function changeDirection(e) {
    //方向鍵變色效果
    let keyboard = document.querySelector(".keyboard");
    if (e.key === "ArrowRight" && d !== "Left") {
        d = "Right"
        keyboard.children[3].style.color = "orange";
        keyboard.children[0].style.color = "white"
        keyboard.children[1].style.color = "white"
        keyboard.children[2].style.color = "white"
    }
    if (e.key === "ArrowDown" && d !== "Up") {
        d = "Down"
        keyboard.children[1].style.color = "orange";
        keyboard.children[0].style.color = "white"
        keyboard.children[2].style.color = "white"
        keyboard.children[3].style.color = "white"
    }
    if (e.key === "ArrowLeft" && d !== "Right") {
        d = "Left"
        keyboard.children[2].style.color = "orange";
        keyboard.children[0].style.color = "white"
        keyboard.children[1].style.color = "white"
        keyboard.children[3].style.color = "white"
    }
    if (e.key === "ArrowUp" && d !== "Down") {
        d = "Up"
        keyboard.children[0].style.color = "orange";
        keyboard.children[1].style.color = "white"
        keyboard.children[2].style.color = "white"
        keyboard.children[3].style.color = "white"
    }

    //每次按下上下左右鍵之後，再下一帪被畫出來之前，程式碼不接受任何keydown事件
    //這樣可以防止連續按鍵，導致蛇在邏輯上自殺
    window.removeEventListener("keydown", changeDirection);
}

//剛開始的初始分數
let score = 0;
document.getElementById("myScore").innerHTML = "Score:" + score;
//最高分數
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML = "HighestScore:" + highestScore;

function draw() {
    //每次畫蛇之前，確定蛇有沒有咬到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            clearInterval(myGame);
            alert("遊戲結束");
            return;
        }

    }
    //每次畫新蛇之前先用黑色背景覆蓋蛇後再畫蛇(避免原本的蛇會留在畫面上)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //畫出果實
    myFruit.drawFruit();

    //畫出蛇
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            ctx.fillStyle = "lightgreen";
        } else {
            //設定要填滿的顏色
            ctx.fillStyle = "lightblue";
        }
        //蛇的外框
        ctx.strokeStyle = "white";

        //蛇的穿牆功能
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

        //物件裡的每一個x,y座標從以下的code開始改變
        //劃一個實心的長方形
        //x,y,width,height(裡面放4個參數)
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);

        //劃出一個帶有框的長方形
        //x,y,width,height(裡面放4個參數)
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }
    //以目前的d變數方向來決定蛇的下一帪要放在哪個座標
    //先抓出頭的座標
    let snakeX = snake[0].x; //snake[0]是一個物件，但snake[0].x是個number
    let snakeY = snake[0].y;
    if (d === "Left") {
        snakeX -= unit;
    } else if (d === "Up") {
        snakeY -= unit;
    } else if (d === "Right") {
        snakeX += unit;
    } else if (d === "Down") {
        snakeY += unit;
    }

    //確定移動位置後重新畫一個新的蛇的頭
    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //確認蛇是否有吃到果實
    if (snake[0].x === myFruit.x && snake[0].y === myFruit.y) {
        // console.log("吃到果實了");
        //重新選定一個新的隨機位置
        myFruit.pickALocation();
        //畫出新果實
        //更新分數
        score++
        document.getElementById("myScore").innerHTML = "Score:" + score;
        //更新最高分
        setHighestScore(score);
        document.getElementById("myScore2").innerHTML = "HighestScore:" + highestScore;
    } else {
        snake.pop();
    }
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
}

//蛇會自動動
let myGame = setInterval(draw, 100);

//取代遊戲最高分
function setHighestScore(score) {
    if (score > highestScore) {
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}

//取出遊戲最高分
function loadHighestScore() {
    if (localStorage.getItem("highestScore") === null) {
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}