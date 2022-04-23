// Incomplete

var myGamePiece; // Player storage
var myObstacles = []; // Obstacle storage
var myScore; // Score Storage
var movementSpeed = 4; // Player move speed
if (localStorage.myHighScore == undefined) { // Create a local high score if it doesn't exist
    localStorage.myHighScore = 0
}

function startGame() {
    myGameArea.start();
    myGamePiece = new component(30, 30, "purple", 50, 250); // create the game piece as a 30 by 30 block halfway down the canvas and 50 pixels from the left edge
    myHighScore = new component("30px", "Consolas", "black", 10, 40, "text"); // Create the high score text in the top left
    myScore = new component("30px", "Consolas", "black", 10, 70, "text"); // Create the score text in the top left just below the high score
    myObstacle = new component(20, 150, "black", 300, 120); // Create the obstacle compenent with 20 width and 150 height
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() { // Make a 1000 by 400 canvas and set the interval
        this.canvas.width = 1000;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function component(width, height, color, x, y, type) { // Function that handles creating components
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() { // Moves the position of the component
        this.x += this.speedX;
        this.y += this.speedY;
    } 
    this.crashWith = function(otherobj) { // Set up collision detection
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) { // Check all objects for collision with the player
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop(); // If collision occurs then the game stops
        return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) { // On the first frame and every 150 after create and push an obstacle
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = myGamePiece.height * 1.5;
        maxGap = myGamePiece.height * 5;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) { // Move all obstacles
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    if (myGameArea.frameNo > localStorage.myHighScore){ // If the score is higher than the highscore, the highscore is updated
        localStorage.myHighScore = myGameArea.frameNo;
    }
    myHighScore.text = "HIGH SCORE: " + localStorage.myHighScore;
    myScore.update();
    myHighScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function moveup() {
    myGamePiece.speedY -= movementSpeed;
}

function movedown() {
    myGamePiece.speedY += movementSpeed;
}

function moveleft() {
    myGamePiece.speedX -= movementSpeed;
}

function moveright() {
    myGamePiece.speedX += movementSpeed;
}

function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}