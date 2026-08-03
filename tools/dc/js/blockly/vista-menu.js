document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('contenedor-actividades');
    if (!contenedor) return;

    let htmlTarjetas = "";

    // 1. ZONA DINÁMICA: Renderizado por Cuadernos
    if (window.dbCuadernos) {
        for (const [idCuaderno, cuaderno] of Object.entries(window.dbCuadernos)) {
            
            // Inyectamos el Encabezado del Cuaderno
            htmlTarjetas += `
                <div class="w-100 mb-4 mt-2">
                    <h3 style="font-weight: 700; color: #212529; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">${cuaderno.titulo}</h3>
                    ${cuaderno.descripcion ? `<p class="text-muted" style="font-size: 1.1em;">${cuaderno.descripcion}</p>` : ''}
                </div>
                <div class="row mb-5">
            `;

            // Iteramos sobre las actividades DENTRO de este cuaderno
            for (const [idAct, act] of Object.entries(cuaderno.actividades)) {
                const visual = act.imagen 
                    ? `<div style="height: 160px; background: #fff; display: flex; align-items: center; justify-content: center; border-top-left-radius: 15px; border-top-right-radius: 15px; border-bottom: 1px solid #f0f0f0;"><img src="${act.imagen}" alt="${act.titulo}" style="max-height: 100px; max-width: 100%; object-fit: contain;"></div>`
                    : `<div style="height: 160px; background: #e9ecef; display: flex; align-items: center; justify-content: center; font-size: 4rem; border-top-left-radius: 15px; border-top-right-radius: 15px;">🧩</div>`;

                htmlTarjetas += `
                    <div class="col-md-4 mb-4">
                        <div class="card card-actividad h-100 shadow-sm" style="border: none; border-radius: 15px; transition: transform 0.2s;">
                            ${visual}
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title" style="font-weight: 700; color: #333;">${act.titulo}</h5>
                                <p class="card-text text-muted flex-grow-1">${act.descripcion}</p>
                                <a href="actividad-bloques.html?id=${idCuaderno}-${idAct}" class="btn btn-warning mt-3 w-100" style="border-radius: 20px; font-weight: 600; color: #333;">Comenzar Desafío</a>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Cerramos la fila (row) del cuaderno actual
            htmlTarjetas += `</div>`;
        }

         // 2. ZONA FIJA: Modo Libre (Aislado de los cuadernos)
        htmlTarjetas += `
            <div class="w-100 mb-4">
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

    }

    // Volcamos todo al DOM
    contenedor.innerHTML = htmlTarjetas;

    // Efecto Hover
    const tarjetas = document.querySelectorAll('.card-actividad');
    tarjetas.forEach(t => {
        t.addEventListener('mouseenter', () => t.style.transform = 'translateY(-5px)');
        t.addEventListener('mouseleave', () => t.style.transform = 'translateY(0)');
    });
});