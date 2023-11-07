import {useEffect, useState } from 'react'
import axios from 'axios'

 const Response = () =>{
    const [response,setResponse] = useState()
    const [displayedResponse,setDisplayedResponse] = useState([])
    const [state,setState] = useState('')
    const [loading,setLoading] = useState(false)
  
    const handleTax =  async (e:any)  =>{
      e.preventDefault()
      setLoading(true)
      await axios.post('http://localhost:3000/',{data: state})
      .then(response => {
        setResponse(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error);
      });
      setState('')

      }
  useEffect(() =>{
    // console.log(displayedResponse)
    if ((response as any)?.length > 0){
  
      setDisplayedResponse((prevItem) => [...prevItem,response])
    }else{
      return;
    }
  },[response])


  return(
    <div>
    <div className='Bg-Container'>
    {/* <Suspense fallback={<Loading /> }> */}
      
        {displayedResponse.map((item, index) => (
          <div className="AiMsg" key={index}>
            {item}
          </div>
        ))}
        <div className='spinCont'>{loading ?<div className='spinner'></div>:<div></div> }</div>
    
        {/* </Suspense> */}
    
          </div>



            

          <form className='foodLookUp' onSubmit={handleTax}>
        <input className='foodLookUp-Input' onChange={(e) => setState(e.target.value )} placeholder='Quick Food Look Up' />
      <button className='foodLookUp-Submit'><svg  className='svgSub' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</svg></button>

    </form>

    </div>
  )
}

export default Response