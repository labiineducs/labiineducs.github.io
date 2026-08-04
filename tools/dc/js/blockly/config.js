// --- CONFIGURACIÓN DEL MENÚ LATERAL CON CATEGORÍAS ---
const miToolbox = {
    "completo":{
        "kind": "categoryToolbox",
        "contents": [
            {
                "kind": "category",
                "name": "Funciones Básicas",
                "colour": "330", 
                "contents": [
                    { "kind": "block", "type": "bloque_pintar" },
                    { "kind": "block", "type": "bloque_subir" },
                    { "kind": "block", "type": "bloque_bajar" },
                    {"kind": "block", "type": "bloque_derecha"},
                    {"kind": "block", "type": "bloque_izquierda"}
                ]
            },
            {
                "kind": "category",
                "name": "Color",
                "colour": "40",
                "contents": [
                    { "kind": "block", "type": "bloque_seleccionarColor" },
                    { "kind": "block", "type": "bloque_siguienteColor" },
                    {"kind": "block", "type": "bloque_colorRandom" },
                    { "kind": "block", "type": "bloque_colores" }
                ]
            },
            {
                "kind": "category",
                "name": "Sensores",
                "colour": "0",
                "contents": [
                    { "kind": "block", "type": "bloque_estaPintado" },
                    { "kind": "block", "type": "bloque_colorCelda" },
                    { "kind": "block", "type": "bloque_colorActivo" },
                    {"kind": "block", "type": "bloque_posicionX"},
                    {"kind": "block", "type": "bloque_posicionY"}
                ]
            },
            {
                "kind": "category",
                "name": "Lógica y Control",
                "colour": "%{BKY_LOGIC_HUE}",
                "contents": [
                    // Bloques Condicionales
                    { "kind": "block", "type": "controls_if" },
                    { "kind": "block", "type": "logic_compare" },
                    { "kind": "block", "type": "logic_operation" },
                    { "kind": "block", "type": "logic_negate" },
                    // Bloques de Bucles
                    { "kind": "block", "type": "controls_whileUntil" },
                    { "kind": "block", "type": "controls_repeat_ext" },
                ]
            },
            {
                "kind": "category",
                "name": "Matemáticas",
                "colour": "%{BKY_MATH_HUE}",
                "contents": [
                    { "kind": "block", "type": "math_number" },
                    { "kind": "block", "type": "math_arithmetic" },
                    { "kind": "block", "type": "math_random_int" }, // Random
                    { "kind": "block", "type": "math_on_list" }     // Min, Max, etc.
                ]
            },
            {
                "kind": "category",
                "name": "Texto",
                "colour": "%{BKY_TEXTS_HUE}",
                "contents": [
                    { "kind": "block", "type": "text" }, // String
                    { "kind": "block", "type": "text_print" }
                ]
            },
            {
                "kind": "category",
                "name": "Listas",
                "colour": "%{BKY_LISTS_HUE}",
                "contents": [
                    { "kind": "block", "type": "lists_create_with" }, // Arrays
                    { "kind": "block", "type": "lists_getIndex" }
                ]
            },
            //CATEGORÍAS DINÁMICAS NATIVAS
            {
                "kind": "category",
                "name": "Variables",
                "colour": "%{BKY_VARIABLES_HUE}",
                "custom": "VARIABLE" 
            },
            {
                "kind": "category",
                "name": "Funciones",
                "colour": "%{BKY_PROCEDURES_HUE}",
                "custom": "PROCEDURE" 
            }
        ]
    },
    "act1-1":{
        "kind": "categoryToolbox",
        "contents": [
            {
                "kind": "category",
                "name": "Funciones Básicas",
                "colour": "330", 
                "contents": [
                    { "kind": "block", "type": "bloque_pintar" },
                    { "kind": "block", "type": "bloque_subir" },
                    { "kind": "block", "type": "bloque_bajar" },
                    { "kind": "block", "type": "bloque_derecha"},
                    { "kind": "block", "type": "bloque_izquierda"}
                ]
            }
        ]    
    },
    "act1-3":{
        "kind": "categoryToolbox",
        "contents": [
            {
                "kind": "category",
                "name": "Funciones Básicas",
                "colour": "330", 
                "contents": [
                    { "kind": "block", "type": "bloque_pintar" },
                    { "kind": "block", "type": "bloque_subir" },
                    { "kind": "block", "type": "bloque_bajar" },
                    { "kind": "block", "type": "bloque_derecha"},
                    { "kind": "block", "type": "bloque_izquierda"}
                ]
            },
            {
                "kind": "category",
                "name": "Color",
                "colour": "40",
                "contents": [
                    { "kind": "block", "type": "bloque_seleccionarColor" },
                ]
            }
        ]    
    }    
};

let workspace;

