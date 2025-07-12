
// inicializaciones por defecto
let   squareSize = 25;
const canvasSize = 400+squareSize*2; 

let posInicX = 1;
let posInicY = 1;
let colorInic = 1;

let posX1 = posInicY;
let posY = posInicY;

let colorActual = colorInic;
let velocidadEjecucion = 25;

let historial = [];
let indice = 0;
let cuadricula = [[]];

function inicializarCuadriculaDefecto(){
  let rows = Math.ceil((canvasSize-squareSize*2)/squareSize);
  let columns = Math.ceil((canvasSize-squareSize*2)/squareSize);
  for (let i = 0; i < rows; i++) {
      cuadricula[i] = [];
      for (let j = 0; j < columns; j++) {
         cuadricula[i][j] = 8;
      }
   }
}

function setup() {
  createCanvas(500, 500);
 // ctx = canvas.getContext("2d");
  background("white");
  
  inicializarCuadriculaDefecto();
  inicializar();

  strokeWeight(squareSize/canvasSize*7.5);
  frameRate(velocidadEjecucion);
  posX1 = ((posInicX+2)*squareSize);
  posY = ((posInicY+2)*squareSize);
  colorActual = colorInic;
  dibujarCuadricula();
  posicionarCursor();
  
  posX1 = posInicY;
  posY = posInicY;
  colorActual = colorInic;
  dibujar();
  
	inicializar();
  posX1 = ((posInicX+2)*squareSize);
  posY = ((posInicY+2)*squareSize);
  colorActual = colorInic;
 
}

function draw() {
  ejecutarHistorial();
}

function ejecutarHistorial() {
  f = historial[indice];

  if (indice < historial.length) {
    if (typeof f == "function") f();
    indice++;
//		dibujarCuadricula()
  } else {
	//	dibujarCuadricula()
    posicionarCursor();
    verificar();
    noLoop();
  }
}

// Imprime la cuadricula
function dibujarCuadricula() {
 
  let rows = Math.ceil((canvasSize-squareSize*2)/squareSize);
  let columns = Math.ceil((canvasSize-squareSize*2)/squareSize);
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        fill(retornarColor(cuadricula[i][j]));
        rect((i+2)*squareSize-squareSize, (j+2)*squareSize-squareSize, squareSize, squareSize);
      }
   }
 
  
  
}

function posicionarCursor() {
   if (posX1 <= squareSize || posX1 > canvasSize-squareSize || posY <= squareSize || posY > canvasSize-squareSize) {
    //noLoop();
    fill('red'); 
   // print("Te saliste de la cuadricula!!!");
    textSize(20); 
//    text("Te saliste de la cuadricula!!!", 75, 195); 
    indice = historial.lenght + 2;
   } else {
     // noStroke();
     fill("yellow");
  }
    rect(posX1 - (squareSize/3+squareSize/3) , posY - (squareSize/3+squareSize/3), squareSize/3);
//  circle(posX1 - squareSize/2 , posY - squareSize/2, squareSize-squareSize/5);
}

function borrarCursor() {
  fill(retornarColor(cuadricula[(posX1/squareSize)-2][(posY/squareSize)-2]));
	//print(get(posX1 - 1.5, posY - 1.5));
  rect(posX1 - squareSize, posY - squareSize, squareSize, squareSize);
}

function pintar() {
  cuadricula[posX1][posY]=colorActual;
  historial.push(pintar_);
}

function pintar_() {
  fill(retornarColor(colorActual));
	cuadricula[(posX1/squareSize)-2][(posY/squareSize)-2]=colorActual;
  rect(posX1 - squareSize, posY - squareSize, squareSize, squareSize);
  posicionarCursor();
}

function derecha() {
  if (posX1<Math.ceil((canvasSize-squareSize*2)/squareSize)-1) posX1 += 1; 
  historial.push(derecha_);
}

function derecha_() {
  borrarCursor();
  posX1 += squareSize;
  posicionarCursor();
}

function izquierda() {
  if (posX1>0)posX1 -= 1;
  historial.push(izquierda_);
}

function izquierda_() {
  borrarCursor();
  posX1 -= squareSize;
  posicionarCursor();
}

function abajo() {
  if (posY<Math.ceil((canvasSize-squareSize*2)/squareSize)-1) posY += 1;
  historial.push(abajo_);
}

function abajo_() {
  borrarCursor();
  posY += squareSize;
  posicionarCursor();
}

function arriba() {
  if (posY>0) posY -= 1;
  historial.push(arriba_);
}

function arriba_() {
  borrarCursor();
  posY -= squareSize;
  posicionarCursor();
}

function seleccionarColor(c) {
  switch (c) {
    case "black":
      colorActual = 1;
      historial.push(negro_);
      break;
    case "red":
      colorActual = 2;
      historial.push(rojo_);
      break;
    case "blue":
      colorActual = 3;
      historial.push(azul_);
      break;
    case "yellow":
      colorActual = 4;
      historial.push(amarillo_);
      break;
    case "green":
      colorActual = 5;
      historial.push(verde_);
      break;
    case "orange":
      colorActual = 6;
      historial.push(naranja_);
      break;
    case "violet":
      colorActual = 7;
      historial.push(violeta_);
      break;
    case "white":
      colorActual = 8;
      historial.push(blanco_);
      break;
  }
}

function negro_() {
  colorActual = 1;
}

function rojo_() {
  colorActual = 2;
}

function azul_() {
  colorActual = 3;
}

function amarillo_() {
  colorActual = 4;
}

function verde_() {
  colorActual = 5;
}

function naranja_() {
  colorActual = 6;
}

function violeta_() {
  colorActual = 7;
}

function blanco_() {
  colorActual = 8;
}

function siguienteColor() {
  siguienteColor_();
  historial.push(siguienteColor_);
}

function siguienteColor_() {
  if (colorActual < 8) {
    colorActual++;
  } else {
    colorActual = 1;
  }
}

function retornarColor(c) {
  switch (c) {
    case 1:
      return "black";
    case 2:
      return "red";
    case 3:
      return "blue";
    case 4:
      return "yellow";
    case 5:
      return "green";
    case 6:
      return "orange";
    case 7:
      return "violet";
    case 8:
      return "white";
  }
}

// sensores y variables

//para estas dos hay que hacer otra cosa (por ejemplo tener matriz con colores pintados)
function colorCelda() {
  return retornarColor(cuadricula[posX1][posY]);
}

function estaPintado() {
  return (retornarColor(cuadricula[posX1][posY])!="white");
}


function posicionX() {
  return posX1;
}

function posicionY() {
  return posY;
}

function colorActivo() {
  return retornarColor(colorActual);
}



// se pueden eliminar

function* range(from, to, step = 1) {
  let i = from;
  while (i < to) {
    yield i;
    i += step;
  }
}

function times(n) {
  return range(0, n);
}

//inicializaciones personalizadas

function inicializar1() {
  
}

// ejemplo de inicializacion
function inicializar() {
// inicializar variables de entorno
  squareSize = 25;
  posInicX = 7;
  posInicY = 7;
  colorInic = 1;
  velocidadEjecucion = 50;

//inicializa la cuadricula en blanco
  inicializarCuadriculaDefecto();

//inicializar 
  cuadricula[0][0] = 2;
  cuadricula[0][15] = 2;
  cuadricula[15][0] = 2;
  cuadricula[15][15] = 2;

}


function verificar() {
}  

