// firebase.js DEFINITIVO PARA GITHUB PAGES (ESTABLE)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  listAll
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQdOIpv75AblS5i61eIq2YBBDEO-YfVuk",
  authDomain: "territorio-3c28d.firebaseapp.com",
  databaseURL: "https://territorio-3c28d-default-rtdb.firebaseio.com",
  projectId: "territorio-3c28d",
  storageBucket: "territorio-3c28d.appspot.com",
  messagingSenderId: "170925082008",
  appId: "1:170925082008:web:edccd36a72b5b2d3bd57ed"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export {
  db,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
  storage,
  sRef,
  uploadBytes,
  getDownloadURL,
  listAll
};