import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, child, ref, set, get, push } from "firebase/database";

const { 
    REACT_APP_API_KEY, 
    REACT_APP_AUTH_DOMAIN, 
    REACT_APP_DATABASE_URL, 
    REACT_APP_PROJECT_ID, 
    REACT_APP_STORAGE_BUCKET, 
    REACT_APP_MESSAGING_SENDER_ID, 
    REACT_APP_APP_ID, 
    REACT_APP_MEASUREMENT_ID 
} = process.env

const firebaseConfig = {
    apiKey: REACT_APP_API_KEY,
    authDomain: REACT_APP_AUTH_DOMAIN,
    databaseURL: REACT_APP_DATABASE_URL,
    projectId: REACT_APP_PROJECT_ID,
    storageBucket: REACT_APP_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
    appId: REACT_APP_APP_ID,
    measurementId: REACT_APP_MEASUREMENT_ID
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function readUserData(userId) {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
          return ''
        }
      }).catch((error) => {
        console.error(error);
      });
}

function writeUserData(userId, name, email, imageUrl) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture : imageUrl,
      created_at: new Date().toISOString()
    });
  }

export const googleLogin = async () => {
    return signInWithPopup(auth, provider)
    .then(async(result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const { uid, displayName, email, photoURL } = user;
        const isUser = await readUserData(uid);
        !isUser && writeUserData(uid, displayName, email, photoURL)
        return user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export const googleLogout = async () => {
    const auth = getAuth();
    return signOut(auth).then(() => {
        return null;
    }).catch((error) => {
        console.log('googleLogout error: ', error);
        throw error;
    });
}

export const onAuthStateCheck = async () => {
    const auth = getAuth();
    const unsubscribe =  await onAuthStateChanged(auth, (user) => {
    if (user) {
        return user;
    } else {
        return null;
    }
    });
    return unsubscribe();
}

export const addProduct = async ({ name, price, category, description ,option }, productId, imgURL) => {
  const db = getDatabase();
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);
  set(newProductRef, {
    id: productId,
    imgURL,
    name,
    price,
    category,
    description,
    option
  });
}

export const getProducts = async () => {
  const dbRef = ref(getDatabase());
  return await get(child(dbRef, 'products')).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
