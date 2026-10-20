/* #RetoMenteMilenial · «Continuar con Google» con Firebase Authentication.
   Solo se carga cuando la persona toca el botón. Devuelve un pase (idToken) que el Apps Script verifica con Google.
   No dejamos la sesión de Firebase abierta: la app usa su propia sesión del reto. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCrTvGqgL9Nu0IqLKAYDKTCxW614Ug8yUg',
  authDomain: 'rcf-app-34afa.firebaseapp.com',
  projectId: 'rcf-app-34afa',
  storageBucket: 'rcf-app-34afa.firebasestorage.app',
  messagingSenderId: '896518010747',
  appId: '1:896518010747:web:c35c953856154d41bf6fde'
};

let auth;
export async function googleIdToken() {
  if (!auth) { auth = getAuth(initializeApp(firebaseConfig)); auth.languageCode = 'es'; }
  const proveedor = new GoogleAuthProvider();
  proveedor.setCustomParameters({ prompt: 'select_account' });
  const r = await signInWithPopup(auth, proveedor);
  const idToken = await r.user.getIdToken();
  const email = r.user.email;
  signOut(auth).catch(() => {});
  return { idToken, email };
}
