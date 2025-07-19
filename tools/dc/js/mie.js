if (typeof window.mie == 'undefined') window.mie = [];
else window.mie = Object.assign([], window.mie);
mie.lang ??= {
	js: {
		play: function (code) {}
	}
};
mie.bases = {};

class MiniEditor {
	
	inicCode;
    verifCode;
    firstCode;
	
	constructor(script, inicCode, verifCode) {             
		this.id = mie.length;
		this.lang = script.type.slice(4) || 'js';

		let code = script.innerHTML.trim();            
        this.firstCode = code;
        this.inicCode = inicCode;
        this.verifCode = verifCode;
 
		let attrs = script.getAttributeNames();
		let baseIdx = attrs.findIndex((v) => v.startsWith('base-'));
		if (baseIdx != -1) {
			let baseKey = attrs[baseIdx].split('-')[1];
			mie.bases[baseKey] = code.slice(0, code.lastIndexOf('}'));
		}
		let props = {};
		for (let prop of attrs) {
			props[prop] = script.getAttribute(prop) || true;
		}

		let lines = props.lines || 0;
		if (!lines) {
			for (let c of code) {
				if (c == '\n') lines++;
			}
			lines++;
		}
		
		let minLines = 1;
		if (props['min-lines']) {
		   minLines = props['min-lines'];
        }

		this.base = props.base;

		let mini = document.createElement('div');
		mini.className = 'mie ' + this.lang;
		if (props.horiz) mini.className += ' horiz';
		else mini.className += ' vert';
		mini.id = script.id + '-mie';
		mini.style = script.style.cssText;
		if (!script.style.cssText.includes('width') && props.width) {
			mini.style.width = props.width;
		}
		script.after(mini);
		this.elem = mini;

		let title = document.createElement('div');
		title.className = 'mie-title';
		let logo = document.createElement('div');
		logo.className = 'mie-logo';
		title.append(logo);
		let span = document.createElement('span');
		let name;
		if (props.id) name = props.id.replace(/-/g, ' ');
		else name = props.name || props.title || 'sketch';
		span.innerHTML += name;
		title.append(span);
		mini.append(title);

		if (props['editor-btn']) {
			let editBtn = document.createElement('button');
			editBtn.className = 'mie-edit';
			editBtn.innerHTML = '{ }';
			editBtn.onclick = () => {
				this.toggleEditor();
			};
			title.append(editBtn);
		}

		let resetBtn = document.createElement('button');
		resetBtn.className = 'mie-reset';
		resetBtn.title = 'Reiniciar';
		resetBtn.onclick = () => this.reset();
		title.append(resetBtn);

		let playBtn = document.createElement('button');
		playBtn.className = 'mie-play';
		playBtn.title = 'Dibujar';
		playBtn.onclick = () => this.play();
		title.append(playBtn);

		let main = document.createElement('div');
		main.className = 'mie-main';
		mini.append(main);

		let preview = document.createElement('div');
		preview.id = 'mie-preview-' + this.id;
		preview.className = 'mie-preview';
		main.append(preview);
		this.previewElem = preview;

		if (!mie.editorDisabled) {
			let ed = document.createElement('div');
			ed.id = 'mie-editor-' + this.id;
			ed.className = 'mie-editor';
			//ed.innerHTML = code;
			// cambio esto para que se guarde el codigo js sin cambios
			ed.textContent = code;
			main.append(ed);
			this.editorElem = ed;

			let editor = ace.edit('mie-editor-' + this.id);
			editor.setOptions({
				mode: 'ace/mode/javascript',
				minLines: minLines,
				maxLines: lines,
				fontSize: '14px',
				showFoldWidgets: true,
				showLineNumbers: true,
				tabSize: 2,
				highlightGutterLine: true,
				showGutter: true,
				enableBasicAutocompletion: [
					{
						getCompletions: (editor, session, pos, prefix, callback) => {
							callback(null, mie.lang[this.lang].completions || []);
						}
					}
				],
				enableLiveAutocompletion: true
			});
			editor.session.on('changeMode', function (e, session) {
				if ('ace/mode/javascript' === session.getMode().$id) {
					if (!!session.$worker) {
						session.$worker.send('setOptions', [
							{
								esversion: 11,
								esnext: false
							}
						]);
					}
				}
			});
			editor.session.setMode('ace/mode/javascript');

			editor.setTheme('ace/theme/xcode');
			editor.session.setUseWrapMode(false);
			editor.renderer.setShowPrintMargin(false);

			this.editor = editor;
			this.sketch = null;

			if (props['hide-editor']) {
				this.hideEditor();
			}
		} else {
			this.code = code;
		}

		if (props.hide || props.hidden) {
			mini.style.display = 'none';
			return;
		}

        if (!props['autoplay']) {
            this.code = 'function dibujar(){ }';  
        }
		this.play();

		/* auto reload after the specified amount of seconds */
		if (props.reload) {
			(async () => {
				while (props.reload) {
					await new Promise((r) => setTimeout(r, props.reload * 1000));
					this.play();
				}
			})();
		}
	}

