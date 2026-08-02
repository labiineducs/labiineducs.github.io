document.addEventListener("DOMContentLoaded", () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const idActividad = parametrosUrl.get('id') || parametrosUrl.get('page');

    if (idActividad && window.dbActividades && window.dbActividades[idActividad]) {
        const act = window.dbActividades[idActividad];
        
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
            // Armamos un botón interactivo usando Bootstrap Collapse
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
            // Le damos un fondo amarillento al contenedor de tips para que resalte como una nota
            tips.style.backgroundColor = "#fff3cd";
            tips.style.borderLeft = "5px solid #ffc107";
            tips.style.display = 'block';
        }
    } else {
        const titulo = document.getElementById('act-titulo');
        if(titulo) titulo.innerText = "Modo Libre";
        
        const desc = document.getElementById('act-desc');
        if(desc) desc.innerText = "Dibuja lo que quieras usando los bloques.";
    }
});