document.addEventListener("DOMContentLoaded", () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idFull = parametrosUrl.get('id') || parametrosUrl.get('page');

    // Leemos el progreso guardado en el navegador (o creamos un arreglo vacío si es la primera vez)
    let actividadesCompletadas = JSON.parse(localStorage.getItem('labiin_progreso')) || [];

    if (idFull && window.dbActividades && window.dbActividades[idFull]) {
        
        //Verificar si la actividad está bloqueada
        const ultimoGuion = idFull.lastIndexOf('-');
        const idCuaderno = idFull.substring(0, ultimoGuion);
        const actActual = parseInt(idFull.substring(ultimoGuion + 1));
        
        if (actActual > 1) {
            const idAnterior = idCuaderno + "-" + (actActual - 1);
            // Si la anterior no está en el registro de completadas
            if (!actividadesCompletadas.includes(idAnterior)) {
                alert("🔒 ¡Actividad Bloqueada! Debes completar la actividad anterior para poder ingresar a esta.");
                window.location.href = "actividades.bloques.html";
                return; // Detenemos la ejecución
            }
        }

        const act = window.dbActividades[idFull];
        
        // Rellenamos los datos de la interfaz
        document.getElementById('act-titulo').innerText = act.titulo;
        document.getElementById('act-desc').innerText = act.descripcion;
        
        if (act.imagen) {
            const img = document.getElementById('act-imagen');
            img.src = act.imagen;
            img.style.display = 'block';
        }
        
        if (act.tips) {
            const tips = document.getElementById('act-tips');
            tips.innerHTML = `
                <div style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-toggle="collapse" data-target="#contenidoTips">
                    <h5 style="font-weight: 700; margin: 0; color: #856404;">💡 Ver Pistas</h5>
                    <span style="font-size: 1.2rem;">🔽</span>
                </div>
                <div class="collapse mt-3" id="contenidoTips">
                    <div style="padding-top: 15px; border-top: 1px solid #d4c69f;">
                        ${act.tips}
                    </div>
                </div>
            `;
            tips.style.backgroundColor = "#fff3cd";
            tips.style.borderLeft = "5px solid #ffc107";
            tips.style.display = 'block';
        }

        // LÓGICA DE NAVEGACIÓN Y GUARDADO DE PROGRESO
        if (ultimoGuion !== -1) {
            const actSiguiente = actActual + 1;
            let btnSiguienteHtml = '';
            
            if (window.dbCuadernos && window.dbCuadernos[idCuaderno] && window.dbCuadernos[idCuaderno].actividades[actSiguiente]) {
                const idSiguiente = idCuaderno + "-" + actSiguiente;
                btnSiguienteHtml = `<a href="actividad-bloques.html?id=${idSiguiente}" class="btn btn-success mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(40,167,69,0.3);" id="btn-siguiente">🎯 ¡Excelente! Siguiente Actividad ➡</a>`;
            } else {
                btnSiguienteHtml = `<a href="actividades-bloques.html" class="btn btn-primary mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(0,123,255,0.3);" id="btn-siguiente">🏆 ¡Cuaderno Completado! Volver al Menú</a>`;
            }

            const descContenedor = document.getElementById('act-desc').parentNode;
            descContenedor.insertAdjacentHTML('beforeend', btnSiguienteHtml);
            
            // Función global que se llama cuando Blockly devuelve "return true;"
            window.mostrarBotonSiguiente = function() {
                const btn = document.getElementById('btn-siguiente');
                if (btn) btn.style.display = 'inline-block';
                
                // Si no está guardada, la agregamos
                if (!actividadesCompletadas.includes(idFull)) {
                    actividadesCompletadas.push(idFull);
                    localStorage.setItem('labiin_progreso', JSON.stringify(actividadesCompletadas));
                }
            };
        }

    } else {
        const titulo = document.getElementById('act-titulo');
        if(titulo) titulo.innerText = "Modo Libre";
        
        const desc = document.getElementById('act-desc');
        if(desc) desc.innerText = "Dibuja lo que quieras usando los bloques.";
    }
});