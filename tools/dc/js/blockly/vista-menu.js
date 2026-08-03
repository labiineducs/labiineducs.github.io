document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('contenedor-actividades');
    if (!contenedor) return;

    let htmlTarjetas = "";
    
    // Leemos el progreso guardado
    let completadas = JSON.parse(localStorage.getItem('labiin_progreso')) || [];

    if (window.dbCuadernos) {
        for (const [idCuaderno, cuaderno] of Object.entries(window.dbCuadernos)) {
            
            const idCollapse = "collapse-" + idCuaderno;

            htmlTarjetas += `
                <div class="w-100 mb-3 mt-2" style="cursor: pointer;" data-toggle="collapse" data-target="#${idCollapse}">
                    <div class="d-flex justify-content-between align-items-center" style="border-bottom: 2px solid #dee2e6; padding-bottom: 10px; transition: color 0.2s;" onmouseover="this.style.color='#f8b400'" onmouseout="this.style.color='inherit'">
                        <h3 style="font-weight: 700; margin: 0;">${cuaderno.titulo}</h3>
                        <span style="font-size: 1.2rem; color: #6c757d;">🔽 Ver actividades </span>
                    </div>
                    ${cuaderno.descripcion ? `<p class="text-muted mt-2" style="font-size: 1.1em;">${cuaderno.descripcion}</p>` : ''}
                </div>
                
                <div class="collapse" id="${idCollapse}">
                    <div class="row mb-5 pt-3">
            `;

            // Ordenamos las actividades para asegurar que la 1 va antes que la 2
            const idsActividades = Object.keys(cuaderno.actividades).sort((a,b) => parseInt(a) - parseInt(b));

            for (let i = 0; i < idsActividades.length; i++) {
                const idAct = idsActividades[i];
                const act = cuaderno.actividades[idAct];
                const idCompuesto = idCuaderno + "-" + idAct;
                
                // LÓGICA DE BLOQUEO
                let desbloqueada = true;
                if (i > 0) { // Si no es la primera actividad...
                    const idAnterior = idCuaderno + "-" + idsActividades[i-1];
                    desbloqueada = completadas.includes(idAnterior); // Se desbloquea solo si la anterior está completada
                }
                const yaCompletada = completadas.includes(idCompuesto);

                // Diseño visual según el estado
                if (desbloqueada) {
                    const visual = act.imagen 
                        ? `<div style="height: 160px; background: #fff; display: flex; align-items: center; justify-content: center; border-top-left-radius: 15px; border-top-right-radius: 15px; border-bottom: 1px solid #f0f0f0;"><img src="${act.imagen}" alt="${act.titulo}" style="max-height: 100px; max-width: 100%; object-fit: contain;"></div>`
                        : `<div style="height: 160px; background: #e9ecef; display: flex; align-items: center; justify-content: center; font-size: 4rem; border-top-left-radius: 15px; border-top-right-radius: 15px;">🧩</div>`;
                    
                    const textoBoton = yaCompletada ? "✅ Volver a jugar" : "Comenzar Desafío";
                    const colorBoton = yaCompletada ? "btn-outline-success" : "btn-warning";

                    htmlTarjetas += `
                            <div class="col-md-4 mb-4">
                                <div class="card card-actividad h-100 shadow-sm" style="border: none; border-radius: 15px; transition: transform 0.2s;">
                                    ${visual}
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title" style="font-weight: 700; color: #333;">${act.titulo}</h5>
                                        <p class="card-text text-muted flex-grow-1">${act.descripcion}</p>
                                        <a href="actividad-bloques.html?id=${idCompuesto}" class="btn ${colorBoton} mt-3 w-100" style="border-radius: 20px; font-weight: 600; color: #333;">${textoBoton}</a>
                                    </div>
                                </div>
                            </div>
                    `;
                } else {
                    // TARJETA BLOQUEADA (Candado, gris, sin enlace)
                    htmlTarjetas += `
                            <div class="col-md-4 mb-4">
                                <div class="card h-100 shadow-sm" style="border: none; border-radius: 15px; background-color: #f8f9fa; opacity: 0.7;">
                                    <div style="height: 160px; background: #e2e3e5; display: flex; align-items: center; justify-content: center; font-size: 4rem; border-top-left-radius: 15px; border-top-right-radius: 15px; color: #6c757d;">
                                        🔒
                                    </div>
                                    <div class="card-body d-flex flex-column">
                                        <h5 class="card-title" style="font-weight: 700; color: #6c757d;">${act.titulo}</h5>
                                        <p class="card-text text-muted flex-grow-1">Completa el desafío anterior para desbloquear.</p>
                                        <button disabled class="btn btn-secondary mt-3 w-100" style="border-radius: 20px; font-weight: 600;">Bloqueado</button>
                                    </div>
                                </div>
                            </div>
                    `;
                }
            }

            htmlTarjetas += `
                    </div>
                </div>
            `;
        }
    }

    // 2. ZONA FIJA: Espacio Creativo
    htmlTarjetas += `
        <div class="w-100 mb-4 mt-4">
            <h3 style="font-weight: 700; color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Espacio Creativo</h3>
        </div>
        <div class="row mb-5">
            <div class="col-md-4 mb-4">
                <div class="card card-actividad h-100 shadow-sm" style="border: none; border-radius: 15px; transition: transform 0.2s;">
                    <div style="height: 160px; background: #e9ecef; display: flex; align-items: center; justify-content: center; font-size: 4rem; border-top-left-radius: 15px; border-top-right-radius: 15px;">
                        🎨
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" style="font-weight: 700; color: #333;">Dibujo Libre</h5>
                        <p class="card-text text-muted flex-grow-1">Lienzo en blanco. Usa todos los bloques disponibles para crear tu propio dibujo sin restricciones.</p>
                        <a href="actividad-bloques.html" class="btn btn-dark mt-3 w-100" style="border-radius: 20px; font-weight: 600;">Crear desde cero</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    contenedor.innerHTML = htmlTarjetas;

    const tarjetas = document.querySelectorAll('.card-actividad');
    tarjetas.forEach(t => {
        t.addEventListener('mouseenter', () => t.style.transform = 'translateY(-5px)');
        t.addEventListener('mouseleave', () => t.style.transform = 'translateY(0)');
    });
});