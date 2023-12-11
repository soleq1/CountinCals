import {useEffect, useState } from 'react'
import axios from 'axios'
import { Navigation } from './Navigation'

 const Response = ({lock}:any) =>{
    const [response,setResponse] = useState()
    const [displayedResponse,setDisplayedResponse] = useState([])
    const [state,setState] = useState('')
    const [loading,setLoading] = useState(false)
    const [locked,setLock] = useState(false)

    useEffect(() =>{
      console.log(lock)
    },[lock])
  
    const handleTax =  async (e:any)  =>{
      e.preventDefault()
      setLoading(true)
      await axios.post('http://localhost:3000/',{data: state})
      .then(response => {
        setResponse(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('YO ERROR');
        setDisplayedResponse((prev) => [...prev,'Daily Limit Reached'])
        setLoading(false)
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
    console.log(response)
  },[response])


  return(
    <div>
    {/* <Suspense fallback={<Loading /> }> */}
      <div className='Bg-Cont-Cont'>
    <div className='Bg-Container'>

        {displayedResponse.map((item, index) => (
          <div className="AiMsg" key={index}>
            {item? item : item.response.data}
          </div>
        ))}
    
        </div>
        {/* </Suspense> */}
    
          </div>
        <div className='spinCont'>{loading ?<div className='spinner'></div>:<div></div> }</div>
          <div className='BottomBar'>
          <form className='foodLookUp' onSubmit={handleTax}>
      <input value={state} disabled={!lock} className={lock === true  ?'foodLookUp-Input ': 'foodLookUp-Input Locked '} onChange={(e) => setState(e.target.value)} placeholder={lock === true ? 'Quick Food Look Up':'Log In First'} />
      <button className='foodLookUp-Submit'><svg  className='svgSub' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
</svg></button>
    </form>
        <div style={{display:'flex',justifyContent:'center',textAlign:'center'}}>
        <p className='Warn'>ChatGPT can make mistakes. Consider checking important information.</p>
        </div>
          <Navigation />
          </div>
          
    </div>
  )
}

export default Response