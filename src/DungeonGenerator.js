function generateDungeon(size){
	var matrix = [];

	for (var x = 0; x < size; x++) {
		matrix[x] = [];
		for (var y = 0; y < size; y++) {
			matrix[x][y] = 0;
		}
	}
	var rooms = [];

	function valInRange(val, min, max){
		return (val >= min) && (val <= max);
	}

	for(var i = 0; i < Math.floor(size * size / 121) - 5; i++){
		rooms[i] = new Object();

		rooms[i].x = Math.floor(Math.random() * Math.floor((size - 14) / 2)) * 2 + 1 + 3;
		rooms[i].y = Math.floor(Math.random() * Math.floor((size - 14) / 2)) * 2 + 1 + 3;

		rooms[i].width = Math.floor(Math.random() * 4) * 2 + 5;
		rooms[i].height = Math.floor(Math.random() * 4) * 2 + 5;

		var isColliding = false;

		for(var t = 0; t < rooms.length - 1; t ++){
			if((valInRange(rooms[i].x, rooms[t].x, rooms[t].x + rooms[t].width) || valInRange(rooms[t].x, rooms[i].x, rooms[i].x + rooms[i].width)) && 
				(valInRange(rooms[i].y, rooms[t].y, rooms[t].y + rooms[t].height) || valInRange(rooms[t].y, rooms[i].y, rooms[i].y + rooms[i].height))){
				
				isColliding = true;
				break;
			}
			else{
				isColliding = false;
			}
		}
		if(!isColliding){
			for(var x = 0; x < rooms[i].width; x ++){
				for(var y = 0; y < rooms[i].height; y ++){
					matrix[rooms[i].x + x][rooms[i].y + y] = (i * 12) + 1;
				}
			}
		}
		else{
			i --;
		}
	}

	function drawPath(roomNo, startPos, startDir){
		var dir = startDir;
		var currPos = startPos

		for(var t = 0; t < 2; t ++){
			matrix[currPos[0]][currPos[1]] = roomNo;
			currPos[0] += -Math.sign(((dir - 1) % 2) * (dir - 3));
			currPos[1] += Math.sign((dir % 2) * (dir - 2));
		}

		while((matrix[currPos[0]][currPos[1]] == 0 || matrix[currPos[0]][currPos[1]] == roomNo)){//!(currPos[0] < 2 ||currPos[0] > size - 3) && !(currPos[1] < 2 || currPos[1] > size - 3) && (matrix[currPos[0]][currPos[1]] == 0 || matrix[currPos[0]][currPos[1]] == roomNo)){

			var rand = Math.floor(Math.random() * 10);
			var oldDir = dir;
			if(rand < 2){
				toAdd = rand * 2;
				dir = toAdd + ((dir + 1) % 2);
			}

			while((currPos[0] < 2 && dir == 0) || (currPos[0] > size - 3 && dir == 2) || (currPos[1] < 2 && dir == 1) || (currPos[1] > size - 3 && dir == 3)){
				var rand2 = Math.floor(Math.random() * 2);
				dir = oldDir;
				toAdd = rand2 * 2;
				dir = toAdd + ((dir + 1) % 2);
			}

			for(var t = 0; t < 2; t ++){
				matrix[currPos[0]][currPos[1]] = roomNo;
				currPos[0] += -Math.sign(((dir - 1) % 2) * (dir - 3));
				currPos[1] += Math.sign((dir % 2) * (dir - 2));

				if(matrix[currPos[0]][currPos[1]] != 0 && matrix[currPos[0]][currPos[1]] != roomNo){
					return;
				}

			}
		}
	}

	for(var i = 0; i < rooms.length; i ++){

		var startSide = Math.floor(Math.random() * 4);
		var dir = startSide;

		var currPos = [rooms[i].x + (Math.floor(Math.random() * ((rooms[i].width - 1) / 2)) * 2 * (startSide % 2)) + ((rooms[i].width - 1) * (startSide / 2) * ((startSide + 1) % 2)), 
						rooms[i].y + (Math.floor(Math.random() * ((rooms[i].height - 1)) / 2) * 2 * ((startSide + 1) % 2)) + ((rooms[i].height - 1) * ((startSide - 1) / 2) * (startSide % 2))];
		
		// Very important!!!
		matrix[currPos[0]][currPos[1]] = 0;

		drawPath((i * 12) + 1, currPos, dir);

		if(Math.floor(Math.random() * 100) < 60){
			i --;
		}
	}

	function placeObjects(){
		var numStaircase = Math.ceil(rooms.length / 10);
		var numChest = Math.ceil(rooms.length / 3);
		var numTrap = rooms.length * 2;
		var availableSpace = [];

		for(var i = 0; i < rooms.length; i ++){
			for(var x = rooms[i].x + 1; x < rooms[i].x + rooms[i].width - 1; x ++){
				for(var y = rooms[i].y + 1; y < rooms[i].y + rooms[i].height - 1; y ++){
					availableSpace.push([x, y]);
				}
			}
		}

		var tile = Math.floor(Math.random() * availableSpace.length);
		matrix[availableSpace[tile][0]][availableSpace[tile][1]] = 5;
		playerPos = [availableSpace[tile][0], availableSpace[tile][1]];
		availableSpace.splice(tile, 1);

		while(numStaircase + numChest + numTrap > 0 || availableSpace.length == 0){
			tile = Math.floor(Math.random() * availableSpace.length);

			if(numStaircase > 0){
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numStaircase * 12) + 2;
				numStaircase --;
			}
			else if(numChest > 0){
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numChest * 12) + 3;
				numChest --;
			}
			else{
				matrix[availableSpace[tile][0]][availableSpace[tile][1]] = (numTrap * 12) + 4;
				numTrap --;
			}
			availableSpace.splice(tile - 3, 7);
		}
	}

	placeObjects();

	return matrix;
}

function drawMap(map, gc){
	var colors = ["#000000", "#FFFFFF", "#AAAAAA", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#AAFF00", "#FFAA00", "#00FFAA"];
	for (var x = 0; x <  map.length; x++) {
		for (var y = 0; y <  map[x].length; y++) {
			map[x][y] = map[x][y] % 12;
			gc.fillStyle = colors[(map[x][y] % colors.length)];
			gc.fillRect(x * gameBoard.canvas.width / size, y * gameBoard.canvas.height / size, gameBoard.canvas.width / size, gameBoard.canvas.height / size);
		}
	}
}