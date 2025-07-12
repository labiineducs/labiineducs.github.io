//inicializaciones personalizadas

function inicializar() {

// inicializar variables de entorno
  squareSize = 20;
  posInicX = 7;
  posInicY = 7;
  colorInic = 1;
  velocidadEjecucion = 25;

//inicializa la cuadricula en blanco
  inicializarCuadriculaDefecto();

//inicializar posiciones especificas
  cuadricula[0][0] = 2;
  cuadricula[0][15] = 2;
  cuadricula[15][0] = 2;
  cuadricula[15][15] = 2;
  
}


