let lastTime = 0
let dropInterval = 1000
let dropCounter = 0

const canvas = document.getElementById('tetris')
const canvasNext = document.getElementById('nextPiece')
const context = canvas.getContext('2d')
const contextNext = canvasNext.getContext('2d')
const grid = createMatriz(10,20);
const colors = [
	null,
	'#ffb7a1', //Coral
	'#f5d1c3', //Blush
	'#f0bc68', //Butterscotch
	'#aab8bb', //Smoke
	'#c4d7d1', //Duck egg
	'#5f9595', //Emerald Sea
	'#faeba8' //Pollito
]
const player = {
	pos:{x:0, y:0},
	matriz: null,
	next: null,
	score:0,
	level:0,
	lines:0
}

context.scale(20,20) //Tamaño piezas
contextNext.scale(20,20)

function createPiece(tipo){ //Tipos de fichas
	console.log(tipo)
	if (tipo==='T'){
		return [
			[0,0,0],
			[1,1,1],
			[0,1,0]	
		]
	}
	else if (tipo==='O'){
		return [
			[2,2],
			[2,2]
		]
	}
	else if (tipo==='L'){
		return [
			[0,3,0],
			[0,3,0],
			[0,3,3]	
		]
	}
	else if (tipo==='J'){
		return [
			[0,4,0],
			[0,4,0],
			[4,4,0]	
		]
	}
	else if (tipo==='I'){
		return [
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0]
		]
	}
	else if (tipo==='S'){
		return [
			[0,6,6],
			[6,6,0],
			[0,0,0]
		]
	}
	else if (tipo==='Z'){
		return [
			[7,7,0],
			[0,7,7],
			[0,0,0]
		]
	}
}

function createMatriz (width, height){ //Para crear las cuadriculas
	const matriz = []
	
	while (height--){
		matriz.push(new Array(width).fill(0))
	}
	
	return matriz
}

function collide(grid, player){ //Evitar que la pieza se salga de pantalla
	const matriz = player.matriz
	const offset = player.pos
	
	for(let y=0; y<matriz.length; ++y){
		for (let x=0; x<matriz[y].length; ++x){
			if (matriz [y][x] !==0 && (grid[y + offset.y] && grid[y + offset.y][x + offset.x])!==0){ //Comprueba si hay pieza y los límites
				return true
			}
		}
	}
}

function merge(grid, player){ //Nueva pieza cuando choque
	player.matriz.forEach((row, y) =>{
		row.forEach((value, x) =>{
			if (value !==0){
				grid[y + player.pos.y][x + player.pos.x]=value
			}
		})
	})
}

function drawMatriz(matriz, offset) {
	matriz.forEach((row, y) =>{
		row.forEach((value, x)=>{
			if (value!==0){
				context.fillStyle=colors[value] //Cambio de color según pieza
				context.fillRect(x + offset.x, y + offset.y, 1, 1)//Buscando esta posicion en el rectangulo
			}
		})
	})
}

function drawMatrizNext(matriz, offset){ //Dibujamos siguiente pieza
	contextNext.fillStyle = '#fff'	
	contextNext.fillRect(0,0,canvasNext.width, canvasNext.height)
	
	matriz.forEach((row, y) =>{
		row.forEach((value, x)=>{
			if (value!==0){
				contextNext.fillStyle=colors[value] //Cambio de color según pieza
				contextNext.fillRect(x + offset.x, y + offset.y, 1, 1)//Buscando esta posicion en el rectangulo
			}
		})
	})
	
}

function draw(){//Dibujar tablero
	context.fillStyle = '#fff'
	context.fillRect(0,0,canvas.width,canvas.height) 
	drawMatriz(grid, {x:0, y:0}) //Redibujar
	drawMatriz(player.matriz, player.pos) //Dibujar pieza actual
	drawMatrizNext(player.next, {x:1,y:1})
}

function gridSweep(){ //Borrando filas completas
	let rowCount = 1;
	outer: for (let y = grid.length - 1; y>0 ; --y){
		for (let x = 0; x<grid[y].length;++x){
			if(grid[y][x] ===0){
				continue outer
			}	
		}
		const row = grid.splice(y, 1)[0].fill(0)
		grid.unshift(row)
		++y
		
		player.score += rowCount*10
		player.lines += rowCount
		if (player.lines%3===0) player.level++
	}
	
}

function update(time = 0){
	const deltaTime = time - lastTime
	lastTime = time //Velocidad piezas
	dropCounter += deltaTime
	if(dropCounter>dropInterval){
		playerDrop();
	}
	draw()
	requestAnimationFrame(update) //
}

function playerDrop(){ //Bajar 
	player.pos.y++ 
	if (collide(grid, player)){
		player.pos.y--
		merge(grid, player)
		playerReset()
		gridSweep()
		updateScore()
	}
	dropCounter=0
}

function playerMove(direction){ //Movimiento lateral
	player.pos.x += direction
	if(collide(grid, player)){ //Si choca con los laterales
	   player.pos.x -= direction
	}
}

function playerRotate(){ //Rotar pieza
	const pos = player.pos.x
	let offset = 1
	rotate(player.matriz)
	while (collide(grid, player)){ //Evitar que piezas se salgan del canvas al rotar
		player.pos.x += offset
		offset = -(offset + (offset > 0 ? 1 : -1))
		if (offset > player.matriz[0].length){
			rotate(player.matriz)
			player.pos.x = pos
			return
		}
	}
}

function rotate(matriz){ //Rotar matriz
	for (let y= 0; y<matriz.length;++y){
		for (let x=0; x<y; ++x){
			[matriz[x][y],matriz[y][x]] = [matriz[y][x],matriz[x][y]] //Matriz de sustitucion
		}
	}
	
	matriz.forEach(row => row.reverse())
}

function playerReset(){ //Resetear posicion pieza
	const pieces ='ILJOTSZ'
	dropInterval = 1000 - (player.level*100)
	
	if (player.next===null){
		player.matriz= createPiece(pieces[pieces.length * Math.random() | 0]) //Crear nueva pieza
	}
	else{
		player.matriz=player.next
	}
	player.next = createPiece(pieces[pieces.length * Math.random() | 0]) //Crea la siguiente
	player.pos.x=(grid[0].length/2 | 0) - (player.matriz[0].length/2 | 0)
	player.pos.y=0
	if(collide(grid, player)){
		grid.forEach(row => row.fill(0))
		player.score=0
		player.level=0
		player.lines=0
	}
}

function updateScore(){
	document.getElementById("score").innerHTML = player.score
	document.getElementById("lines").innerHTML = player.lines
	document.getElementById("level").innerHTML = player.level
}

document.addEventListener('keydown', event =>{
	if (event.keyCode === 40){ //Si pulsamos flecha abajo
		playerDrop();
	}
	else if (event.keyCode === 37){ //Si pulsamos flecha izquierda
		playerMove(-1)
	}
	else if (event.keyCode === 39){ //Si pulsamos flecha derecha
		playerMove(1)
	}
	else if (event.keyCode === 32){ //Si pulsamos espacio
		playerRotate()
	}
	
})

playerReset()
update()
updateScore()
