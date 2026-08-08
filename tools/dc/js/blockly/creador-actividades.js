let pincelActual = 'none';
let estadoVerificacion = {};
let estadoInicial = {};
let modoPintura = 'inicial'; 

document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica del selector de Pinceles 
    const botonesPincel = document.querySelectorAll('#selector-pincel .btn');
    botonesPincel.forEach(btn => {
        btn.addEventListener('click', function() {
            botonesPincel.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            pincelActual = this.getAttribute('data-color');
        });
    });

    // Lógica del selector de modo (inicio/verificación)
    const botonesModo = document.querySelectorAll('#selector-modo .btn');
    botonesModo.forEach(btn => {
        btn.addEventListener('click', function() {
            botonesModo.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            modoPintura = this.getAttribute('data-modo');
            dibujarGridCreador(); // Redibujamos la grilla para mostrar el estado correcto
        });
    });

    function dibujarGridCreador() {
        const gridContainer = document.getElementById('grid-creador');
        gridContainer.innerHTML = ''; 
        
        const gridSize = parseInt(document.getElementById('act-grid').value) || 125;
        const squareSize = parseInt(document.getElementById('act-celda').value) || 25;
        const cols = Math.floor(gridSize / squareSize);
        const rows = Math.floor(gridSize / squareSize);
        const anchoTotal = cols * squareSize;
        const altoTotal = rows * squareSize;

        gridContainer.style.display = 'block'; 
        gridContainer.style.position = 'relative'; 
        gridContainer.style.width = `${anchoTotal}px`;
        gridContainer.style.height = `${altoTotal}px`;
        gridContainer.style.margin = '0 auto'; 
        gridContainer.style.backgroundColor = '#ffffff'; 
        gridContainer.style.backgroundImage = 'none'; 
        gridContainer.style.border = '1px solid #ccc'; 
        gridContainer.style.userSelect = 'none'; 

        // Función auxiliar para pintar según el modo actual
        function aplicarPintura(celda, x, y) {
            let diccionarioActual = (modoPintura === 'verificacion') ? estadoVerificacion : estadoInicial;
            
            if (pincelActual === 'none') {
                celda.style.backgroundColor = 'transparent';
                delete diccionarioActual[`${x},${y}`];
            } else {
                celda.style.backgroundColor = pincelActual;
                diccionarioActual[`${x},${y}`] = pincelActual;
            }
        }

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const celda = document.createElement('div');
                
                celda.style.position = 'absolute';
                celda.style.left = `${x * squareSize}px`; 
                celda.style.top = `${y * squareSize}px`;  
                celda.style.width = `${squareSize}px`;
                celda.style.height = `${squareSize}px`;
                celda.style.boxSizing = 'border-box';
                celda.style.borderRight = '1px solid #eee';
                celda.style.borderBottom = '1px solid #eee'; 
                celda.style.cursor = 'crosshair';
                
                // Mostrar el color correcto al dibujar la grilla dependiendo de la pestaña en la que estemos
                const colorGuardado = (modoPintura === 'verificacion') ? estadoVerificacion[`${x},${y}`] : estadoInicial[`${x},${y}`];
                celda.style.backgroundColor = colorGuardado ? colorGuardado : 'transparent';
                
                // Eventos optimizados
                celda.addEventListener('mousedown', function(e) {
                    e.preventDefault(); 
                    aplicarPintura(this, x, y);
                });
                celda.addEventListener('mouseenter', function(e) {
                    if (e.buttons === 1) { 
                        aplicarPintura(this, x, y);
                    }
                });
                
                gridContainer.appendChild(celda);
            }
        }
    }
    // Dibujar inicialmente la grilla y escuchar cambios en los inputs
    dibujarGridCreador();
    document.getElementById('act-grid').addEventListener('change', dibujarGridCreador);
    document.getElementById('act-celda').addEventListener('change', dibujarGridCreador);


    // INICIALIZAR BLOCKLY EN LA COLUMNA DERECHA 
    if (document.getElementById('blocklyDivCreator')) {
        const workspaceCreator = Blockly.inject('blocklyDivCreator', {
            toolbox: miToolbox["completo"], 
            scrollbars: true,
            trashcan: false
        });

        const bloqueMain = workspaceCreator.newBlock('bloque_dibujar');
        bloqueMain.initSvg();
        bloqueMain.render();
        bloqueMain.setDeletable(false); 
        bloqueMain.moveBy(50, 50);

        setTimeout(function() {
            Blockly.svgResize(workspaceCreator);
        }, 500);
        // Guardamos el workspace globalmente para poder leerlo al descargar
        window.workspaceCreator = workspaceCreator;
    }


    // EVENTO DEL BOTÓN DESCARGAR
    document.getElementById('btn-descargar-actividad').addEventListener('click', () => {
        const titulo = document.getElementById('act-titulo').value || 'Nueva Actividad';
        const desc = document.getElementById('act-desc').value || '';
        const gridSize = document.getElementById('act-grid').value;
        const squareSize = document.getElementById('act-celda').value;
        const posInicX = document.getElementById('act-posx').value;
        const posInicY = document.getElementById('act-posy').value;
        const colorInic = document.getElementById('act-color').value;

        const codigoVerificacionGenerado = generarStringVerificacion();
        const codigoInicialGenerado = generarStringEstadoInicial();

        let estadoBloquesStr = null;
        if (window.workspaceCreator) {
            const estadoJSON = Blockly.serialization.workspaces.save(window.workspaceCreator);
            // Solo lo guardamos si el profesor efectivamente puso bloques en la pantalla
            if (estadoJSON.blocks && estadoJSON.blocks.blocks && estadoJSON.blocks.blocks.length > 0) {
                estadoBloquesStr = JSON.stringify(estadoJSON);
            }
        }
        const actividadJSON = {
            titulo: titulo,
            descripcion: desc,
            configCuadricula: `
                gridSize = ${gridSize};   
                squareSize = ${squareSize};
                posInicX = ${posInicX};
                posInicY = ${posInicY};
                colorInic = "${colorInic}";
                velocidadEjecucion = 25;
                inicializarCuadriculaDefecto();
                ${codigoInicialGenerado}
            `,
            verificacion: codigoVerificacionGenerado,
            bloquesIniciales: estadoBloquesStr
        };

        // Crear el archivo descargable y forzar la descarga en el navegador
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(actividadJSON, null, 4));
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.setAttribute("href", dataStr);
        enlaceDescarga.setAttribute("download", titulo.replace(/\s+/g, '_').toLowerCase() + ".json"); 
        document.body.appendChild(enlaceDescarga); 
        enlaceDescarga.click();
        enlaceDescarga.remove();
    });

}); 

