

// import app from "./firebase"
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { setPersistence,browserLocalPersistence } from "firebase/auth";
import axios from "axios";


export const Navbar =  () =>{
    const provider = new GoogleAuthProvider()
    



const firebaseConfig = {
    apiKey: "AIzaSyA2LZ8B7DN2BrZBXL9s92hx4RRdtWEkGpg",
    authDomain:"calorie-counter-b5889.firebaseapp.com",
    projectId: "calorie-counter-b5889",
    storageBucket: "calorie-counter-b5889.appspot.com",
    messagingSenderId: "42681539056",
    appId: "1:42681539056:web:dd1ccdb2d67d270fcb2535"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  const [user, setUser] = useState(null);
  const [userId,setUserId] = useState(null)
  const [calories,setCalories] = useState(null)

  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          setUserId(user.uid)
          setUser(user)

        } else {
          // User is signed out
          console.log('User is signed out');
        }
      });
      
    }, []);

    useEffect(() =>{
        const fetchCal = async () =>{
  
            try{
                const response = await axios.post('http://localhost:3000/userCalorie', {uid: userId });
                // const data = response.json();    
            }
            catch(error){
                console.log(error)
            }
        }

          fetchCal(); // Only fetch when uid is available
        
    },[user])
    const handleLogin = () => {
    // const auth = getAuth(app);
    const signIn = async () => {
      try {
        const userCred = await signInWithPopup(auth, provider);

        setPersistence(auth,browserLocalPersistence)
        setUser(userCred.user);
      } catch (error) {
        console.error(error);
      }
    };
    
    signIn(); 
};
    
    return (
        <div className="Nav">

            <div>Logo</div>
            {user ? <img src={user?.photoURL}></img>:<button className="Nav-Auth" onClick={handleLogin}>Login With Google</button>}
            
        </div>
    )
}