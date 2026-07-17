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
    "act1":{
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
    workspace.addChangeListener(function(event) {
        const bloqueMain = workspace.getBlocksByType('bloque_dibujar')[0];
        let codigoJS = "";
        if (bloqueMain) {
            codigoJS = javascript.javascriptGenerator.blockToCode(bloqueMain);
        } else {
            codigoJS = "// Esperando al bloque principal dibujar()...";
        }
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
window.actividades = {
    "1": {
        toolbox: "act1",
        archivoBloques: "act1.json", 
        configCuadricula: `
            gridSize = 400;   
            squareSize = 25;
            posInicX = 0;
            posInicY = 0;
            colorInic = "black";
            velocidadEjecucion = 25;
            inicializarCuadriculaDefecto();
        `
    },
};

