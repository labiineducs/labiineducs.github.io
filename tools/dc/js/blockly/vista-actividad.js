document.addEventListener("DOMContentLoaded", () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idFull = parametrosUrl.get('id') || parametrosUrl.get('page');
    const isCustom = parametrosUrl.get('custom') === 'true';

    // Leemos el progreso guardado en el navegador
    let actividadesCompletadas = JSON.parse(localStorage.getItem('labiin_progreso')) || [];
    
    // Variables de control
    let act = null;
    let idCuaderno = null;
    let actActual = null;
    let ultimoGuion = -1;

    // OBTENER LOS DATOS DE LA ACTIVIDAD
    if (isCustom) {
        // Modo: Actividad Personalizada
        const dataStr = localStorage.getItem('actividad_personalizada');
        if (dataStr) {
            act = JSON.parse(dataStr);
        }
    } else if (idFull && window.dbActividades && window.dbActividades[idFull]) {
        // Modo: Actividad de la Base de Datos
        ultimoGuion = idFull.lastIndexOf('-');
        idCuaderno = idFull.substring(0, ultimoGuion);
        actActual = parseInt(idFull.substring(ultimoGuion + 1));
        
        // Verificación de bloqueo
        if (actActual > 1) {
            const idAnterior = idCuaderno + "-" + (actActual - 1);
            if (!actividadesCompletadas.includes(idAnterior)) {
                alert("🔒 ¡Actividad Bloqueada! Debes completar la actividad anterior para poder ingresar a esta.");
                window.location.href = "actividades-bloques.html"; 
                return; // Detenemos la ejecución
            }
        }
        act = window.dbActividades[idFull];
    }

    // RELLENAR LA INTERFAZ
    if (act) {
        const tituloEl = document.getElementById('act-titulo');
        if (tituloEl) tituloEl.innerText = act.titulo || "Actividad sin título";
        
        const descEl = document.getElementById('act-desc');
        if (descEl) descEl.innerText = act.descripcion || "";
        
        if (act.imagen) {
            const img = document.getElementById('act-imagen');
            if (img) {
                img.src = act.imagen;
                img.style.display = 'block';
            }
        }
        
        if (act.tips) {
            const tips = document.getElementById('act-tips');
            if (tips) {
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
        }

        const descContenedor = document.getElementById('act-desc') ? document.getElementById('act-desc').parentNode : null;
        
        if (descContenedor) {
            if (isCustom) {
                const btnVolverHtml = `<a href="actividades-bloques.html" class="btn btn-success mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(40,167,69,0.3);" id="btn-siguiente">🎯 ¡Resolución Correcta! Volver al menú ➡</a>`;
                descContenedor.insertAdjacentHTML('beforeend', btnVolverHtml);
                window.mostrarBotonSiguiente = function() {
                    const btn = document.getElementById('btn-siguiente');
                    if (btn) btn.style.display = 'inline-block';
                };

            } else if (ultimoGuion !== -1) {
                const actSiguiente = actActual + 1;
                let btnSiguienteHtml = '';
                
                if (window.dbCuadernos && window.dbCuadernos[idCuaderno] && window.dbCuadernos[idCuaderno].actividades[actSiguiente]) {
                    const idSiguiente = idCuaderno + "-" + actSiguiente;
                    btnSiguienteHtml = `<a href="actividad-bloques.html?id=${idSiguiente}" class="btn btn-success mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(40,167,69,0.3);" id="btn-siguiente">🎯 ¡Excelente! Siguiente Actividad ➡</a>`;
                } else {
                    btnSiguienteHtml = `<a href="actividades-bloques.html" class="btn btn-primary mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(0,123,255,0.3);" id="btn-siguiente">🏆 ¡Cuaderno Completado! Volver al Menú</a>`;
                }

                descContenedor.insertAdjacentHTML('beforeend', btnSiguienteHtml);
                
                window.mostrarBotonSiguiente = function() {
                    const btn = document.getElementById('btn-siguiente');
                    if (btn) btn.style.display = 'inline-block';
                    
                    if (!actividadesCompletadas.includes(idFull)) {
                        actividadesCompletadas.push(idFull);
                        localStorage.setItem('labiin_progreso', JSON.stringify(actividadesCompletadas));
                    }
                };
            }
        }

    } else {
        const titulo = document.getElementById('act-titulo');
        if(titulo) titulo.innerText = "Modo Libre";
        
        const desc = document.getElementById('act-desc');
        if(desc) desc.innerText = "Dibuja lo que quieras usando los bloques. ¡No hay límites!";
    }
});