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
  await sendEmailVerification(userCred.user);
msg.innerText = "✅ Cuenta creada. Revisa tu correo.";

setTimeout(() => {
  window.location.href = "index.html";
}, 3000);

}

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

  const newPass = hashPassword(password); // Para práctica

  try {
    await auth.confirmPasswordReset(oobCode, newPass);
    msg.innerText = "✅ Contraseña actualizada.";
    setTimeout(() => window.location.href = "index.html", 2000);
  } catch (error) {
    msg.innerText = "❌ " + error.message;
  }
}


window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");
  const hashedPassword = hashPassword(password);

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, hashedPassword);
    if (!userCred.user.emailVerified) {
      msg.innerText = "⚠️ Verifica tu correo antes de continuar.";
      return;
    }
    msg.innerText = "✅ Sesión iniciada correctamente.";
    window.location.href = "home.html";
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      msg.innerText = "❌ Usuario no registrado.";
    } else if (error.code === 'auth/wrong-password') {
      msg.innerText = "❌ Contraseña incorrecta.";
    } else {
      msg.innerText = "❌ " + error.message;
    }
  }
};