	play() {
		mie.lang[this.lang].remove.call(this);
		let code = this.code || this.editor.getValue().trim();
		this.code = null; 
		this.player = mie.lang[this.lang].play.call(this, code);   
	}

	reset() {
		mie.lang[this.lang].remove.call(this);
		let code = 'function dibujar(){ }';
		this.player = mie.lang[this.lang].play.call(this, code);   
	}

	toggleEditor() {
		if (this.editorElem.style.display == 'none') {
			this.showEditor();
		} else {
			this.hideEditor();
		}
	}

	showEditor() {
		let ed = this.editorElem;
		let pr = this.previewElem;
		ed.style.display = 'block';
		pr.style.width = 'unset';
		this.editor.focus();
	}

	hideEditor() {
		let ed = this.editorElem;
		let pr = this.previewElem;
		pr.style.width = '100%';
		ed.style.display = 'none';
	}

	remove() {
		mie.lang[this.lang].remove.call(this);
		this.editor.destroy();
		this.editor.container.remove();
		this.elem.remove();
	}
}




mie.loadMinis = (elem) => {
	elem = elem || document;
	let scripts = [...elem.getElementsByTagName('script')];
	let scriptsAux = scripts;
	
	let inicCode = 'function inicializar(){return false;}';
    let verifCode = 'function verificar(){}';
	
	
	for (let script of scripts) {
		if (script.type.includes('mie')) {
		
		  if (script.getAttribute('data-inic-dc')){
			for (let scriptAux of scriptsAux) {
	     	  if ((scriptAux.type.includes('dc/inic'))&&(script.getAttribute('data-inic-dc')==scriptAux.getAttribute('id'))) {
			       inicCode = 'function inicializar(){'+scriptAux.innerHTML.trim()+'return true;}';
			  }  		    
		    }	
		  }
		  if (script.getAttribute('data-verif-dc')){
			for (let scriptAux of scriptsAux) {
	     	  if ((scriptAux.type.includes('dc/verif'))&&(script.getAttribute('data-verif-dc')==scriptAux.getAttribute('id'))) {
			       verifCode = 'function verificar(){'+scriptAux.innerHTML.trim()+'}';
			  }  		    
		    }	
		  }
		  mie.push(new MiniEditor(script, inicCode, verifCode)); // deberia pasar los tres string como parametros para tener varias instancias en la misma pagina de inic y verif
		}
	}
};

mie.load = () => {
	if (typeof window.ace == 'undefined') {
		console.log('mie will run without the ace editor, which was not loaded.');
		mie.editorDisabled = true;
	}
	if (mie.autoLoad !== false) mie.loadMinis();
	if (mie.ready) mie.ready();
};

mie.lang.p5 = {};

mie.lang.p5.functionNames = [
	'preload',
	'setup',
	'update',
	'draw',
	'drawFrame',
	'postProcess',
	'keyPressed',
	'keyReleased',
	'keyTyped',
	'mouseMoved',
	'mouseDragged',
	'mousePressed',
	'mouseReleased',
	'mouseClicked',
	'touchStarted',
	'touchMoved',
	'touchEnded',
	'windowResized'
];

