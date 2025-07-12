
function verificar() {
 
  let cuadriculaFinal = [[]];
// inicializar cuadricula
  let rows = Math.ceil((canvasSize-squareSize*2)/squareSize);
  let columns = Math.ceil((canvasSize-squareSize*2)/squareSize);
  for (let i = 0; i < rows; i++) {
      cuadriculaFinal[i] = [];
      for (let j = 0; j < columns; j++) {
         cuadriculaFinal[i][j] = 8;
      }
   }
// posiciones pintadas   
  cuadriculaFinal[0][0] = 2;
  cuadriculaFinal[0][15] = 2;
  cuadriculaFinal[15][0] = 2;
  cuadriculaFinal[15][15] = 2;
  cuadriculaFinal[7][7] = 1;

// verifica que las dos cuadriculas sean iguales
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
         if (cuadriculaFinal[i][j] != cuadricula[i][j]){
           fill('red'); 
           print("No dibujaste correctamente!!! Vuelve a intentar");
           textSize(25); 
           text("No dibujaste correctamente!!!", 75, 195);
           text("Vuelve a intentarlo", 105, 225);
           return;
         }
      }
   }
  fill('blue'); 
  print("Dibujaste correctamente!!!");
  textSize(25); 
  text("Dibujaste correctamente!!!", 75, 195);
  return;

}


