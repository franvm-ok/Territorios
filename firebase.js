// firebase.js (para toda la app)

// Importar Firebase (V12.6.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { 
    getDatabase, ref, set, push, update, onValue 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Configuración del proyecto
const firebaseConfig = {
    apiKey: "AIzaSyBQdOIpv75AblS5i61eIq2YBBDEO-YfVuk",
    authDomain: "territorio-3c28d.firebaseapp.com",
    databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com",
    projectId: "territorio-3c28d",
    storageBucket: "territorio-3c28d.firebasestorage.app",
    messagingSenderId: "170925082008",
    appId: "1:170925082008:web:edccd36a72b5b2d3bd57ed",
    measurementId: "G-ZL63C8VN36"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);

// Exportar funciones útiles
export { ref, set, push, update, onValue };