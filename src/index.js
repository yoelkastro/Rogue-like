var playerView = false; // For debug purposes

// gameBoard is the object that has the canvas
var gameBoard = {
	
	canvas : document.createElement("canvas"),
	// Initialize the gameBoard
	initialize : function(){
		// Initialize the canvas
		this.canvas.setAttribute("style", "margin:auto; display:block");
		document.body.appendChild(this.canvas);
		this.gc = this.canvas.getContext("2d");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.keys = [];
		// Add action listeners for the mouse and keyboard
		window.addEventListener('mousemove', function (e) {
     		gameBoard.mouseX = e.pageX;
      		gameBoard.mouseY = e.pageY;
    	});
    	window.addEventListener('keyup', function (e) {
     		gameBoard.keys = gameBoard.keys.filter(item => item != e.keyCode);
    	});
    	window.addEventListener('keydown', function (e) {
    		if(!gameBoard.keys.includes(e.keyCode)){
     			gameBoard.keys.push(e.keyCode);
     		}
    	});
	},
	// Set the desired resolution for the canvas, in width over height
	setResolution : function(res){
		this.resolution = res;
	},
	// Draw static objects; There are currently no static objects
	draw : function(){
	},
	// Resize the canvas depending on how much space is available
	resize : function(){
		// If the width to height ratio is larger than desired, use height as the basis for size
		if((window.innerWidth / (window.innerHeight - 20)) > this.resolution){
			this.canvas.width = (window.innerHeight - 20) * this.resolution;
			this.canvas.height = window.innerHeight - 20;
		}
		// If the width to height ratio is smaller than desired, use width as the basis for size
		else if((window.innerWidth / (window.innerHeight - 20)) < this.resolution){
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerWidth / this.resolution;
		}
		// If the width to height ratio is the same as the desired ratio, both can be used
		else{
			this.canvas.width = window.innerWidth;
			this.canvas.height = (window.innerHeight - 20);
		}
	},
	// Clear all the drawing in the gameBoard
	clear : function(){
		this.gc.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},

	// Returns the size of the canvas
	getSize : function(){
		return [this.canvas.width, this.canvas.height]
	},

	// Updates the canvas
	update : function(){
		this.clear();
		this.resize();
		this.draw();
	}

}

/*
	drawPlayerView: Draws the map in the perspective the player will see, 3 times larger

	map: Matrix of the dungeon
	gc: Canvas graphics context
*/
function drawPlayerView(map, gc){
	gc.fillRect(0, 0, gameBoard.canvas.width, gameBoard.canvas.height);
	for(var x = 0; x < map.length; x++){
		for(var y = 0; y < map[x].length; y++){
			map[x][y] = map[x][y] % 12;
			gc.fillStyle = colors[(map[x][y] % colors.length)];
			if(map[x][y] != 0){
				gc.fillRect(x * gameBoard.canvas.width / size * 3 - (player.getPos()[0] * (gameBoard.canvas.width / size * 3)) + gameBoard.getSize()[0] / 2, y * gameBoard.canvas.height / size * 3 - (player.getPos()[1] * (gameBoard.canvas.width / size * 3)) + gameBoard.getSize()[1] / 2, gameBoard.canvas.width / size * 3, gameBoard.canvas.height / size * 3);
			}
		}
	}
}

/*
	update: Update the gameBoard and entities
*/
function update(){
	gameBoard.update();
	if(playerView){
		drawPlayerView(matrix, gameBoard.gc);
	}
	else{
		drawMap(matrix, gameBoard.gc);
	}
	player.update();
}

gameBoard.initialize(); // Initialize the gameBoard
gameBoard.setResolution(3/3); // Set the resolution as a square

var playerPos; // The position of the player

var size = 41; // Size of the dungeon
var matrix = generateDungeon(size); // Generate the dungeon

var player = new Player(playerPos[0], playerPos[1]); // Initialize the player

setInterval(update, 10); // Update the game every 10 milliseconds