function inicializarWorkspaceBlockly(toolBox){

    const configToolbox = miToolbox[toolBox] || miToolbox["completo"];

    // Inyección en el HTML
        workspace = Blockly.inject('blocklyDiv', {
            toolbox: configToolbox,
            scrollbars: true,
            trashcan: false
    });

    // Crear el bloque principal dibujar en el espacio de trabajo
    const bloqueMain = workspace.newBlock('bloque_dibujar');
    bloqueMain.initSvg();
    bloqueMain.render();
    bloqueMain.setDeletable(false); 
    bloqueMain.moveBy(50, 50);

    // Forzamos el redibujado (por el artículo oculto de Bootstrap)
    setTimeout(function() {
        Blockly.svgResize(workspace);
    }, 800);

    // Sincronización Automática con la Cuadrícula
    // Sincronización Automática con la Cuadrícula
    workspace.addChangeListener(function(event) {
        const bloqueMain = workspace.getBlocksByType('bloque_dibujar')[0];
        let codigoJS = "";

        if (bloqueMain) {
            javascript.javascriptGenerator.init(workspace);
            
            const bloquesTop = workspace.getTopBlocks(true);
            for (let i = 0; i < bloquesTop.length; i++) {
                const tipo = bloquesTop[i].type;
                if (tipo === 'procedures_defnoreturn' || tipo === 'procedures_defreturn') {
                    javascript.javascriptGenerator.blockToCode(bloquesTop[i]);
                }
            }
            let codigoPrincipal = javascript.javascriptGenerator.blockToCode(bloqueMain);
            codigoJS = javascript.javascriptGenerator.finish(codigoPrincipal);
        } else {
            codigoJS = "// Esperando al bloque principal dibujar()...";
        }
        window.codigoBlocklyActual = codigoJS;
        if (window.mie && window.mie.length > 0 && window.mie[0].editor) {
            window.mie[0].editor.setValue(codigoJS);
        }
    });
}

