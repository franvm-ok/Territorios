// firebase.js (VERSIÓN ESTABLE PARA GITHUB PAGES)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

/* Realtime Database */
import { 
  getDatabase, ref, set, push, update, onValue 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* Storage (si luego lo usás) */
import { 
  getStorage, ref as sRef, uploadBytes, getDownloadURL, listAll 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

/* =============================
   CONFIGURACIÓN DE TU PROYECTO
   ============================= */
const firebaseConfig = {
  apiKey: "AIzaSyBQdOIpv75AblS5i61eIq2YBBDEO-YfVuk",
  authDomain: "territorio-3c28d.firebaseapp.com",
  databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com",
  projectId: "territorio-3c28d",
  storageBucket: "territorio-3c28d.appspot.com",
  messagingSenderId: "170925082008",
  appId: "1:170925082008:web:edccd36a72b5b2d3bd57ed"
};

/* =============================
   INICIALIZAR FIREBASE
   ============================= */
const app = initializeApp(firebaseConfig);

/* =============================
   SERVICIOS
   ============================= */
const db = getDatabase(app);
const storage = getStorage(app);

/* =============================
   EXPORTAR
   ============================= */
export { db, ref, set, push, update, onValue };
export { storage, sRef, uploadBytes, getDownloadURL, listAll };