mie.lang.p5.play = function (codeScript) {   

	if (!codeScript.includes('function dibujar')) {
		codeScript = 'function dibujar(){' + codeScript + "\n" + '}';
	}
	if (!this.firstCode.includes('function dibujar')) {
		this.firstCode = 'function dibujar(){' + this.firstCode + "\n" + '}';
	}
	let code = "";
    let code1 = '"use strict";'+codeMaqDib + this.inicCode + 'function verificar(){}' + 'function dibujar(){ }';	    
    
    if ((codeScript==this.firstCode) || (codeScript=='function dibujar(){ }')) code = codeMaqDib + this.inicCode + 'function verificar(){}' + codeScript;
    else code = '"use strict";'+codeScript+codeMaqDib + this.inicCode + this.verifCode; 	
	function s(p) {
		with (p) eval(code);
	}
	function s1(p) {
		with (p) eval(code1);
	}
	this.previewElem.innerHTML = ''; // avoid duplicate canvases

    let p5Obj = null;

	 try{
		p5Obj = new p5(s, this.previewElem);
	  }catch (e){
	    this.previewElem.innerHTML = ''; 
	    alertify.error('Hay un error en el programa');
	    console.log("Error en el programa. No se pudo ejecutar correctamente!");
	    p5Obj = new p5(s1, this.previewElem);
	  } finally {
        return p5Obj;
  }
      
      
//	return new p5(s, this.previewElem);
};

mie.lang.p5.remove = function () {
	if (this.player?.remove) this.player.remove();
};

mie.lang.q5 = mie.lang.p5;

if (mie.autoLoad !== false) mie.load();

