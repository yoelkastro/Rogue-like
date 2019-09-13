class Entity {
	/*
		Superclass for all entities
	*/
	
	constructor(x, y){ // Initialize each entity with a position
		this.x = x;
		this.y = y;
	}

	/*
		getPos: Returns the x and y position of the Entity
	*/
	getPos(){
		return [this.x, this.y];
	}

	/*
		draw: Draws the Entity as a square with a unique color
	*/
	draw(){
		gameBoard.gc.fillStyle = this.color;
		if(playerView){
			gameBoard.gc.fillRect(this.x * gameBoard.canvas.width / size * 3 - (player.getPos()[0] * (gameBoard.canvas.width / size * 3))  + gameBoard.getSize()[0] / 2, this.y * gameBoard.canvas.height / size * 3 - (player.getPos()[1] * (gameBoard.canvas.width / size * 3)) + gameBoard.getSize()[1] / 2, gameBoard.canvas.width / size, gameBoard.canvas.height / size);
		}
		else{
			gameBoard.gc.fillRect(this.x * gameBoard.canvas.width / size, this.y * gameBoard.canvas.height / size, gameBoard.canvas.width / size / 3, gameBoard.canvas.height / size / 3);
		}
	}

}

class Monster extends Entity {
	/*
		Enemy, not implemented
	*/
}

class Player extends Entity {
	/*
		The Player's character. Subclass of Entity
	*/

	constructor(x, y){ // Initialize with a position and a specific color, light blue
		super(x, y);
		this.color = "#4A4AFF";
	}

	/*
		move: Moves the Player according to keyboard events
	*/
	move(){
		var maxStep = 0.025 // Maximum speed the Player can go at
		var vel = [0, 0]; // x and y velocity of the Player
		/*
			Check which keys are pressed and if there are walls preventing the player from moving in that direction
		*/
		// 37 -> Left
		if(gameBoard.keys[gameBoard.keys.length - 1] == 37 && matrix[Math.floor(this.x - maxStep)][Math.floor(this.y)] != 0 && matrix[Math.floor(this.x - maxStep)][Math.floor(this.y + (1/3))] != 0 && this.x - maxStep * 2 > 0){
			vel[0] -= maxStep;
		}
		// 38 -> Up
		if(gameBoard.keys[gameBoard.keys.length - 1] == 38 && matrix[Math.floor(this.x)][Math.floor(this.y - maxStep)] != 0 && matrix[Math.floor(this.x + (1/3))][Math.floor(this.y - maxStep)] != 0 && this.y > 0){
			vel[1] -= maxStep;
		}
		// 39 -> Right
		if(gameBoard.keys[gameBoard.keys.length - 1] == 39 && matrix[Math.floor(this.x + maxStep + (1/3))][Math.floor(this.y)] != 0 && matrix[Math.floor(this.x + maxStep + (1/3))][Math.floor(this.y + (1/3))] != 0 && this.x + 1/3 + maxStep * 2 < size){
			vel[0] += maxStep;
		}
		// 40 -> Down
		if(gameBoard.keys[gameBoard.keys.length - 1] == 40 && matrix[Math.floor(this.x)][Math.floor(this.y + maxStep + (1/3))] != 0 && matrix[Math.floor(this.x + (1/3))][Math.floor(this.y + maxStep + (1/3))] != 0 && this.y + 1/3 < size){
			vel[1] += maxStep;
		}
		// Change the position of the Player according to its velocity
		this.x += vel[0];
		this.y += vel[1];
	}

	/*
		update: Updates and redraws the Player
	*/
	update(){
		this.move();
		this.draw();
	}
	
}