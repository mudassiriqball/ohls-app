import Firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDHAKPbwv-8KGhbJKvGNENHMmQje6RvONw",
    authDomain: "olhs-2693e.firebaseapp.com",
    projectId: "olhs-2693e",
    storageBucket: "olhs-2693e.appspot.com",
    messagingSenderId: "433308480952",
    appId: "1:433308480952:web:58e49e8bbed8a7aea78b4d",
    measurementId: "G-4KDM429Z7Z",
    databaseURL: 'https://olhs-2693e-default-rtdb.firebaseio.com/'
};

if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
} else {
    Firebase.app(); // if already initialized, use that one
}

export default Firebase;