function guardarBloques() {
    const estado = Blockly.serialization.workspaces.save(workspace);
    const textoJSON = JSON.stringify(estado);
    const blob = new Blob([textoJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi_dibujo_bloques.json'; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function cargarBloques(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e) {
        try {
            const contenido = e.target.result;
            const estado = JSON.parse(contenido);
            workspace.clear();
            Blockly.serialization.workspaces.load(estado, workspace);
            document.getElementById('inputCargarBloques').value = "";
            
        } catch (error) {
            alert("Error al cargar el archivo. Asegúrate de que sea un archivo .json válido de Blockly.");
            console.error(error);
        }
    };
    lector.readAsText(archivo);
}

// BASE DE DATOS DE ACTIVIDADES 
window.dbCuadernos = {
    "cuaderno_1" :{
        titulo: "Instrucciones Básicas",
        descripcion: "Primeros pasos para entender cómo mover el cursor y dibujar en la cuadrícula.",
        actividades: {
            "1": {
                toolbox: "act1-1",
                archivoBloques: null,
                titulo: "Dibuja una línea",
                descripcion: "Intenta dibujar una línea de 3 cuadraditos como la que vemos abajo.",
                imagen: "./assets/actividades_icons/actividad_1.png",
                tips: `
                    <p>🤔 Las funciones <code>izquierda()</code>, <code>derecha()</code>, <code>abajo()</code> y <code>arriba()</code> nos permite mover el cursor al cuadradito vecino (en la dirección indicada).</p>
                    <p>🤔 La función <code>pintar()</code> nos permite colorear el cuadrado donde se encuentra el cursor.</p>
                    <p>🤔 El cursor esta representado por ✏️.</p>
                `,
                configCuadricula: `
                    gridSize = 125;   
                    squareSize = 25;
                    posInicX = 1;
                    posInicY = 1;
                    colorInic = "black";
                    velocidadEjecucion = 25;
                    inicializarCuadriculaDefecto();
                `,
                verificacion: `
                    if ((cuadricula[1][1] == "black") && (cuadricula[2][1] == "black") && (cuadricula[3][1] == "black")) {
                        return true;
                    } else {
                        return false;
                    }
                `
            },
            "2": {
                toolbox: "act1-1",
                archivoBloques: null,
                titulo: "Dibuja un cuadrado",
                descripcion: "Dibuja un cuadrado de 3 cuadraditos por lado, como el que vemos en la figura.",
                imagen: "./assets/actividades_icons/actividad_2.png",
                tips: `
                    <p>🤔 Las funciones <code>izquierda()</code>, <code>derecha()</code>, <code>abajo()</code> y <code>arriba()</code> nos permite mover el cursor al cuadradito vecino (en la dirección indicada).</p>
                    <p>🤔 La función <code>pintar()</code> nos permite colorear el cuadrado donde se encuentra el cursor.</p>
                    <p>🤔 El cursor esta representado por ✏️.</p>
                `,
                configCuadricula: `
                    gridSize = 125;   
                    squareSize = 25;
                    posInicX = 1;
                    posInicY = 1;
                    colorInic = "black";
                    velocidadEjecucion = 25;
                    inicializarCuadriculaDefecto();
                `,
                verificacion: `
                    if ((cuadricula[1][1]=="black") && (cuadricula[2][1]=="black") && (cuadricula[3][1]=="black") && 
                        (cuadricula[3][2]=="black") && (cuadricula[3][3]=="black") && 
                        (cuadricula[1][3]=="black") && (cuadricula[2][3]=="black") && 
                        (cuadricula[1][2]=="black") ){
                            return true;
                        }else{
                            return false;
                        }
                `
            },
            "3": {
                toolbox: "act1-3",
                archivoBloques: "./js/blockly/workspaces/act1-3.json",
                titulo: "Dibuja una escalera de colores",
                descripcion: "Dibujar una escalera de con los escalones de color rojo, azul y negro, como la que vemos en la figura.",
                imagen: "./assets/actividades_icons/actividad_3.png",
                tips: `
                    <p>🤔 La función <code>seleccionarColor(<strong>< color ></strong>)</code> permite cambiar el color para pintar.</p>
			        <p>🤔 Por ejemplo, <code>seleccionarColor("blue")</code> selecciona el color azul.</p>
                `,
                configCuadricula: `
                    gridSize = 125;   
                    squareSize = 25;
                    posInicX = 0;
                    posInicY = 0;
                    colorInic = "black";
                    velocidadEjecucion = 25;
                    inicializarCuadriculaDefecto();
                `,
                verificacion: `
                    if ((cuadricula[0][0]=="red") && (cuadricula[1][0]=="red") && 
	                    (cuadricula[1][1]=="blue" || cuadricula[1][1]=="navy") && (cuadricula[2][1]=="blue" || cuadricula[1][1]=="navy") && 
	                    (cuadricula[2][2]=="black") && (cuadricula[3][2]=="black")){
		     	            return true;
			        }else{
                            return false;
                    }
                `
            },
            "4": {
                toolbox: "act1-3",
                archivoBloques: null,
                titulo: "Dibuja un símbolo de suma",
                descripcion: "Dibuja un símbolo de suma (+) de color verde en el centro de la cuadrícula. ¡Ojo! Vas a tener que moverte sin pintar para llegar al lugar correcto.",
                imagen: "./assets/actividades_icons/act1-4.png",
                tips: `
                    <p>🤔 Recuerda que las funciones de movimiento (<code>arriba()</code>, <code>abajo()</code>, etc.) mueven el cursor pero <strong>NO</strong> pintan por sí solas.</p>
                    <p>🤔 Usa esto a tu favor para dejar espacios en blanco y posicionarte en el centro antes de usar <code>pintar()</code>.</p>
                `,
                configCuadricula: `
                    gridSize = 125;   
                    squareSize = 25;
                    posInicX = 0;
                    posInicY = 0;
                    colorInic = "black";
                    velocidadEjecucion = 25;
                    inicializarCuadriculaDefecto();
                `,
                verificacion: `
                    if ((cuadricula[2][1]=="green") && 
                        (cuadricula[1][2]=="green") && (cuadricula[2][2]=="green") && (cuadricula[3][2]=="green") && 
                        (cuadricula[2][3]=="green")) {
                            return true;
                    } else {
                            return false;
                    }
                `
            },
            "5": {
                toolbox: "act1-3",
                archivoBloques: null,
                titulo: "Desafío Final: Las cuatro esquinas",
                descripcion: "¡Llegaste al final del cuaderno! Pinta las cuatro esquinas con colores distintos: Rojo, Azul, Verde y Amarillo.",
                imagen: "./assets/actividades_icons/act1-5.png",
                tips: `
                    <p>🤔 Tómate tu tiempo para planificar la ruta. ¿Por qué esquina te conviene empezar?</p>
                    <p>🤔 Recuerda usar <code>seleccionarColor()</code> antes de pintar cada esquina.</p>
                    <p>🏆 ¡Si logras este desafío, estás listo para el siguiente nivel!</p>
                `,
                configCuadricula: `
                    gridSize = 125;   
                    squareSize = 25;
                    posInicX = 2; 
                    posInicY = 2;
                    colorInic = "black";
                    velocidadEjecucion = 25;
                    inicializarCuadriculaDefecto();
                `,
                verificacion: `
                    if ((cuadricula[0][0]=="red") && 
                        (cuadricula[4][0]=="blue" || cuadricula[4][0]=="navy") && 
                        (cuadricula[0][4]=="green") && 
                        (cuadricula[4][4]=="yellow")) {
                            return true;
                    } else {
                            return false;
                    }
                `
            }
        }
    },
    "cuaderno_2":{
        titulo: "Definición de funciones",
        descripcion: "Llegó el momento de crear tus propios comandos. Aprende a agrupar secuencias de bloques bajo un mismo nombre para reutilizarlos, evitar repeticiones y organizar mejor tu código.",
        actividades:{

        }
    }
};

window.dbActividades = {};
for (const idCuaderno in window.dbCuadernos) {
    const cuaderno = window.dbCuadernos[idCuaderno];
    for (const idActividad in cuaderno.actividades) {
        // Creamos un ID único combinando el cuaderno y la actividad (ej: "cuaderno_1-1")
        const idUnico = idCuaderno + "-" + idActividad;
        window.dbActividades[idUnico] = cuaderno.actividades[idActividad];
    }
}

