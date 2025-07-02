import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK1EFhR-hCukQtaIp51atV2lzBeNx-ITo",
  authDomain: "cryptoyos-a0e66.firebaseapp.com",
  projectId: "cryptoyos-a0e66",
  storageBucket: "cryptoyos-a0e66.appspot.com", 
  messagingSenderId: "910899320304",
  appId: "1:910899320304:web:4fb01fa68829be9d9eb935"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Códigos de error
function parseAuthError(code) {
  switch (code) {
    case 'auth/user-not-found':
      return "Usuario no registrado.";
    case 'auth/wrong-password':
      return "Contraseña incorrecta.";
    case 'auth/email-already-in-use':
      return "Usuario ya registrado.";
    case 'auth/weak-password':
      return "Tu contraseña debe tener al menos 8 caracteres: Mayuscula, minuscula, numero y simbolo.";
    case 'auth/invalid-email':
      return "Correo electrónico inválido.";
      case 'auth/password-does-not-meet-requirements':
      return "Tu contraseña debe tener al menos 8 caracteres: Mayuscula, minuscula, numero y simbolo.";
      case 'auth/invalid-credential':
      return "Contraseña incorrecta.";
    case 'auth/missing-email':
      return "Ingresa un correo electrónico.";
    case 'auth/internal-error':
      return "Completa todos los campos.";
    default:
      return "Error: " + code;
  }
}


function hashPassword(p) {
  return p; 
}

// Registro
window.register = async function () {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  if (!username || !email || !password) {
    msg.innerText = "Todos los campos son obligatorios.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    // Nombre en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre: username,
      correo: email
    });

    msg.innerText = "Verifica tu correo electrónico antes de iniciar sesión.";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    msg.innerText = " " + parseAuthError(error.code);
  }
}


// Inicio de sesión
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    if (!userCred.user.emailVerified) {
      msg.innerText = " Verifica tu correo antes de continuar.";
      return;
    }
    msg.innerText = " Sesión iniciada correctamente.";
    window.location.href = "home.html";
  } catch (error) {
    msg.innerText = "" + parseAuthError(error.code);
  }
}

// Recuperación
window.recoverPassword = async function () {
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message");

  try {
    await sendPasswordResetEmail(auth, email);
    msg.innerText = " Revisa tu correo para restablecer tu contraseña.";
  } catch (error) {
    msg.innerText = "" + parseAuthError(error.code);
  }
}

// Cambiar contraseña
window.confirmReset = async function () {
  const params = new URLSearchParams(window.location.search);
  const oobCode = params.get('oobCode');
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("message");

  if (!oobCode) {
    msg.innerText = " Código inválido.";
    return;
  }
  if (password !== confirm) {
    msg.innerText = " Las contraseñas no coinciden.";
    return;
  }

  try {
    await confirmPasswordReset(auth, oobCode, password);
    msg.innerText = " Contraseña actualizada.";
    setTimeout(() => window.location.href = "index.html", 2000);
  } catch (error) {
    msg.innerText = " " + parseAuthError(error.code);
  }
}
