// ================================
// CONFIGURACIÓN FIREBASE
// ================================
const DB_URL = "https://territorio-3c28d-default-rtdb.firebaseio.com/";

// ================================
// Datos de territorios y manzanas
// ================================
const territorios = {
    1: ["A", "B", "C", "D"],
    2: ["A", "B", "C", "D"],
    3: ["A", "B", "C", "D"],
    4: ["A", "B", "C", "D", "E"],
    5: ["A","B","C","D","E","F","G","H"]
    // Puedes agregar hasta 32
};

let territorioSeleccionado = null;
let manzanasSeleccionadas = [];

// ================================
// Construir lista de territorios
// ================================
const list = document.getElementById("territorios-list");

Object.keys(territorios).forEach(num => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = "Territorio " + num;
    card.onclick = () => abrirTerritorio(num);
    list.appendChild(card);
});

// ================================
// Pantalla seleccionar manzanas
// ================================
function abrirTerritorio(num) {
    territorioSeleccionado = num;

    document.getElementById("screen-home").classList.remove("active");
    document.getElementById("screen-manzanas").classList.add("active");

    document.getElementById("territorio-title").innerText =
        "Territorio " + num;

    const cont = document.getElementById("manzanas-container");
    cont.innerHTML = "";
    manzanasSeleccionadas = [];

    territorios[num].forEach(m => {
        let c = document.createElement("div");
        c.className = "card";
        c.innerText = "Manzana " + m;

        c.onclick = () => {
            if (manzanasSeleccionadas.includes(m)) {
                manzanasSeleccionadas = manzanasSeleccionadas.filter(x => x !== m);
                c.style.background = "white";
            } else {
                manzanasSeleccionadas.push(m);
                c.style.background = "#c8e6c9";
            }
        };

        cont.appendChild(c);
    });
}

// ================================
// ENVIAR REPORTE
// ================================
function enviarReporte() {
    const conductor = document.getElementById("conductor").value;
    const obs = document.getElementById("observacion").value;

    if (conductor.trim() === "") {
        alert("Debe ingresar el nombre del conductor.");
        return;
    }

    const fecha = new Date().toLocaleDateString();

    const data = {
        territorio: territorioSeleccionado,
        manzanas: manzanasSeleccionadas,
        conductor: conductor,
        fecha: fecha,
        observacion: obs
    };

    // Guardar en Firebase
    fetch(`${DB_URL}/reportes.json`, {
        method: "POST",
        body: JSON.stringify(data)
    });

    // WhatsApp automático al siervo
    const numero = "5493416715020";
    const mensaje =
        `*Reporte de Territorio*\n` +
        `Territorio: ${territorioSeleccionado}\n` +
        `Manzanas: ${manzanasSeleccionadas.join(", ")}\n` +
        `Conductor: ${conductor}\n` +
        `Fecha: ${fecha}\n` +
        `Obs: ${obs}`;

    window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );

    // Ir a pantalla confirmación
    document.getElementById("screen-manzanas").classList.remove("active");
    document.getElementById("screen-confirm").classList.add("active");
}

// ================================
// Volver al inicio
// ================================
function volverHome() {
    document.getElementById("screen-manzanas").classList.remove("active");
    document.getElementById("screen-confirm").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
}
