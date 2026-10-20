/* #RetoMenteMilenial · avisos (notificaciones). Solo se carga cuando la persona activa los avisos.
   El permiso del teléfono se pide antes, en app.js, justo al tocar el botón (Safari lo exige así).
   Firebase entrega el «token» del teléfono; el aviso lo muestra nuestro sw.js. */
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getMessaging, getToken, isSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js';

const VAPID = 'BOKhyVOdxyz-rzSUf7wa-M8treTCD_H6Ih9rxv6Kn6DiE1APpQlRESMianHTUABCeGMl6q3oWFYIBQ87eePNfJQ';
const firebaseConfig = {
  apiKey: 'AIzaSyCrTvGqgL9Nu0IqLKAYDKTCxW614Ug8yUg',
  authDomain: 'rcf-app-34afa.firebaseapp.com',
  projectId: 'rcf-app-34afa',
  storageBucket: 'rcf-app-34afa.firebasestorage.app',
  messagingSenderId: '896518010747',
  appId: '1:896518010747:web:c35c953856154d41bf6fde'
};

export async function tokenAvisos() {
  if (!(await isSupported())) throw new Error('no');
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const registro = await navigator.serviceWorker.ready;
  const token = await getToken(getMessaging(app), { vapidKey: VAPID, serviceWorkerRegistration: registro });
  if (!token) throw new Error('sin token');
  return token;
}
