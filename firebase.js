// firebase.js (VERSIÓN ESTABLE PARA GITHUB PAGES)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

/* =============================
   REALTIME DATABASE
   ============================= */
import { 
  getDatabase,
  ref as dbRef,
  set,
  push,
  update,
  onValue,
  remove     // ✅ AGREGADO
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

/* =============================
   STORAGE
   ============================= */
import { 
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

/* =============================
   CONFIGURACIÓN
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
   INICIALIZAR
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
export { 
  db, 
  dbRef as ref,
  set, 
  push, 
  update,
  remove,     // ✅ EXPORTADO
  onValue,
  storage,
  storageRef as sRef,
  uploadBytes,
  getDownloadURL,
  listAll
};