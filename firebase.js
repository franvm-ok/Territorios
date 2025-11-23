// CONFIG DE TU FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAbAnz0hAHwttGtoDPjSzSgiJ9HP1wz-YY",
  authDomain: "territorio-3c28d.firebaseapp.com",
  databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com/",
  projectId: "territorio-3c28d",
  storageBucket: "territorio-3c28d.appspot.com",
  messagingSenderId: "369901367983",
  appId: "1:369901367983:web:33237b1b5661b82023a763"
};

// INICIALIZA FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Guarda un reporte
function guardarReporte(data) {
  return db.ref("reportes").push(data);
}

// Escucha reportes en tiempo real
function escucharReportes(callback) {
  db.ref("reportes").on("value", snapshot => {
    callback(snapshot.val());
  });
}
