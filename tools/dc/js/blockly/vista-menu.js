document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('contenedor-actividades');
    if (!contenedor) return;

    let htmlTarjetas = "";

    // 1. Tarjeta Fija: Modo Libre (Apunta a la página sin ID)
    htmlTarjetas += `
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
    `;

    // 2. Tarjetas Dinámicas: Base de Datos
    if (window.dbActividades) {
        for (const [id, act] of Object.entries(window.dbActividades)) {
            // Si la actividad tiene imagen la usamos, si no, ponemos un emoji de pieza de rompecabezas
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
                            <a href="actividad-bloques.html?id=${id}" class="btn btn-warning mt-3 w-100" style="border-radius: 20px; font-weight: 600; color: #333;">Comenzar Desafío</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Inyectamos todo el HTML de golpe
    contenedor.innerHTML = htmlTarjetas;

    // Agregamos un pequeño efecto hover con JS para no ensuciar el CSS global
    const tarjetas = document.querySelectorAll('.card-actividad');
    tarjetas.forEach(t => {
        t.addEventListener('mouseenter', () => t.style.transform = 'translateY(-5px)');
        t.addEventListener('mouseleave', () => t.style.transform = 'translateY(0)');
    });
});