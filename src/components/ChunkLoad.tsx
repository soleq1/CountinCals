import { useState,useEffect } from "react";


export const  Chunks = ({response}) =>{
    const [displayedResponse, setDisplayedResponse] = useState([]);
    const [responseComplete, setResponseComplete] = useState(false);

    
    // useEffect(() =>{
    //     setDisplayedResponse(response)
    // },[])
    useEffect(() => {
        // setDisplayedResponse(prev => prev.concat(response));
            // setDisplayedResponse(prevMessages => [...prevMessages, response]);
            if (!response){
                return
            }
            else{

                setDisplayedResponse(prevMessages => {
                    if (prevMessages) {
                        return [...prevMessages, response];
                    } else {
                        return prevMessages; // No change if response is empty
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
    //     <div className="message-container">
    //         {displayedResponse ? 
    //     displayedResponse.map(item => (
    //         <div className="AiMsg" key={item.id}>
    //         {item.content}
    //       </div>
    //     ))
    // :<div></div>}
    //   </div>
    
    <div className="message-container">
    { displayedResponse && displayedResponse.map((item, index) => (
      <div className="AiMsg" key={index}>
        {item}
      </div>
    ))}
  </div>
  
    ) 
}

{/* <div className="AiMsg">{displayedResponse}</div> */}