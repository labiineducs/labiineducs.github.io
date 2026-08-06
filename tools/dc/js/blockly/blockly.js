document.addEventListener("DOMContentLoaded", () => {
    const contenedorComponente = document.getElementById('blockly-mie-component');
    if (!contenedorComponente) return; 
    console.log("[Motor Blockly] Inicializando componente puro...");
    
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idActividad = parametrosUrl.get('id') || parametrosUrl.get('page');

    let toolboxRequerido = contenedorComponente.getAttribute('data-toolbox') || "completo";
    let bloquesIniciales = contenedorComponente.getAttribute('data-bloques-iniciales');
    let scriptsMie = "";

    // De dónde saca la información de la actividad
    const isCustom = parametrosUrl.get('custom') === 'true';
    let act = null;
    if (isCustom) {
        const dataStr = localStorage.getItem('actividad_personalizada');
        if (dataStr) act = JSON.parse(dataStr);
    } else if (idActividad && window.dbActividades && window.dbActividades[idActividad]) {
        act = window.dbActividades[idActividad];
    }
    //Armamos el entorno
    if (act) {
        toolboxRequerido = act.toolbox || "completo";
        const verificacionAutomatizada = act.verificacion.replace(
            /return\s+true\s*;/g, 
            "if(typeof mostrarBotonSiguiente === 'function') { mostrarBotonSiguiente(); } return true;"
        );

        scriptsMie = `
            <script type="mie/p5" id="dibujar" min-lines="20" lines="20" data-inic-dc="inic-dibujar" data-verif-dc="verif-dibujar"><\/script>
            <script type="dc/inic" id="inic-dibujar">${act.configCuadricula}<\/script>
            <script type="dc/verif" id="verif-dibujar">${verificacionAutomatizada}<\/script>
        `;
        // Manejo especial para bloques iniciales 
        if (isCustom && act.bloquesIniciales) {
            bloquesIniciales = "CUSTOM_JSON"; 
            window.bloquesCustomJSON = act.bloquesIniciales; 
        } else {
            bloquesIniciales = act.archivoBloques;
        }

    } else {
        // Si entran sin ID y sin Custom (Modo Libre)
        scriptsMie = `
            <script type="mie/p5" id="dibujar" min-lines="20" lines="20" data-inic-dc="inic-dibujar" config-sel><\/script>
            <script type="dc/inic" id="inic-dibujar">
                gridSize = 400; squareSize = 25; posInicX = 0; posInicY = 0; colorInic = "black"; velocidadEjecucion = 25;
                inicializarCuadriculaDefecto();
            <\/script>
        `;
    }
    contenedorComponente.innerHTML = `
        <div class="blockly-mie-wrapper minis horiz" style="width: 100%;">
            <div class="blockly-panel">
                <div id="blocklyDiv" style="height: 520px; width: 100%;"></div>
            </div>
            <div class="mie-panel" id="mie-panel-dest">
                ${scriptsMie}
            </div>
        </div>
    `;
    
    // Secuencia de arranque de los motores
    inyectarInputArchivos();
    inicializarWorkspaceBlockly(toolboxRequerido);
    redefinirBotones();

    if (bloquesIniciales) {
        cargarBloquesAct(bloquesIniciales);
    }

    setTimeout(() => {
        if (window.mie && typeof window.mie.load === 'function') {
            window.mie.load();
        } else if (window.mie && typeof window.mie.loadMinis === 'function') {
            window.mie.loadMinis(contenedorComponente);
        }
    }, 100);
});

// Función aislada para inyectar el input oculto
function inyectarInputArchivos() {
    if (!document.getElementById('inputCargarBloques')) {
        const inputDinamico = document.createElement('input');
        inputDinamico.type = 'file';
        inputDinamico.id = 'inputCargarBloques';
        inputDinamico.accept = '.json';
        inputDinamico.style.display = 'none';
        inputDinamico.addEventListener('change', cargarBloques); 
        document.body.appendChild(inputDinamico);
    }
}

function redefinirBotones() {
    const btnSave = document.querySelector('.mie-save');
    const btnOpen = document.querySelector('.mie-open');
    
    if (btnSave && btnOpen && !btnSave.classList.contains('bloques-ready')) {
        const newSave = btnSave.cloneNode(true);
        const newOpen = btnOpen.cloneNode(true);

        newSave.classList.add('bloques-ready');
        newOpen.classList.add('bloques-ready');

        btnSave.parentNode.replaceChild(newSave, btnSave);
        btnOpen.parentNode.replaceChild(newOpen, btnOpen);

        newSave.addEventListener('click', (e) => { e.preventDefault(); guardarBloques(); });
        newOpen.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('inputCargarBloques').click(); });
        
        newSave.title = "Guardar Bloques";
        newOpen.title = "Abrir Bloques";
    }
    setTimeout(redefinirBotones, 500);
}

async function cargarBloquesAct(url) {
    try {
        let estadoJSON;
        
        // Si es personalizada, leemos la variable global. Si no, hacemos el fetch original.
        if (url === "CUSTOM_JSON") {
            console.log("[Componente] Cargando bloques iniciales de actividad personalizada...");
            estadoJSON = JSON.parse(window.bloquesCustomJSON);
        } else {
            console.log(`[Componente] Buscando bloques iniciales en: ${url}`);
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            estadoJSON = await respuesta.json();
        }
        
        if (workspace) {
            workspace.clear(); // Limpia el lienzo por las dudas
            Blockly.serialization.workspaces.load(estadoJSON, workspace); // Inyecta el archivo
            console.log("[Componente] Bloques cargados con éxito.");
        }
    } catch (error) {
        console.error("[Componente] Error al cargar el archivo de bloques iniciales:", error);
    }
}