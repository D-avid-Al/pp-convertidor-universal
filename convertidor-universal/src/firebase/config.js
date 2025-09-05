import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    // Configuración para convertidor-universal-ag
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Necesitas obtener esta clave
    authDomain: "convertidor-universal-ag.firebaseapp.com",
    projectId: "convertidor-universal-ag",
    storageBucket: "convertidor-universal-ag.appspot.com",
    messagingSenderId: "XXXXXXXXXX", // Necesitas obtener este ID
    appId: "1:XXXXXXXXXX:web:XXXXXXXXXXXXXXXX", // Necesitas obtener este ID
    databaseURL: "https://convertidor-universal-ag-default-rtdb.firebaseio.com/"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Inicializar servicios
export const db = getFirestore(app)
export const auth = getAuth(app)
export const realtimeDb = getDatabase(app)
export default app
