var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// altura y ancho, snake x & y, y el x & y de la manzana,todos tienen q ser multiplos de los valores de la grilla
// (P.ej 16 * 25 = 400)
var grid = 16;
var count = 0;

var snake = {
  x: 160,
  y: 160,

  // velocity, se mueve una grilla por frame
  dx: grid,
  dy: 0,

  // trakear las grillas q ocupa la seprientemasdadsjgjj
  cells: [],

  // largo, aumenta con manzanas
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// Numeros enteros random en un rango especifico
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  // Bajar fps a 15 en lugar 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // mover snake en base a velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrapear snake horizontalmente en los bordes
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrapear snake verticalmente en los bordes
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Mantener trackeado la posicion. La cabeza siempre esta al principio del array
  snake.cells.unshift({x: snake.x, y: snake.y});

  // Sacar partes con el movimiento
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // manzana
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // dibujar snake un cuadrado a la vez
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {

    // dibujar 1px mas chico q el grid hace que tenga un efecto de separacion
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    // snake come manzana
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      
      // canvas = 400x400 || 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // chequear colision con cachos anteriores
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake ocupa mismo espacio q otro cacho. reset
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        
      }
    }
  });
}

// Eventos en teclado
document.addEventListener('keydown', function(e) {
  // evitar q la serpiente haga backtracking sobre si chqueando
  // si no se mueve en el mismo axis (derecha yendo a derecha 
  // no funca, derecha yendo a izquierda
  // no deberia dejarte autocomerte)

  // izquierda
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // arriba
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // derecha
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // abajo
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// start
requestAnimationFrame(loop);