{
	let style = document.createElement('style');
	style.innerHTML = `
.mie {
	display: flex;
	flex-direction: column;
	border-radius: 10px;
	font-family: sans-serif;
	box-sizing: border-box;
	background-color: #fff;
	padding: 6px;
    background: linear-gradient(217deg, #fffffa, #fff0),
	linear-gradient(127deg, #faffff, #fff0),
	linear-gradient(336deg, #fff5ff, #fff0);
	box-shadow: 2px 2px 5px #0002;
}

.mie * {
	outline: none;
}

.mie-main {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.mie.horiz .mie-main {
	flex-direction: row;
}

.mie-title {
	padding: 4px;
	padding-bottom: 6px;
	text-align: left;
	border-bottom: 2px solid #ccc;
}

.mie-title span {
	padding-left: 8px;
	font-weight: bold;
}

.mie.p5 .mie-logo {
	width: 16px;
	background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6UlEQVRYhe2XQRKDIAxFaac7j9dzejzXdJyOFuH/JAQs7YxvSUx4SFS8xRhjGMjDNfX0LIZ2lrkYkrgLMR+SHKC/QCWXwCVwFKjsYDfJPOV7IJeofK4pZHEfAXLBYbxWhtXcYssM7oCEVNA6ccbwJnx/jL7VfIAfeQx7dboDfB44e0uSBWOBM2TIXbafiDwiZNKUP/kYebfBkKcLtPaAki8LKMk9JGQBC43vEC4gWO9sk1skSD0sQC5uBtTFAhbyVTu3AgtoxVicjQtgAakYG7fEQYwLkAQXax1SS++BNNEqVJEz9vc8hPACpq5Nzed8pCUAAAAASUVORK5CYII=');
}

.mie.q5 .mie-logo {
	width: 16px;
	background-image: url("https://q5js.org/q5js_logo.webp");
}

.mie-preview {
	display: flex;
	justify-content: center;
}

.mie.vert .mie-preview {
	width: 100%;
}


.mie-editor {
	width: 100%;
	font-size: 14px;
	
}


.mie.vert .mie-editor {
	border-top: 2px solid #ccc;
	border-bottom-left-radius: 2px;
	border-bottom-right-radius: 2px;
}

.mie.horiz .mie-editor {
	border-left: 2px solid #ccc;
	border-bottom-right-radius: 2px;
}

.mie-edit,
.mie-play,
.mie-reset {
	float: right;
	border: 0;
	background: transparent;
	cursor: pointer;
}

.mie-play:active {
	animation: spin 0.2s linear infinite;
}

.mie-reset:active {
	animation: spin 0.2s linear infinite;
}

@keyframes spin {
	100% {
		transform: rotate(360deg);
	}
}

.mie-play:hover {
	border-color: transparent transparent transparent #404040;
}

.mie-reset:hover {
	border-color: transparent transparent transparent #404040;
}

.mie-edit {
	color: #202020;
}

.mie-edit:hover {
	color: #404040;
}



.ace_gutter,
.ace_gutter-layer,
.ace_gutter-cell {
	width: 45px !important;
}

.ace_gutter-cell.ace_error {
	background-color: #ff0000 !important;
}

.ace_scroller {
	left: 45px !important;
}

.ace_active-line {
	background-color: unset !important;
}

.ace_hidden-cursors {
	opacity: 0;
}

@media screen and (max-width: 600px) {
	.mie.horiz .mie-main {
		flex-direction: column;
	}

	.mie.horiz .mie-editor {
		border-left: 0 solid #ccc;
		border-top: 2px solid #ccc;		
	}
}

.mie-logo {
	width: 16px;
	height: 16px;
	margin-top: 1px;
	border-radius: 2px;
	float: left;
	background-size: cover;
	background-image: url("data:image/png;base64,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");
}

.mie-play {
	margin-top: 1px;
	width: 16px;
  height: 16px;
  background-size: contain;
	background-repeat: no-repeat;

	background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABACAMAAAB7nkqoAAAAM1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADbQS4qAAAAEHRSTlMAMGDgQKAQgMDwIFDQcJCwmc09OQAAAAlwSFlzAAABlAAAAZQB3gpsbAAAAilJREFUWIXtmMmWhDAIRTUOSTSW/v/X9mkzQR5E6/S2365UboEhQBx0jcfi/BU1Obuv+KT11zUdcLloXzKgKhwbf2iJtxawvrVZREQ5Qx6b89UZCMOwLmBMNFVOee4DjEH1o/gzpiddudIyxgBWKPtAMdoL4Qpbj9J9I1R+1CmvIdfljUZBSPjYeZ5nY88J7hmZ0kIWlq3b0YKMRLHcY4sJPzuO8UjZuR/IuDkYGKNsdIm9lNJRH0BQCnU2yI4kn4WMyhQajxJN1oiYTCHxnl2GiEkU8zIcBeNaV/wGRvWVnC6qXSnXurKDbRGmNqe45rcoA8bcaqu/O/F0Cs9NKfVTq8O3wFal6DnbpdzJsZauA6ZEJxgXxY6Ut3NngajHraaUYnGPGbBk0mpyyD1hGK1tGx9qPaygh//+178kycnU3Q1xS1hrSnmVWsP1XIDXu7T5lP36JgtgSZXqY6rTDqyLekGVBhZnOrCtsmBbVUq5+wOllupHSmfP165yPlC8vkika+x9ih/BuKguSSrVrXFqou7TKX1k7LIypdeSkkiK5aghkkcMHRnyMgLlCUMhpYEB5GEHsX4ydyjXpHdaNh3WEw0g4n3ZHT6pEp/rNYZ5MTXThKoxfjnBs6wkbwpHLtc9TcgUAaPK8+JDKV+esjSKOl00Cu0m45SvTp865ZuTsEQp916fyony0Ecnw5dfCKhFNGhf+quvFRTz640UK/1yEuQvJ7eGYfgBUN59CttbLNcAAAAASUVORK5CYII=");
}

.mie-reset {
	margin-top: 1px;
	width: 16px;
    height: 16px;
    background-size: contain;
	background-repeat: no-repeat;
	background-image: url(data:image/png;base64,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);
}
`;
	document.head.appendChild(style);
}

