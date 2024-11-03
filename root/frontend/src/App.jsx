import {BrowserRouter,Routes,Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil';

import Home from './components/Home.jsx'

function App(){
  return <>
 
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
  
  </>
}

export default App;