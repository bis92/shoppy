import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, child, ref, set, get, push, update, runTransaction, remove  } from "firebase/database";

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

export const getCarts = async (userId) => {
  const dbRef = ref(getDatabase());
  return get(child(dbRef, `user-cart/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

export const addCart = async (id, imgURL, name, size, price, userId) => {

  const db = getDatabase();
  const postData = {
    productId: id,
    imgURL,
    name,
    size,
    price,
    userId,
    count: 1
  };

  try {
    const newPostKey = push(child(ref(db), 'carts')).key;
    const updates = {};
    updates['/user-cart/' + userId + '/' + newPostKey] = postData;
  
    const userCarts = await getCarts(userId);
    if(userCarts){
      const arrayUserCarts = Object.values(userCarts); 
      if(arrayUserCarts && arrayUserCarts.length > 0 && arrayUserCarts.some((cartItem) => ((cartItem.productId === id) && (cartItem.size === size)))){
        return {
          status: 400,
          message: '상품이 이미 장바구니에 있습니다.'
        }
      }
    }
    await update(ref(db), updates);
    return {
      status: 200,
      message: '상품을 장바구니에 등록했습니다. :)'
    }
  } catch(err) {
    console.error('add cart firebase api err: ', err);
    throw err;
  }
}


export const removeCartItem = (userId, cartId) => {
  const db = getDatabase();
  remove(ref(db, `/user-cart/${userId}/${cartId}`))
  .then((res) => {
    // Data saved successfully!
    console.log(res);
  })
  .catch((error) => {
    // The write failed...
    console.error(error);
  });
}

export const updateCartCount = (userId, cartId, variable) => {
  const db = getDatabase();
  const postRef = ref(db, `/user-cart/${userId}/${cartId}`);
  try {
    runTransaction(postRef, (cart) => {
      if (cart) {
        if (variable === 'increase') {
          cart.count++;
        } else {
          cart.count--;
        }
      }
      return cart;
    });
  } catch(err) {
    console.error(err);
  }

}

// export const updateCart = (userId, cartId, cart) => {
//   const db = getDatabase();
//   set(ref(db, `/user-cart/${userId}/${cartId}`), {
//     cart
//   })
//   .then((res) => {
//     // Data saved successfully!
//     console.log(res);
//   })
//   .catch((error) => {
//     // The write failed...
//     console.error(error);
//   });
// }