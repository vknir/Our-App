import {BrowserRouter,Routes,Route } from 'react-router-dom'


import Home from './components/Home.jsx'

function App(){
  return <>
 

  <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
    </Routes>
  </BrowserRouter>
  
  
  </>
}

export default App;