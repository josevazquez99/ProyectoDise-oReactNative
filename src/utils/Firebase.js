import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAop0aw6siAZimmitWRcmyTWku8itujOZU",
    authDomain: "proyectoreactnative-32ccd.firebaseapp.com",
    projectId: "proyectoreactnative-32ccd",
    storageBucket: "proyectoreactnative-32ccd.firebasestorage.app",
    messagingSenderId: "322147099615",
    appId: "1:322147099615:web:809b0fda1ee36ac1311a6a",
    measurementId: "G-F7043HRN6F"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);