"use strict";
addEventListener('load', start);

//Get html objects
var gameCanvas = document.getElementById("game-canvas");
gameCanvas.width = 480;
gameCanvas.height = 320;
var context = gameCanvas.getContext("2d");

//Images
var playerImage = document.createElement("img");
playerImage.src = "./images/boisurprised.png";

//Define canvas
var x = gameCanvas.width/2;
var y = gameCanvas.height-30;
var deltaX = 2;
var deltaY = -2;

//Define ball
var ballRad = 14;

//Define paddle
var paddleH = 10;
var paddleW = 75;
var paddleX = (gameCanvas.width-paddleW) / 2;
var paddleVelocity = 0;
var keyAcceleration = 0.2;
var passiveDeceleration = 0.2;

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
var paddleBounceSound;
var wallBounceSound;
var brickBounceSound;
var brickKillSound;
var winSound;
var loseSound;

function openHamburger()
{
    var ham = document.getElementsByClassName("hamburger-icon-container");

    ham[0].addEventListener("click",
    function()
    {
        this.classList.toggle("change");

        //Find header
        var mobileMenuContainer = document.getElementById("mobile-menu-container");

        if(mobileMenuContainer.style.maxHeight != "800px")
        {
            mobileMenuContainer.style.maxHeight = "800px";
        }
        else
        {
            mobileMenuContainer.style.maxHeight = null;
        }
    });
}

function start()
{
    openHamburger();

    paddleBounceSound = new sound("./sounds/bounceSound.mp3");
    wallBounceSound = new sound("./sounds/wall-bounce.mp3");
    brickBounceSound = new sound("./sounds/brick-bounce.mp3");
    brickKillSound = new sound("./sounds/brick-kill.mp3");
    winSound = new sound("./sounds/win-applause.mp3");
    loseSound = new sound("./sounds/lose-crowd-booing.mp3");


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
                brickLives: 3
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
            if(currentBrick.brickLives > 0) 
            {
                if(x > currentBrick.brickPosX && x < currentBrick.brickPosX + brickW && y > currentBrick.brickPosY && y < currentBrick.brickPosY + brickH) 
                {
                    deltaY = -deltaY;
                    currentBrick.brickLives--;//= 0;
                    if(currentBrick.brickLives == 0)
                    {
                        brickKillSound.play();
                        playerScore++;
                    }
                    else
                    {
                        brickBounceSound.play();
                    }
                    // playerScore++;

                    if(playerScore == (bRow*bCol - 6))
                    {
                        winSound.play();
                        
                        alert("You win!");

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
        wallBounceSound.play();
    }
    if(y + deltaY < ballRad) 
    {
        deltaY = -deltaY;
        wallBounceSound.play();
    }
    else if(y + deltaY > gameCanvas.height - ballRad) 
    {
        //Paddle bounce
        if(x > paddleX && x < paddleX + paddleW) 
        {
            deltaY = -deltaY;
            paddleBounceSound.play();
        }
        else 
        {
            playerLives--;
            if(playerLives == 0)
            {
                loseSound.play();
                alert("You lose!");
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
    // context.save();
    // context.translate(x,y);
    // context.rotate(45 * Math.PI/180);
    context.drawImage(playerImage, x-ballRad-3, y-ballRad-3, 30, 30);
    // context.translate(-200, -200);
    // context.restore();


    // context.beginPath();
    // context.arc(x, y, ballRad, 0, Math.PI*2);
    // context.fillStyle = "#0095DD";
    // context.fill();
    // context.closePath();
}

function drawPaddle()
{
    context.beginPath();

    if(isRightKeyDown && paddleX < gameCanvas.width - paddleW) 
    {
        paddleVelocity += keyAcceleration;
    }
    else if(isLeftKeyDown && paddleX > 0) 
    {
        paddleVelocity -= keyAcceleration;
    }
    else
    {
        if(paddleVelocity > -passiveDeceleration && paddleVelocity < passiveDeceleration)
        {
            paddleVelocity = 0;
        }
        else if(paddleVelocity > 0)
        {
            paddleVelocity -= passiveDeceleration;
        }
        else if(paddleVelocity < 0)
        {
            paddleVelocity += passiveDeceleration;
        }
    }

    if(paddleVelocity > 6)
    {
        paddleVelocity  = 6;
    }
    if(paddleVelocity < -6)
    {
        paddleVelocity = -6;
    }

    paddleX += paddleVelocity;
    if(paddleX > gameCanvas.width - paddleW)
    {
        paddleX = gameCanvas.width - paddleW;
        paddleVelocity = 0;
    }
    if(paddleX < 0)
    {
        paddleX = 0;
        paddleVelocity = 0;
    }


    context.rect(paddleX, gameCanvas.height-paddleH, paddleW, paddleH);
    context.fillStyle = "black";
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
                allBricks[c][r].brickLives = 0;
            }
            if((r == 2 && c == 0) || (r == 2 && c == 4))
            {
                allBricks[c][r].brickLives = 0;
            }

            if(allBricks[c][r].brickLives > 0)
            {
                var brickX = (c * (brickW  + brickPad)) + brickOffsetL;
                var brickY = (r * (brickH + brickPad)) + brickOffsetT;

                allBricks[c][r].brickPosX = brickX;
                allBricks[c][r].brickPosY = brickY;

                context.beginPath();
                context.rect(brickX, brickY, brickW, brickH);

                //colours
                if(allBricks[c][r].brickLives == 3)
                {
                    context.fillStyle = "#0033cc";
                }
                if(allBricks[c][r].brickLives == 2)
                {
                    context.fillStyle = "#668cff";
                }
                if(allBricks[c][r].brickLives == 1)
                {
                    context.fillStyle = "#b3c4ff";
                }

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
        try
        {
            this.sound.play();
        }
        catch
        {

        }
    }
    // this.stop = function()
    // {
    //   this.sound.pause();
    // }
}