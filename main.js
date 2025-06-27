import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK1EFhR-hCukQtaIp51atV2lzBeNx-ITo",
  authDomain: "cryptoyos-a0e66.firebaseapp.com",
  projectId: "cryptoyos-a0e66",
  storageBucket: "cryptoyos-a0e66.appspot.com", // <-- esto estaba mal
  messagingSenderId: "910899320304",
  appId: "1:910899320304:web:4fb01fa68829be9d9eb935"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para traducir códigos de error
function parseAuthError(code) {
  switch (code) {
    case 'auth/user-not-found':
      return "Usuario no registrado.";
    case 'auth/wrong-password':
      return "Contraseña incorrecta.";
    case 'auth/email-already-in-use':
      return "Usuario ya registrado.";
    case 'auth/weak-password':
      return "Tu contraseña debe tener al menos 6 caracteres.";
    case 'auth/invalid-email':
      return "Correo electrónico inválido.";
    case 'auth/missing-email':
      return "Ingresa un correo electrónico.";
    case 'auth/internal-error':
      return "Completa todos los campos.";
    default:
      return "Error: " + code;
  }
}

// 🚨 Simulación de hash (debes reemplazarlo si usas hashing real)
function hashPassword(p) {
  return p; // ← Por ahora, usa sin hash para que Firebase funcione bien
}

// Función de registro
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    msg.innerText = "✅ Verifica tu correo electrónico antes de iniciar sesión.";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } catch (error) {
    msg.innerText = "❌ " + parseAuthError(error.code);
  }
}

// Función de inicio de sesión
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    if (!userCred.user.emailVerified) {
      msg.innerText = "⚠️ Verifica tu correo antes de continuar.";
      return;
    }
    msg.innerText = "✅ Sesión iniciada correctamente.";
    window.location.href = "home.html";
  } catch (error) {
    msg.innerText = "❌ " + parseAuthError(error.code);
  }
}

// Función para enviar email de recuperación
window.recoverPassword = async function () {
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message");

  try {
    await sendPasswordResetEmail(auth, email);
    msg.innerText = "✅ Revisa tu correo para restablecer tu contraseña.";
  } catch (error) {
    msg.innerText = "❌ " + parseAuthError(error.code);
  }
}

// Función para confirmar recuperación y cambiar la contraseña
window.confirmReset = async function () {
  const params = new URLSearchParams(window.location.search);
  const oobCode = params.get('oobCode');
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("message");

  if (!oobCode) {
    msg.innerText = "⚠️ Código inválido.";
    return;
  }
  if (password !== confirm) {
    msg.innerText = "⚠️ Las contraseñas no coinciden.";
    return;
  }

  try {
    await confirmPasswordReset(auth, oobCode, password);
    msg.innerText = "✅ Contraseña actualizada.";
    setTimeout(() => window.location.href = "index.html", 2000);
  } catch (error) {
    msg.innerText = "❌ " + parseAuthError(error.code);
  }
}
