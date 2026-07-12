document.addEventListener("DOMContentLoaded", () => {
    const contenedorComponente = document.getElementById('blockly-mie-component');
    const blocklyDivEstatico = document.getElementById('blocklyDiv');

    if (contenedorComponente) {
        console.log("[Componente] Iniciando armado dinámico...");
        const scriptsConfiguracion = Array.from(contenedorComponente.children);
    
        contenedorComponente.innerHTML = `
            <div class="blockly-mie-wrapper minis horiz" style="width: 100%;">
                <div class="blockly-panel">
                    <div id="blocklyDiv" style="height: 520px; width: 100%;"></div>
                </div>
                <div class="mie-panel" id="mie-panel-dest">
                    <!-- Los scripts de configuración van acá -->
                </div>
            </div>
        `;

        const miePanel = document.getElementById('mie-panel-dest');
        scriptsConfiguracion.forEach(nodo => miePanel.appendChild(nodo));

        inyectarInputArchivos();
        inicializarWorkspaceBlockly();
        redefinirBotones();

        setTimeout(() => {
            if (window.mie && typeof window.mie.load === 'function') {
                window.mie.load();
            }
        }, 100);
    } 
    else if (blocklyDivEstatico) {
        console.log("[Componente] Modo estático detectado. Inicializando...");
        inyectarInputArchivos();
        inicializarWorkspaceBlockly();
        redefinirBotones();
    }
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