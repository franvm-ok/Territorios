// Variable para apuntar al contenedor principal de la aplicación
const contenido = document.getElementById('contenido');

// --- 1. FUNCIÓN PARA EL BOTÓN "TERRITORIO" (Con 32 Tarjetas) ---
function mostrarTerritorios() {
    let htmlTarjetas = '<h2>Selección de Territorio (32 Tarjetas)</h2><div class="grid-territorios">';
    
    // Genera las 32 tarjetas
    for (let i = 1; i <= 32; i++) {
        htmlTarjetas += `
            <div class="tarjeta-territorio" onclick="seleccionarTerritorio(${i})">
                T-${i}
                <span>Estado: Disponible</span>
            </div>
        `;
    }

    htmlTarjetas += '</div>';
    
    // Inserta el código HTML en el área de contenido
    contenido.innerHTML = htmlTarjetas;
}

// Función que se ejecuta al hacer clic en una tarjeta (por ahora solo muestra un mensaje)
function seleccionarTerritorio(numero) {
    alert(`Has seleccionado el Territorio T-${numero}. Aquí se abrirá el formulario de reporte.`);
}


// --- 2. FUNCIÓN PARA EL BOTÓN "REPORTE DE TERRITORIO" ---
function mostrarReporte() {
    // Aquí puedes poner el formulario o la tabla para reportar
    contenido.innerHTML = `
        <h2>📝 Formulario de Reporte de Territorio</h2>
        <p>Próximamente: Se cargará una interfaz para ingresar las fechas de salida y retorno del territorio.</p>
        <form style="padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <label for="numTerr">Número de Territorio:</label><br>
            <input type="number" id="numTerr" name="numTerr" style="width: 100%; padding: 8px; margin-bottom: 10px;" required><br>
            
            <label for="fechaSalida">Fecha de Salida:</label><br>
            <input type="date" id="fechaSalida" name="fechaSalida" style="width: 100%; padding: 8px; margin-bottom: 20px;" required><br>
            
            <button type="submit" style="background-color: #28a745;">Guardar Reporte</button>
        </form>
    `;
}

// --- 3. FUNCIÓN PARA LOS BOTONES "PRÓXIMAMENTE" ---
function mostrarProximamente(nombre) {
    contenido.innerHTML = `
        <h2>${nombre}</h2>
        <p>🛠️ Esta función está en desarrollo. Pronto estará disponible para la Congregación Cuatro Plazas.</p>
    `;
}
