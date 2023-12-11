import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Favorites } from './components/Favorites.tsx'





ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
  <Route path='/' element={<App />} ></Route>
  {/* <App/> */}
  <Route path='/favorite' element={<Favorites />} />
    </Routes>
    </BrowserRouter>


  
  </React.StrictMode>,
)


