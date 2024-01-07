
import { useEffect, useRef, useState } from "react"
import { Arrows } from "./arrows";
import { initializeApp } from "firebase/app";
import {  getDatabase,onValue,ref,set } from "firebase/database";
import { initializeAppCheck,ReCaptchaV3Provider } from "firebase/app-check";




export const Calories = ({uid}:any) =>{
   
  const [popup,setOpen] = useState(false)
  
  const firebaseConfig = {
    apiKey: "AIzaSyA2LZ8B7DN2BrZBXL9s92hx4RRdtWEkGpg",
    authDomain:"calorie-counter-b5889.firebaseapp.com",
    projectId: "calorie-counter-b5889",
    storageBucket: "calorie-counter-b5889.appspot.com",
    messagingSenderId: "42681539056",
    appId: "1:42681539056:web:dd1ccdb2d67d270fcb2535"
  };

  const app = initializeApp(firebaseConfig)
  const db = getDatabase()
  const userRef = ref(db, `user/${uid}/calories`)
  const appcheck = initializeAppCheck(app,{
    provider:new ReCaptchaV3Provider('6Ld3-y0pAAAAAGX2tIVxxVTTeKXQu9S_2UK4CEQQ')
  })

  const [calorieData, setCalorieData] = useState({
    
    calories: 0,
    fats: 0,
    carbs: 0,
    protein: 0
    
  });
  const [changes, setChanges] = useState({
    title:'',
    fats: 0,
    carbs: 0,
    protein: 0,
  });
  const [history,setHistory] = useState([])
  const [favorites,setFavorites] = useState([])
  const isInitialMount =  useRef(true)


  useEffect(() =>{
    const Ref = ref(db,  `user/${uid}/calories`)
    onValue(Ref,(snapshot) =>{
      const data = snapshot.val()
      console.log(data) 
      setCalorieData((prevCalorieData) => ({
        ...prevCalorieData, // Keep the existing values
        ...data, // Update with the new values
      }));
    })
 


  },[uid])  

  const firstRender = useRef(true);
  useEffect(() =>{
    let debounceTimeout:any;

    if (firstRender.current){
      firstRender.current = false
      return
    }
    debounceTimeout = setTimeout(() => {
      if (JSON.stringify(prevCalorieData.current) !== JSON.stringify(calorieData)) {
      sendCal();
      }

    }, 1500);

    return () => clearTimeout(debounceTimeout);
  },[calorieData])
  const prevCalorieData = useRef(calorieData)
  const sendCal = async () =>{
    if (!uid) {
        console.error('UID is not available');
        return;
      } 
    if (prevCalorieData.current !== calorieData){
            set(userRef,{
              calories: calorieData.calories || 0,
              fats:calorieData.fats || 0,
              carbs:calorieData.carbs || 0,
              protein:calorieData.protein || 0

            })
           
         
    
   
    }

  }
 

   const handleAdd = (key:string,value:number) =>{
    try{

        setCalorieData(prevData => ({
            ...prevData,
            [key]: (prevData as any)[key] + value
        }));

    }catch(error){
        console.log(error)
    }
    
   }
   const handleSub = (key:string,value:number) =>{
    try{
        setCalorieData(prevData => ({
            ...prevData,
            [key]:(prevData as any)[key] - value
        }))

    }catch(error){
        console.log(error)
    }
   }
   useEffect(() => {
    setCalorieData(prevData => ({
        ...prevData,
        calories: prevData.fats + prevData.carbs + prevData.protein
      }));
    if (calorieData.fats < 0) {
      setCalorieData(prevData => ({
        ...prevData,
        fat: 0
      }));
    }
  
    if (calorieData.carbs < 0) {
      setCalorieData(prevData => ({
        ...prevData,
        carbs: 0
      }));
    }
  
    if (calorieData.protein < 0) {
      setCalorieData(prevData => ({
        ...prevData,
        protein: 0
      }));
    }
  }, [calorieData.fats, calorieData.carbs, calorieData.protein]);
  

  const conversionFactors = {
    fats: 9,      
    carbs: 4,  
    protein: 4, 
  };
  const handleInputChange = (macro, value) => {
    const calories = parseFloat(value) * conversionFactors[macro];

    setChanges((prevData) => ({
      ...prevData,
      [macro]: calories || 0,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT")
    try {
      setCalorieData((prevData) => ({
        ...prevData,
        fats: prevData.fats + changes.fats,
        carbs: prevData.carbs + changes.carbs,
        protein: prevData.protein + changes.protein,
      }));
      const updatedHistory = [...history, { ...changes }];
      setHistory(updatedHistory);
      localStorage.setItem('history',JSON.stringify(updatedHistory));

      setChanges({
        title:'',
        fats: 0,
        carbs: 0,
        protein: 0,
      });
      
      // Reset the input values
      
    } catch (error) {
      console.log(error);
    }
  };
  const handleUndo = (item,index) => {
    
     

    console.log(item)
    setCalorieData((prev) => ({
      ...prev,
      fats: prev.fats - item.fats,
      carbs: prev.carbs - item.carbs,
      protein: prev.protein - item.protein,
    }));
    
    const updatedHistory = history.filter((i) => i !== item)
    setHistory(updatedHistory)
    localStorage.setItem('history',JSON.stringify(updatedHistory))
  };


  useEffect(() =>{
    const localHistory = JSON.parse(localStorage.getItem('history'))
    const Favorites = JSON.parse(localStorage.getItem('favorite'))
    if (localHistory){

      setHistory(localHistory)
    }
    if (Favorites){
      setFavorites(Favorites)

    }
    isInitialMount.current = false;
  },[])
 

  const handleClear = () => {
    set(userRef,{
      calories: 0,
      fats:  0,
      carbs: 0,
      protein: 0

    })
  };
  
  const handleFavorite = (item) =>{
    setFavorites(prev => [...prev, item]);
    localStorage.setItem('favorite', JSON.stringify([...favorites, item]));
  
 
  }
 
    return(
      <div>

        <div className="Calorie-Container">
            <div className="Calorie-Grid">
            {/* <button><svg height='24' width='24' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AutorenewRoundedIcon"><path d="M12 6v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79c-.31-.31-.85-.09-.85.36V4c-4.42 0-8 3.58-8 8 0 1.04.2 2.04.57 2.95.27.67 1.13.85 1.64.34.27-.27.38-.68.23-1.04C6.15 13.56 6 12.79 6 12c0-3.31 2.69-6 6-6zm5.79 2.71c-.27.27-.38.69-.23 1.04.28.7.44 1.46.44 2.25 0 3.31-2.69 6-6 6v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.31.31.85.09.85-.35V20c4.42 0 8-3.58 8-8 0-1.04-.2-2.04-.57-2.95-.27-.67-1.13-.85-1.64-.34z"></path></svg></button> */}
            <button onClick={handleClear} className="ClearBut">Clear</button>

            <div className="Calories">Calories {calorieData.calories}</div>

        
                <div className="Calorie-BreakDown">Fat {calorieData.fats} <Arrows onPressUp={() => handleAdd('fats',9)} onPressDown={() => handleSub('fat',9)}  /> </div>
                <div className="Calorie-BreakDown">Carbs {calorieData.carbs} <Arrows onPressUp={() => handleAdd('carbs',4)} onPressDown={() => handleSub('carbs',4)}  /></div>
                <div className="Calorie-BreakDown">Protein {calorieData.protein} <Arrows onPressUp={() => handleAdd('protein',4)} onPressDown={() => handleSub('protein',4)}  /></div>
            </div>

            <div className="AddCal">
              
            <button className="AddFood" onClick={() => setOpen(!popup)}>Add Food</button>
      {popup && (
        <div className="overlay">
          <div className="popup-content">
            <div className="Food-FormContainer">
            
            <form className="Food-Form-Form" onSubmit={handleSubmit}>
            <input
          className="Food"
          type="text"
          placeholder="Food"
          onChange={(e) => setChanges({ ...changes, title: e.target.value })}

        />

        <input
          type="number"
          className="Food-Form"
          placeholder="Enter Fats"
         
          onChange={(e) => handleInputChange('fats', e.target.value)}
        />

        <input
          type="number"
          className="Food-Form"
          placeholder="Enter Carbs"
         
          onChange={(e) => handleInputChange('carbs', e.target.value)}
        />

        <input
          type="number"
          className="Food-Form"
          placeholder="Enter Protein"
         
          onChange={(e) => handleInputChange('protein', e.target.value)}
        />

      <button className="Submit" type="submit">Submit</button>
    </form>
            </div>
            <button className="popup-button" onClick={() => setOpen(!popup)} ><svg  className='popup-x' /* style={{fill:'#4070c4'}} */  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg></button>
          </div>
        </div>
      )}             
                <button  className="plusSvg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
  <path d="M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74a8.058 8.058 0 0 0-.74-.74l-.66.752c.23.202.447.418.648.648l.752-.66zm1.161 1.735a7.98 7.98 0 0 0-.524-.905l-.83.556c.169.253.322.518.458.793l.896-.443zM1.348 3.555c-.194.289-.37.591-.524.906l.896.443c.136-.275.29-.54.459-.793l-.831-.556zM.423 5.428a7.945 7.945 0 0 0-.27 1.011l.98.194c.06-.302.14-.597.237-.884l-.947-.321zM15.848 6.44a7.943 7.943 0 0 0-.27-1.012l-.948.321c.098.287.177.582.237.884l.98-.194zM.017 7.477a8.113 8.113 0 0 0 0 1.046l.998-.064a7.117 7.117 0 0 1 0-.918l-.998-.064zM16 8a8.1 8.1 0 0 0-.017-.523l-.998.064a7.11 7.11 0 0 1 0 .918l.998.064A8.1 8.1 0 0 0 16 8zM.152 9.56c.069.346.16.684.27 1.012l.948-.321a6.944 6.944 0 0 1-.237-.884l-.98.194zm15.425 1.012c.112-.328.202-.666.27-1.011l-.98-.194c-.06.302-.14.597-.237.884l.947.321zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a6.999 6.999 0 0 1-.458-.793l-.896.443zm13.828.905c.194-.289.37-.591.524-.906l-.896-.443c-.136.275-.29.54-.459.793l.831.556zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
</svg></button>
            <div><svg className="" height='24' width='24' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="TurnedInNotRoundedIcon"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V6c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v12z"></path></svg></div>
            
            
            </div>
            <div className="history">{history.map((item,index) =>(

                <div className="History-Container" key={index}>

                <button className="History-Undo" onClick={() => handleUndo(item,index)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg></button>
                <div>{`${item.title}: -${item.fats}g fat, -${item.carbs}g carbs, -${item.protein}g protein`}</div>
                <button className="FavoriteBut"  onClick={() =>handleFavorite(item)}><svg className="" height='16' width='16' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="TurnedInNotRoundedIcon"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V6c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v12z"></path></svg></button>
                </div>


            ))}</div>
        </div>
        </div>
    )
}