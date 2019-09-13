var colors = ["#000000", "#FFFFFF", "#AAAAAA", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#AAFF00", "#FFAA00", "#00FFAA"]; // Colors for tiles

/*
	generateDungeon: Generates dungeon at the given size

	size: the width and height of the dungeon
*/
function generateDungeon(size){
	var matrix = [];

	for (var x = 0; x < size; x++) { // Fill the entire area with walls
		matrix[x] = [];
		for (var y = 0; y < size; y++) {
			matrix[x][y] = 0;
		}
	}

	var rooms = []; // The list of the rooms

	/*
		valInRange: Checks if a value is inside a given range

		val: value to be checked
		min: Minimum value in  the range
		max: Maximum value in the range
	*/
	function valInRange(val, min, max){
		return (val >= min) && (val <= max);
	}

	var numRooms = Math.floor(size * size / 121) - 5; // Number of rooms in the dungeon, based on total area and area of a max-sized room

	for(var i = 0; i < numRooms; i++){

		rooms[i] = new Object(); //Create a new room object

		rooms[i].x = Math.floor(Math.random() * Math.floor((size - 14) / 2)) * 2 + 1 + 3;
		rooms[i].y = Math.floor(Math.random() * Math.floor((size - 14) / 2)) * 2 + 1 + 3; // Randomly choose a tile to be the top left corner of the room

		rooms[i].width = Math.floor(Math.random() * 4) * 2 + 5;
		rooms[i].height = Math.floor(Math.random() * 4) * 2 + 5; // Randomly choose the width and height of the room. min: 5, max: 11 

		var isColliding = false;

		for(var t = 0; t < rooms.length - 1; t ++){ // Compare to other rooms to check if the new room is colliding with any previous rooms

			if((valInRange(rooms[i].x, rooms[t].x, rooms[t].x + rooms[t].width) || valInRange(rooms[t].x, rooms[i].x, rooms[i].x + rooms[i].width)) && 
				(valInRange(rooms[i].y, rooms[t].y, rooms[t].y + rooms[t].height) || valInRange(rooms[t].y, rooms[i].y, rooms[i].y + rooms[i].height))){
				
				isColliding = true;
				break;
			}
			else{
				isColliding = false;
			}
		}

		if(!isColliding){ // If the new room is not colliding, add its area as blank space to the dungeon matrix

			for(var x = 0; x < rooms[i].width; x ++){
				for(var y = 0; y < rooms[i].height; y ++){
					matrix[rooms[i].x + x][rooms[i].y + y] = (i * 12) + 1; // Set the tiles in the room to a different value for each room
				}
			}
		}
		else{ // If the new room is colliding, discard and regenerate the room

			i --;
		}
	}

	/*
		drawPath: Draws a new corridor starting from a given room

		roomNo: The room the corridor starts from
		startPos: The tile the corridor starts from
		startDir: The direction the corridor initially goes at

		The generated corridor continues until hitting another room. A corridor can turn only at an even-numbered tile
	*/
	function drawPath(roomNo, startPos, startDir){

		var dir = startDir; // Set the direction to its initial state. dir - 0: left, 1: up, 2: right, 3: down
		var currPos = startPos // Set the current position to its initial state

		for(var t = 0; t < 2; t ++){ // Go two tiles in the initial direction
			matrix[currPos[0]][currPos[1]] = roomNo;
			currPos[0] += -Math.sign(((dir - 1) % 2) * (dir - 3));
			currPos[1] += Math.sign((dir % 2) * (dir - 2));
		}

		while((matrix[currPos[0]][currPos[1]] == 0 || matrix[currPos[0]][currPos[1]] == roomNo)){ // Repeats until the corridor reaches another room

			var rand = Math.floor(Math.random() * 10);
			var oldDir = dir;
			if(rand < 2){ // The corridor has a 1 in 5 chance of turning
				toAdd = rand * 2;
				dir = toAdd + ((dir + 1) % 2); // Calculate whether the corridor will turn right or left
			}

			while((currPos[0] < 2 && dir == 0) || (currPos[0] > size - 3 && dir == 2) || (currPos[1] < 2 && dir == 1) || (currPos[1] > size - 3 && dir == 3)){ 
			// Make the corridor avoid the edge of the dungeon so it doesn't go out of bounds
				var rand2 = Math.floor(Math.random() * 2);
				dir = oldDir;
				toAdd = rand2 * 2;
				dir = toAdd + ((dir + 1) % 2);
			}

			for(var t = 0; t < 2; t ++){ // Go twice in the new direction
				matrix[currPos[0]][currPos[1]] = roomNo;
				currPos[0] += -Math.sign(((dir - 1) % 2) * (dir - 3));
				currPos[1] += Math.sign((dir % 2) * (dir - 2));

				if(matrix[currPos[0]][currPos[1]] != 0 && matrix[currPos[0]][currPos[1]] != roomNo){ // Break out of the while loop if the corridor hits a new room
					return;
				}

			}
		}
	}

	for(var i = 0; i < rooms.length; i ++){ // Generate at least one corridor for each room

		var startSide = Math.floor(Math.random() * 4);
		var dir = startSide; // Pick a random side of the room to start the corridor from

		var currPos = [rooms[i].x + (Math.floor(Math.random() * ((rooms[i].width - 1) / 2)) * 2 * (startSide % 2)) + ((rooms[i].width - 1) * (startSide / 2) * ((startSide + 1) % 2)), 
						rooms[i].y + (Math.floor(Math.random() * ((rooms[i].height - 1)) / 2) * 2 * ((startSide + 1) % 2)) + ((rooms[i].height - 1) * ((startSide - 1) / 2) * (startSide % 2))];
		// Set the starting position of the corridor a random tile on the chosen side
		
		// Very important!!! Change the starting position to a wall
		matrix[currPos[0]][currPos[1]] = 0;

		drawPath((i * 12) + 1, currPos, dir); // Generate a corridor with the calculated arguments

		if(Math.floor(Math.random() * 100) < 60){ // 3 in 5 chace to draw a new corridor starting from the same room
			i --;
		}
	}

	/*
		placeObjects: Generate game objects such as traps, chests, the player's starting position and stairs
	*/
	function placeObjects(){
		var numStaircase = Math.ceil(rooms.length / 10);
		var numChest = Math.ceil(rooms.length / 3);
		var numTrap = rooms.length * 2; // Calculate the number of objects for the given number of rooms. 1 staircase per 10 rooms, 1 chest per 3 rooms, 2 traps per room
		var availableSpace = []; // Array of all the spaces an object can go on; tiles inside rooms that aren't on the sides

		for(var i = 0; i < rooms.length; i ++){ // Populate the availableSpace array
			for(var x = rooms[i].x + 1; x < rooms[i].x + rooms[i].width - 1; x ++){
				for(var y = rooms[i].y + 1; y < rooms[i].y + rooms[i].height - 1; y ++){
					availableSpace.push([x, y]);
				}
			}
		}

		var tile = Math.floor(Math.random() * availableSpace.length);
		matrix[availableSpace[tile][0]][availableSpace[tile][1]] = 5;
		playerPos = [availableSpace[tile][0], availableSpace[tile][1]];
		availableSpace.splice(tile, 1); // Choose a random availableSpace and place the player starting position there. There can only be one

		while(numStaircase + numChest + numTrap > 0 || availableSpace.length == 0){ // Place all other objects
			tile = Math.floor(Math.random() * availableSpace.length); // Choose a random tile

			if(numStaircase > 0){ // PLace the stairs first
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numStaircase * 12) + 2;
				numStaircase --;
			}
			else if(numChest > 0){ // Place the chests
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numChest * 12) + 3;
				numChest --;
			}
			else{ // Place the traps
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numTrap * 12) + 4;
				numTrap --;
			}
			availableSpace.splice(tile - 3, 7);
		}
	}

	placeObjects(); // Place all the objects

	return matrix; // Return the generated dungeon
}

/*
	drawMap: Draws the entire dungeon on the canvas

	map: Matrix of the dungeon
	gc: Canvas graphic context
*/
function drawMap(map, gc){
	for (var x = 0; x <  map.length; x++) {
		for (var y = 0; y <  map[x].length; y++) {
			map[x][y] = map[x][y] % 12;
			gc.fillStyle = colors[(map[x][y] % colors.length)];
			gc.fillRect(x * gameBoard.canvas.width / size, y * gameBoard.canvas.height / size, gameBoard.canvas.width / size, gameBoard.canvas.height / size);
		}
	}
}