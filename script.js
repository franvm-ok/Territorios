// Obtiene el botón y el párrafo por su ID
const boton = document.getElementById('miBoton');
const mensaje = document.getElementById('mensaje');

// Añade un "escuchador" de eventos al botón: cuando se hace clic...
boton.addEventListener('click', () => {
    // 1. Cambia el texto del párrafo
    mensaje.textContent = '¡El botón ha sido presionado exitosamente!';
    
    // 2. Muestra una alerta (opcional)
    alert('Has interactuado con la aplicación.');
});
