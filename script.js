// Definición de los datos de los territorios
const territorios = [
    {
        numero: 1,
        barrio: "Centro",
        callesClave: "Av. Principal, Calle 15",
        estado: "Disponible", // Puede ser 'Disponible', 'En trabajo', 'Asignado'
        asignadoA: null
    },
    {
        numero: 2,
        barrio: "Las Acacias",
        callesClave: "Los Álamos, Las Flores",
        estado: "En trabajo",
        asignadoA: "Hermano Pérez"
    },
    {
        numero: 3,
        barrio: "San Blas",
        callesClave: "Ruta Nacional, Pasaje 8",
        estado: "Disponible",
        asignadoA: null
    },
    {
        numero: 4,
        barrio: "Villa Céntrica",
        callesClave: "Plaza Central, Bv. Libertad",
        estado: "Asignado",
        asignadoA: "Familia García"
    }
    // Añade más territorios aquí...
];

// --- FUNCIONALIDAD PARA MOSTRAR LOS TERRITORIOS ---

const listaTerritorios = document.getElementById('listaTerritorios');
const inputBusqueda = document.getElementById('inputBusqueda');

function renderizarTerritorios(data) {
    // Limpia la lista anterior
    listaTerritorios.innerHTML = ''; 

    data.forEach(territorio => {
        const estadoClase = territorio.estado.toLowerCase().replace(' ', '-');
        
        const elemento = document.createElement('li');
        elemento.classList.add('territorio-item', estadoClase);
        
        elemento.innerHTML = `
            <div class="num-estado">
                <span class="numero">T-${territorio.numero}</span>
                <span class="estado ${estadoClase}">${territorio.estado}</span>
            </div>
            <div class="detalle">
                <strong>Barrio:</strong> ${territorio.barrio} (${territorio.callesClave})
                ${territorio.asignadoA ? `— Asignado a: ${territorio.asignadoA}` : ''}
            </div>
        `;
        listaTerritorios.appendChild(elemento);
    });
}

// Implementación del buscador/filtro
inputBusqueda.addEventListener('keyup', (e) => {
    const busqueda = e.target.value.toLowerCase();
    const resultados = territorios.filter(t => 
        t.barrio.toLowerCase().includes(busqueda) ||
        t.callesClave.toLowerCase().includes(busqueda) ||
        String(t.numero).includes(busqueda)
    );
    renderizarTerritorios(resultados);
});

// Renderiza todos los territorios al cargar la página
window.onload = () => {
    renderizarTerritorios(territorios);
};
