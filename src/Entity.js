class Entity {
	
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	draw(){
		gameBoard.gc.fillStyle = this.color;
		gameBoard.gc.fillRect(this.x * gameBoard.canvas.width / size, this.y * gameBoard.canvas.height / size, gameBoard.canvas.width / size / 3, gameBoard.canvas.height / size / 3);
	}

}

class Monster extends Entity {
	
}

class Player extends Entity {

	constructor(x, y){
		super(x, y);
		this.color = "#4A4AFF";
	}

	move(){
		var maxStep = 0.05
		var vel = [0, 0];
		console.log(gameBoard.canvas.height / size / 3);
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
		this.x += vel[0];
		this.y += vel[1];
	}

	update(){
		this.move();
		this.draw();
		console.log(this.x, this.y);
	}
	
}