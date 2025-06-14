// Firebase Use Instructions //
// 1. Import the following:
//      import { useAuthState } from "react-firebase-hooks/auth";
//      import Firebase from "../Firebase";
// 2. Paste the below stateful variable into the component to keep track of state of authentication
//      const [user, loading, error] = useAuthState(Firebase.auth);
//      => User - truthy if logged in, falsy if logged out
//      => Loading - truthy if loading
//      => Error - truthy if error
// 3. Use the following UseEffect to code your redirects if logged in/out
//      React.useEffect(() => {
//        if (!user){
//          //do something
//        }
//      }, [user, loading]);
// 4. Use Firebase.<NAME_OF_FUNCTION> to call functions from this file
//      E.g.: Firebase.createUser(email, password)
// 5. Use User.uid (from the User stateful variable) to get the user's unique ID from Firebase

import config from "./config.js";
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider, getAuth, linkWithPopup, signInWithPopup, signInWithEmailAndPassword,
        createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
        getIdToken } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";

// Set config 
const firebaseConfig = config;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
auth.useDeviceLanguage();

export const storage = getStorage(app);

// Firebase functions
const createUser = async (email, password) => {
  console.log("Attempting to register a new user...");
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((res)=> {
        const user = res.user;
        resolve(
          addDoc(collection(db, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "local",
            email,
          })
        );      
      }).catch(err => {
        console.log('Error caught: ' + err.message);
        reject(err.code);
      });
  });
}

const signInWithEmailPassword = (email, password) => {
  console.log("Attempting to sign in...");
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential.user);
      }).catch(err => {
        console.log('Error caught: ' + err.message);
        reject(err.code);
      });
  });
};

const logout = () => signOut(auth);

const passwordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Email with password reset link sent!");
  } catch (err) {
    console.log('Error caught:', err.message, 'with code: ', err.code);
    alert(err.message);
  };
};

const doGetIdToken = () => {
  return getIdToken(auth.currentUser, /* forceRefresh */ false);
};

const signInWithGoogle = async () => {
  console.log("Attempting to sign in with Google...");
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    if (err.code === "auth/account-exists-with-different-credential") {
      alert("An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.");
    } else if (err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-closed-by-user") {
      console.log("Popup closed");
      throw new Error("Popup closed");
    } else {
      console.log('Error caught:', err.message, 'with code: ', err.code);
    };
  }
};



// const connectGoogleAccount = () => {
//   console.log("Attempting to link Google account...");
//   linkWithPopup(auth.currentUser, googleProvider).then((result) => {
//     // Accounts successfully linked
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const user = result.user;
//     // ...
//   }).catch((error) => {
//     console.log("Error caught:", error.message, 'with code: ', error.code);
//     throw new Error("Error linking Google account");
//   });
// };

export {auth, db, doGetIdToken,
  createUser, signInWithEmailPassword, logout, passwordReset,
  signInWithGoogle
};
