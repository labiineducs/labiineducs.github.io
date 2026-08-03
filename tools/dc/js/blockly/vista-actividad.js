document.addEventListener("DOMContentLoaded", () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idFull = parametrosUrl.get('id') || parametrosUrl.get('page');

    if (idFull && window.dbActividades && window.dbActividades[idFull]) {
        const act = window.dbActividades[idFull];
        
        // 1. Rellenamos los datos de la interfaz
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
                <div style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-toggle="collapse" data-target="#contenidoTips" title="Haz clic para revelar u ocultar las pistas">
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

        // 2. LÓGICA DE NAVEGACIÓN: Botón "Siguiente Actividad"
        const ultimoGuion = idFull.lastIndexOf('-');
        if (ultimoGuion !== -1) {
            const idCuaderno = idFull.substring(0, ultimoGuion);
            const actActual = parseInt(idFull.substring(ultimoGuion + 1));
            const actSiguiente = actActual + 1; // Calculamos la próxima matemáticamente

            let btnSiguienteHtml = '';
            
            // Verificamos si la actividad +1 existe dentro del mismo cuaderno en la base original
            if (window.dbCuadernos && window.dbCuadernos[idCuaderno] && window.dbCuadernos[idCuaderno].actividades[actSiguiente]) {
                const idSiguiente = idCuaderno + "-" + actSiguiente;
                btnSiguienteHtml = `<a href="actividad-bloques.html?id=${idSiguiente}" class="btn btn-success mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(40,167,69,0.3);" id="btn-siguiente">🎯 ¡Excelente! Siguiente Actividad ➡</a>`;
            } else {
                // Si no existe, significa que terminamos el cuaderno
                btnSiguienteHtml = `<a href="actividades-bloques.html" class="btn btn-primary mt-3" style="border-radius: 20px; font-weight: 600; display: none; box-shadow: 0 4px 6px rgba(0,123,255,0.3);" id="btn-siguiente">🏆 ¡Cuaderno Completado! Volver al Menú</a>`;
            }

            // Inyectamos el botón oculto en el contenedor del texto
            const descContenedor = document.getElementById('act-desc').parentNode;
            descContenedor.insertAdjacentHTML('beforeend', btnSiguienteHtml);
            
            // Exponemos la función a nivel global para que el script de verificación la pueda usar
            window.mostrarBotonSiguiente = function() {
                const btn = document.getElementById('btn-siguiente');
                if (btn) btn.style.display = 'inline-block'; // Lo hacemos visible
            };
        }

    } else {
        const titulo = document.getElementById('act-titulo');
        if(titulo) titulo.innerText = "Modo Libre";
        
        const desc = document.getElementById('act-desc');
        if(desc) desc.innerText = "Dibuja lo que quieras usando los bloques.";
    }
});