function generarStringVerificacion() {
    const celdasPintadas = Object.keys(estadoVerificacion);
    
    // Si no pintó nada, asume que es una actividad libre que siempre se gana
    if (celdasPintadas.length === 0) {
        return "return true;"; 
    }

    let condiciones = [];
    
    // Convertir el diccionario visual a condiciones JS
    for (let key of celdasPintadas) {
        const coords = key.split(','); 
        const x = coords[0];
        const y = coords[1];
        const color = estadoVerificacion[key];
        
        // Manejamos el caso especial del azul/navy
        if (color === 'blue') {
            condiciones.push(`(cuadricula[${x}][${y}] == 'blue' || cuadricula[${x}][${y}] == 'navy')`);
        } else {
            condiciones.push(`(cuadricula[${x}][${y}] == '${color}')`);
        }
    }

    // Unimos todo con AND lógico (&&)
    const logicaIf = condiciones.join(' &&\n    ');

    return `if (
    ${logicaIf}
) {
    return true;
} else {
    return false;
}`;
}

function generarStringEstadoInicial() {
    const celdasPintadas = Object.keys(estadoInicial);
    if (celdasPintadas.length === 0) return ""; // Si no pintó nada, no hace nada

    let comandosJS = [];
    
    // Sobreescribimos el color de la celda en la matriz de la cuadrícula
    for (let key of celdasPintadas) {
        const coords = key.split(','); 
        const x = coords[0];
        const y = coords[1];
        const color = estadoInicial[key];
        
        comandosJS.push(`cuadricula[${x}][${y}] = '${color}';`);
    }
    return comandosJS.join('\n    ');
}


