import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import firebaseConfig from '@/js/config/firebase.json';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;

export const auth = firebase.auth();
export const database = firebase.firestore();
export { messaging };
