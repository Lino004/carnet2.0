import firebase from 'firebase'

let config = {
  apiKey: 'AIzaSyCVjJEeWJbS51OmOSvGBK3ykW03lZWluU4',
  authDomain: 'carnetdevoyage-2506.firebaseapp.com',
  databaseURL: 'https://carnetdevoyage-2506.firebaseio.com',
  projectId: 'carnetdevoyage-2506',
  storageBucket: 'carnetdevoyage-2506.appspot.com',
  messagingSenderId: '831263262131'
}

firebase.initializeApp(config)

export const db = firebase.database()
export const auth = firebase.auth()
export const storage = firebase.storage()
