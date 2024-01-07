import { useState,useEffect } from "react";


export const  Chunks = ({response}) =>{
    const [displayedResponse, setDisplayedResponse] = useState([]);
    const [responseComplete, setResponseComplete] = useState(false);

   
    useEffect(() => {
       
            if (!response){
                return
            }
            else{

                setDisplayedResponse(prevMessages => {
                    if (prevMessages) {
                        return [...prevMessages, response];
                    } else {
                        return prevMessages; 
                    }
                });
                
            }
        



},[responseComplete])

useEffect(() =>{
    setResponseComplete(prev => !prev)
},[response])
useEffect(() =>{
    console.log(displayedResponse)
},[displayedResponse])

    return(
   
    
    <div className="message-container">
    { displayedResponse && displayedResponse.map((item, index) => (
      <div className="AiMsg" key={index}>
        {item}
      </div>
    ))}
  </div>
  
    ) 
}

