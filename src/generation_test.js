// gameBoard is the object that has the canvas
var gameBoard = {
	
	canvas : document.createElement("canvas"),
	// Initialize the gameBoard
	initialize : function(){
		this.canvas.setAttribute("style", "margin:auto; display:block");
		document.body.appendChild(this.canvas);
		this.gc = this.canvas.getContext("2d");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.keys = [];
		// Add action listeners for the mouse
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
	// Draw static objects
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

	update : function(){
		this.clear();
		this.resize();
		this.draw();
	}

}

function update(){
	gameBoard.update();
	drawMap(matrix, gameBoard.gc);
}

gameBoard.initialize();
gameBoard.setResolution(1);

var size = 41;
var matrix = generateDungeon(size);


setInterval(update, 20);
