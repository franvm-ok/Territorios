// firebase.js — configuración única para toda la app (versión corregida y estable)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getDatabase, ref, set, push, update, onValue 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { 
  getStorage, ref as sRef, uploadBytes, getDownloadURL, listAll 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// -----------------------------
// Configuración de Firebase
// -----------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBQdOIpv75AblS5i61eIq2YBBDEO-YfVuk",
  authDomain: "territorio-3c28d.firebaseapp.com",
  databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com",
  projectId: "territorio-3c28d",
  storageBucket: "territorio-3c28d.appspot.com",
  messagingSenderId: "170925082008",
  appId: "1:170925082008:web:edccd36a72b5b2d3bd57ed"
};

// -----------------------------
// Inicializar Firebase SIN analytics (evita errores invisibles)
// -----------------------------
const app = initializeApp(firebaseConfig);

// -----------------------------
// Servicios principales
// -----------------------------
const db = getDatabase(app);
const storage = getStorage(app);

// -----------------------------
// Exportar API estable
// -----------------------------
export { db, ref, set, push, update, onValue };
export { storage, sRef, uploadBytes, getDownloadURL, listAll };