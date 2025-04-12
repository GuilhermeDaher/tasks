import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZ1yQq4DRo2VRwNSyXMex30XKi3Z2814g",
  authDomain: "tarefasplus-63a84.firebaseapp.com",
  projectId: "tarefasplus-63a84",
  storageBucket: "tarefasplus-63a84.firebasestorage.app",
  messagingSenderId: "38709243001",
  appId: "1:38709243001:web:37b11b0deb018f46e6f8a8"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export {db};