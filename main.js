import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Tu configuración personalizada de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAK1EFhR-hCukQtaIp51atV2lzBeNx-ITo",
  authDomain: "cryptoyos-a0e66.firebaseapp.com",
  projectId: "cryptoyos-a0e66",
  storageBucket: "cryptoyos-a0e66.firebasestorage.app",
  messagingSenderId: "910899320304",
  appId: "1:910899320304:web:4fb01fa68829be9d9eb935"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Referencias DOM
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

window.register = async function () {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    message.innerText = "✅ Verifica tu correo electrónico antes de iniciar sesión.";
  } catch (error) {
    message.innerText = "⚠️ " + error.message;
  }
}

window.login = async function () {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user.emailVerified) {
      window.location.href = "home.html";
    } else {
      message.innerText = "⚠️ Tu correo no está verificado aún.";
    }
  } catch (error) {
    message.innerText = "⚠️ " + error.message;
  }
}
