import { Navigation } from "./Navigation"
import { useEffect, useRef, useState } from "react";
import { Navbar } from "./NavBar";



export const Favorites = ({lock}:any) =>{
   const [favorite,setFavorite] = useState([])
   const isInitialMount = useRef(true);
    useEffect(() =>{
        const Favorites = localStorage.getItem('favorite')
        if (Favorites){
          setFavorite(JSON.parse(Favorites))

        
        }
        isInitialMount.current = false;
       
   },[])  
   
   const removeFav = (itemToRemove) =>{
    setFavorite((prevFavorite) =>
    prevFavorite.filter((item) => item !== itemToRemove)
    );
    if (!isInitialMount.current) {
      localStorage.setItem('favorite', JSON.stringify(favorite));
    }

   }

  
    return(
        <div>
        <Navbar />
        <div className="Favorite-Container">
            
        {favorite !== null ? (
  <div>
    <div>Favorites Here</div>
    
    <div className="Favorite-Scroll">

    {favorite.map((item) => (
      <div className="Favorites">

    <div>{`${item.title}: ${item.fats}g fat, ${item.carbs}g carbs, ${item.protein}g protein`}</div>
    <button className="FavoriteBut" onClick={() => removeFav(item)}><svg className="" height='24' width='24' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="TurnedInNotRoundedIcon"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V6c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v12z"></path></svg></button>
        </div>       
    ))}
  </div>
  </div>
) : <div> See Favorites Here</div>}
        </div>
        <div className="Navigation-Favorite">
        
        <Navigation />
        </div>
        </div>
    )
}