
import './App.css'
import { Calories } from './components/Calories'
// import { Navbar } from './components/NavBar'
import { initializeApp } from "firebase/app";
import { setPersistence,browserLocalPersistence } from "firebase/auth";
// import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import Response from './components/Response'
import { useState,useEffect } from 'react';
// import { Route, Routes } from 'react-router-dom';
// import { Favorites } from './components/Favorites';
import { initializeAppCheck,ReCaptchaV3Provider } from 'firebase/app-check';




function App() {
  const provider = new GoogleAuthProvider()
    



  const firebaseConfig = {
      apiKey: "AIzaSyA2LZ8B7DN2BrZBXL9s92hx4RRdtWEkGpg",
      authDomain:"calorie-counter-b5889.firebaseapp.com",
      projectId: "calorie-counter-b5889",
      storageBucket: "calorie-counter-b5889.appspot.com",
      messagingSenderId: "42681539056",
      appId: "1:42681539056:web:dd1ccdb2d67d270fcb2535"
    };
    

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app)
  
    const [user, setUser] = useState(null);
    const [userId,setUserId] = useState(null)
    const [calories,setCalories] = useState(null)
    const [lock,setLock] = useState(false)
    const appCheck = initializeAppCheck(app,{
      provider:new ReCaptchaV3Provider('6Ld3-y0pAAAAAGX2tIVxxVTTeKXQu9S_2UK4CEQQ')
    })  
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in
            setUserId(user.uid)
            setUser(user)
            setLock(true)
          } else {
            // User is signed out
            console.log('User is signed out');
            setLock(false)
          }
        });
        
      }, []);
  
      
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
      const handleLogout = () =>{
        const signOut = async () =>{
          try{
            auth.signOut()
            setUser(null)     
          }
          catch(error){
            console.log(error)
          }
        }
        signOut()
      }
      
  

  return (

    <div className='Container'>
      <div className="Nav">
  
  <img className='Logo' src={'logo.png'}></img>
  {user ? <div className='flexEmail'><div>{user?.email}</div>{/* <button onClick={handleLogout}>Sign Out</button> */}</div>:<button className="Nav-Auth" onClick={handleLogin}>Google Login</button>}
  
</div>


      <Calories uid={userId} />
    <Response lock={lock} />
    



     </div>
  )
}
export default App