let codeMaqDib = `
// inicializaciones por defecto

let gridSize = 400;
let squareSize = 25;
let canvasSize = gridSize + squareSize * 2;

let posInicX = 1;
let posInicY = 1;
let colorInic = "black";

let posX = posInicY;
let posY = posInicY;

let colorActual = "black";
let velocidadEjecucion = 25;

let historial = [];
let indice = 0;
let cuadricula = [[]];

function inicializarCuadriculaDefecto() {
  let rows = Math.ceil((canvasSize - squareSize * 2) / squareSize);
  let columns = Math.ceil((canvasSize - squareSize * 2) / squareSize);
  for (let i = 0; i < rows; i++) {
    cuadricula[i] = [];
    for (let j = 0; j < columns; j++) {
      cuadricula[i][j] = "white";
    }
  }
}

p.setup = function() {
  colorActual = seleccionarColor(colorInic);
  if (!inicializar()) inicializarCuadriculaDefecto();

  canvasSize = gridSize + squareSize * 2;
  createCanvas(canvasSize, canvasSize);
  // ctx = canvas.getContext("2d");
  background("white");

  strokeWeight((squareSize / canvasSize) * 7.5);
  frameRate(velocidadEjecucion);
  posX = (posInicX + 2) * squareSize;
  posY = (posInicY + 2) * squareSize;
  //colorActual = seleccionarColor(colorInic);
  dibujarCuadricula();
  posicionarCursor();

  posX = posInicY;
  posY = posInicY;
  colorActual = seleccionarColor(colorInic);
  try {
    dibujar();
  } catch (e) {
      alertify.error("Error: " + e.name + " " + e.message + " (line " + e.lineNumber + ")");
      console.log("Error: " + e.name + " " + e.message + " (line " + e.lineNumber + ")");
  }

  inicializar();
  posX = (posInicX + 2) * squareSize;
  posY = (posInicY + 2) * squareSize;
  colorActual = seleccionarColor(colorInic);
}

p.draw = function() {
  ejecutarHistorial();
}

function ejecutarHistorial() {
  f = historial[indice];

  if (indice < historial.length) {
    if (typeof f == "function") f();
    indice++;
  } else {
    posicionarCursor();
    let isCorrect = verificar();
    if (typeof isCorrect === "boolean") {
      if (isCorrect) {
        fill("green");
        print("✅ Dibujaste correctamente!!!");
        textSize(25);
        textAlign(CENTER, CENTER);
        text("✅", canvasSize / 2, canvasSize / 2);  
        alertify.success("✅ Dibujaste correctamente!!!"); 
        console.log("✅ Dibujaste correctamente!!!");

      } else {
        fill("red");
        textSize(25);
        textAlign(CENTER, CENTER);
        text("❌", canvasSize / 2, canvasSize / 2);
        alertify.error("❌ Error!!! No dibujaste lo esperado!!!");         
        console.log("❌ Error!!! No dibujaste lo esperado!!!");
      }
    }
    noLoop();
  }
}

// Imprime la cuadricula
function dibujarCuadricula() {
  let rows = Math.ceil((canvasSize - squareSize * 2) / squareSize);
  let columns = Math.ceil((canvasSize - squareSize * 2) / squareSize);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      fill(retornarColor(cuadricula[i][j]));
      rect(
        (i + 2) * squareSize - squareSize,
        (j + 2) * squareSize - squareSize,
        squareSize,
        squareSize
      );
    }
  }
}

function posicionarCursor() {
  if (
    posX <= squareSize ||
    posX > canvasSize - squareSize ||
    posY <= squareSize ||
    posY > canvasSize - squareSize
  ) {
    noLoop();
    fill("red");
    print("❌ Te saliste de la cuadricula!!!");
    textSize(squareSize);
    textAlign(CENTER, CENTER);
    text("❌", canvasSize / 2, canvasSize / 2);
    indice = historial.length + 2;
    alertify.error("❌ Te saliste de la cuadricula!!!");  
    console.log("❌ Te saliste de la cuadricula!!!");

    
  } else {
    fill("yellow");
  }
  textSize(squareSize - squareSize / 3);
  textAlign(CENTER, CENTER);
  text("✏️", posX - squareSize / 2, posY - squareSize / 2);
}

function borrarCursor() {
  fill(retornarColor(cuadricula[posX / squareSize - 2][posY / squareSize - 2]));
  rect(posX - squareSize, posY - squareSize, squareSize, squareSize);
}

function pintar() {
  cuadricula[posX][posY] = colorActual;
  historial.push(pintar_);
}

function pintar_() {
  fill(retornarColor(colorActual));
  cuadricula[posX / squareSize - 2][posY / squareSize - 2] = colorActual;
  rect(posX - squareSize, posY - squareSize, squareSize, squareSize);
  posicionarCursor();
}

function derecha() {
  if (posX < Math.ceil((canvasSize - squareSize * 2) / squareSize) - 1)
    posX += 1;
  historial.push(derecha_);
}

function derecha_() {
  borrarCursor();
  posX += squareSize;
  posicionarCursor();
}

function izquierda() {
  if (posX > 0) posX -= 1;
  historial.push(izquierda_);
}

function izquierda_() {
  borrarCursor();
  posX -= squareSize;
  posicionarCursor();
}

function abajo() {
  if (posY < Math.ceil((canvasSize - squareSize * 2) / squareSize) - 1)
    posY += 1;
  historial.push(abajo_);
}

function abajo_() {
  borrarCursor();
  posY += squareSize;
  posicionarCursor();
}

function arriba() {
  if (posY > 0) posY -= 1;
  historial.push(arriba_);
}

function arriba_() {
  borrarCursor();
  posY -= squareSize;
  posicionarCursor();
}

function seleccionarColor(c) {
    colorActual = c.toString().toLowerCase(); // colours[c][1];
    historial.push(seleccionarColor_);
    historial.push(colorActual);
    return c; // colours[c][1];
}

function seleccionarColor_() {
  indice++;
  colorActual = historial[indice];
}

function colorRandom() {
  colorRandom_();
  historial.push(colorRandom_);
}

function colorRandom_() {
  let c = round(random(0, 140));
  print(c);
  for (let col in colours) {
    if (colours[col][1] == c) colorActual = col;
  }
}

function siguienteColor() {
  siguienteColor_();
  historial.push(siguienteColor_);
}

function siguienteColor_() {
  let c = colours[colorActual][1];
  if (c < 140) {
    c++;
  } else {
    c = 0;
  }
  for (let col in colours) {
    if (colours[col][1] == c) colorActual = col;
  }
}

function retornarColor(c) {
  return c;
}

// sensores y variables
function colorCelda() {
  return retornarColor(cuadricula[posX][posY]);
}

function estaPintado() {
  return retornarColor(cuadricula[posX][posY]) != "white";
}

function colorActivo() {
  return retornarColor(colorActual);
}

function posicionX() {
  return posX;
}

function posicionY() {
  return posY;
}

var colours = {
  black: ["#000000", 0],
  white: ["#ffffff", 1],
  aliceblue: ["#f0f8ff", 2],
  antiquewhite: ["#faebd7", 3],
  aqua: ["#00ffff", 4],
  aquamarine: ["#7fffd4", 5],
  azure: ["#f0ffff", 6],
  beige: ["#f5f5dc", 7],
  bisque: ["#ffe4c4", 8],
  blanchedalmond: ["#ffebcd", 9],
  blue: ["#0000ff", 10],
  blueviolet: ["#8a2be2", 11],
  brown: ["#a52a2a", 12],
  burlywood: ["#deb887", 13],
  cadetblue: ["#5f9ea0", 14],
  chartreuse: ["#7fff00", 15],
  chocolate: ["#d2691e", 16],
  coral: ["#ff7f50", 17],
  cornflowerblue: ["#6495ed", 18],
  cornsilk: ["#fff8dc", 19],
  crimson: ["#dc143c", 20],
  cyan: ["#00ffff", 21],
  darkblue: ["#00008b", 22],
  darkcyan: ["#008b8b", 23],
  darkgoldenrod: ["#b8860b", 24],
  darkgray: ["#a9a9a9", 25],
  darkgreen: ["#006400", 26],
  darkkhaki: ["#bdb76b", 27],
  darkmagenta: ["#8b008b", 28],
  darkolivegreen: ["#556b2f", 29],
  darkorange: ["#ff8c00", 30],
  darkorchid: ["#9932cc", 31],
  darkred: ["#8b0000", 32],
  darksalmon: ["#e9967a", 33],
  darkseagreen: ["#8fbc8f", 34],
  darkslateblue: ["#483d8b", 35],
  darkslategray: ["#2f4f4f", 36],
  darkturquoise: ["#00ced1", 37],
  darkviolet: ["#9400d3", 38],
  deeppink: ["#ff1493", 39],
  deepskyblue: ["#00bfff", 40],
  dimgray: ["#696969", 41],
  dodgerblue: ["#1e90ff", 42],
  firebrick: ["#b22222", 43],
  floralwhite: ["#fffaf0", 44],
  forestgreen: ["#228b22", 45],
  fuchsia: ["#ff00ff", 46],
  gainsboro: ["#dcdcdc", 47],
  ghostwhite: ["#f8f8ff", 48],
  gold: ["#ffd700", 49],
  goldenrod: ["#daa520", 50],
  gray: ["#808080", 51],
  green: ["#008000", 52],
  greenyellow: ["#adff2f", 53],
  honeydew: ["#f0fff0", 54],
  hotpink: ["#ff69b4", 55],
  indianred: ["#cd5c5c", 56],
  indigo: ["#4b0082", 57],
  ivory: ["#fffff0", 58],
  khaki: ["#f0e68c", 59],
  lavender: ["#e6e6fa", 60],
  lavenderblush: ["#fff0f5", 61],
  lawngreen: ["#7cfc00", 62],
  lemonchiffon: ["#fffacd", 63],
  lightblue: ["#add8e6", 64],
  lightcoral: ["#f08080", 65],
  lightcyan: ["#e0ffff", 66],
  lightgoldenrodyellow: ["#fafad2", 67],
  lightgrey: ["#d3d3d3", 68],
  lightgreen: ["#90ee90", 69],
  lightpink: ["#ffb6c1", 70],
  lightsalmon: ["#ffa07a", 71],
  lightseagreen: ["#20b2aa", 72],
  lightskyblue: ["#87cefa", 73],
  lightslategray: ["#778899", 74],
  lightsteelblue: ["#b0c4de", 75],
  lightyellow: ["#ffffe0", 76],
  lime: ["#00ff00", 77],
  limegreen: ["#32cd32", 78],
  linen: ["#faf0e6", 79],
  magenta: ["#ff00ff", 80],
  maroon: ["#800000", 81],
  mediumaquamarine: ["#66cdaa", 82],
  mediumblue: ["#0000cd", 83],
  mediumorchid: ["#ba55d3", 84],
  mediumpurple: ["#9370d8", 85],
  mediumseagreen: ["#3cb371", 86],
  mediumslateblue: ["#7b68ee", 87],
  mediumspringgreen: ["#00fa9a", 88],
  mediumturquoise: ["#48d1cc", 89],
  mediumvioletred: ["#c71585", 90],
  midnightblue: ["#191970", 91],
  mintcream: ["#f5fffa", 92],
  mistyrose: ["#ffe4e1", 93],
  moccasin: ["#ffe4b5", 94],
  navajowhite: ["#ffdead", 95],
  navy: ["#000080", 96],
  oldlace: ["#fdf5e6", 97],
  olive: ["#808000", 98],
  olivedrab: ["#6b8e23", 99],
  orange: ["#ffa500", 100],
  orangered: ["#ff4500", 101],
  orchid: ["#da70d6", 102],
  palegoldenrod: ["#eee8aa", 103],
  palegreen: ["#98fb98", 104],
  paleturquoise: ["#afeeee", 105],
  palevioletred: ["#d87093", 106],
  papayawhip: ["#ffefd5", 107],
  peachpuff: ["#ffdab9", 108],
  peru: ["#cd853f", 109],
  pink: ["#ffc0cb", 110],
  plum: ["#dda0dd", 111],
  powderblue: ["#b0e0e6", 112],
  purple: ["#800080", 113],
  rebeccapurple: ["#663399", 114],
  red: ["#ff0000", 115],
  rosybrown: ["#bc8f8f", 116],
  royalblue: ["#4169e1", 117],
  saddlebrown: ["#8b4513", 118],
  salmon: ["#fa8072", 119],
  sandybrown: ["#f4a460", 120],
  seagreen: ["#2e8b57", 121],
  seashell: ["#fff5ee", 122],
  sienna: ["#a0522d", 123],
  silver: ["#c0c0c0", 124],
  skyblue: ["#87ceeb", 125],
  slateblue: ["#6a5acd", 126],
  slategray: ["#708090", 127],
  snow: ["#fffafa", 128],
  springgreen: ["#00ff7f", 129],
  steelblue: ["#4682b4", 130],
  tan: ["#d2b48c", 131],
  teal: ["#008080", 132],
  thistle: ["#d8bfd8", 133],
  tomato: ["#ff6347", 134],
  turquoise: ["#40e0d0", 135],
  violet: ["#ee82ee", 136],
  wheat: ["#f5deb3", 137],
  whitesmoke: ["#f5f5f5", 138],
  yellow: ["#ffff00", 139],
  yellowgreen: ["#9acd32", 140],
};

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
`;
