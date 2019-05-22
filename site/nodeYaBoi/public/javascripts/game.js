"use strict";
addEventListener('load', start);

//Get html objects
var gameCanvas = document.getElementById("game-canvas");
var context = gameCanvas.getContext("2d");

//Define canvas
var x = gameCanvas.width/2;
var y = gameCanvas.height-30;
var deltaX = 2;
var deltaY = -2;

//Define ball
var ballRad = 10;

//Define paddle
var paddleH = 10;
var paddleW = 75;
var paddleX = (gameCanvas.width-paddleW) / 2;

//User input
var isRightKeyDown = false;
var isLeftKeyDown = false;

//Bricks
var bRow = 4;
var bCol = 5;
var brickW = 75;
var brickH = 20;
var brickPad = 10;
var brickOffsetT = 30;
var brickOffsetL = 30;
var allBricks = [];

//Score
var playerScore = 0;

//Player lives
var playerLives = 3;

//Sound
var bounceSound;

function start()
{
    bounceSound = new sound("./sounds/bounceSound.mp3");

    //Initialise all bricks
    for(var col = 0; col < bCol; col++)
    {
        allBricks[col] = [];
        for(var row = 0; row < bRow; row++)
        {
            allBricks[col][row] = 
            { 
                brickPosX : 0, 
                brickPosY : 0,
                isAlive: 1
            };
        }
    }

    // interval = setInterval(draw, 10);
    draw();

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
}

function onKeyDown(e) 
{
    if(e.key == "Right" || e.key == "ArrowRight") 
    {
        isRightKeyDown = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") 
    {
        isLeftKeyDown = true;
    }
}

function onKeyUp(e) 
{
    if(e.key == "Right" || e.key == "ArrowRight") 
    {
        isRightKeyDown = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") 
    {
        isLeftKeyDown = false;
    }
}

function brickCollisionDetection()
{
    for(var col = 0; col < bCol; col++) 
    {
        for(var row = 0; row < bRow; row++) 
        {
            var currentBrick = allBricks[col][row];
            if(currentBrick.isAlive == 1) 
            {
                if(x > currentBrick.brickPosX && x < currentBrick.brickPosX + brickW && y > currentBrick.brickPosY && y < currentBrick.brickPosY + brickH) 
                {
                    deltaY = -deltaY;
                    currentBrick.isAlive  = 0;
                    playerScore++;

                    if(playerScore == bRow*bCol) 
                    {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw()
{
    //Clear the canvas
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    //Draw each element of canvas
    drawBall();
    drawPaddle();
    drawBricks();
    brickCollisionDetection();
    drawScore();
    drawLives();

    //Moving ball
    x += deltaX;
    y += deltaY;
    if(x + deltaX > gameCanvas.width-ballRad || x + deltaX < ballRad) 
    {
        deltaX = -deltaX;
    }
    if(y + deltaY < ballRad) 
    {
        deltaY = -deltaY;
    }
    else if(y + deltaY > gameCanvas.height - ballRad) 
    {
        //Paddle bounce
        if(x > paddleX && x < paddleX + paddleW) 
        {
            deltaY = -deltaY;
            bounceSound.play();
        }
        else 
        {
            playerLives--;
            if(playerLives == 0)
            {
                alert("GAME OVER");
                document.location.reload();
            }
            else 
            {
                x = gameCanvas.width / 2;
                y = gameCanvas.height - 30;
                deltaX =  2;
                deltaY = -2;
                paddleX = (gameCanvas.width-paddleW)/2;
            }
        }
    }

    requestAnimationFrame(draw);
}

function drawBall()
{
    context.beginPath();
    context.arc(x, y, ballRad, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawPaddle()
{
    context.beginPath();

    if(isRightKeyDown && paddleX < gameCanvas.width - paddleW) 
    {
        paddleX += 7;
    }
    else if(isLeftKeyDown && paddleX > 0) 
    {
        paddleX -= 7;
    }

    context.rect(paddleX, gameCanvas.height-paddleH, paddleW, paddleH);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}

function drawBricks() 
{
    for(var c = 0; c < bCol; c++) 
    {
        for(var r = 0; r < bRow; r++) 
        {
            if(r == 3 && c !== 2)
            {
                allBricks[c][r].isAlive = 0;
            }
            if((r == 2 && c == 0) || (r == 2 && c == 4))
            {
                allBricks[c][r].isAlive = 0;
            }

            if(allBricks[c][r].isAlive == 1)
            {
                var brickX = (c * (brickW  + brickPad)) + brickOffsetL;
                var brickY = (r * (brickH + brickPad)) + brickOffsetT;

                allBricks[c][r].brickPosX = brickX;
                allBricks[c][r].brickPosY = brickY;

                context.beginPath();
                context.rect(brickX, brickY, brickW, brickH);
                context.fillStyle = "#0095DD";
                context.fill();
                context.closePath();
            }
        }
    }
}

function drawScore() 
{
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Score: "+playerScore, 8, 20);
}

function drawLives() 
{
    context.font = "16px Arial";
    context.fillStyle = "#0095DD";
    context.fillText("Lives: "+playerLives, gameCanvas.width-65, 20);
}





//Sound
function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function()
    {
      this.sound.play();
    }
    this.stop = function()
    {
      this.sound.pause();
    }
}