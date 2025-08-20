// services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Reemplaza esto con la configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTArdg9G_RZebEAha1fUkEPr6LaGRSof8",
  authDomain: "telecor-pjs-16c86.firebaseapp.com",
  projectId: "telecor-pjs-16c86",
  storageBucket: "telecor-pjs-16c86.firebasestorage.app",
  messagingSenderId: "964703043238",
  appId: "1:964703043238:web:92ab526843e8878ec83e67",
  measurementId: "G-5WMJ35FD8N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la instancia de Firestore para usarla en la app
export const db = getFirestore(app);