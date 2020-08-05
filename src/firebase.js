import firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCFNJfMcHbdoAKVVF88d-9POsUgk-C7NKk",
    authDomain: "stvote-b967b.firebaseapp.com",
    databaseURL: "https://stvote-b967b.firebaseio.com",
    projectId: "stvote-b967b",
    storageBucket: "stvote-b967b.appspot.com",
    messagingSenderId: "487837721842",
    appId: "1:487837721842:web:95c0dc83a5eeb46b995c6b"
}

// Initialize Firebase
firebase.initializeApp(config);

export default firebase;