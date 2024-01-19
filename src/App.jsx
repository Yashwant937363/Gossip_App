import { useState } from 'react'
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import SignUp from './Components/Account/SignUp/SignUp'
import Navbar from './Components/Navbar/navbar'
import Home from './Components/Home/Home'
import NotFound from './Components/NotFound/NotFound'
import { useSelector } from 'react-redux'
import ErrorBar from './Components/MsgBars/ErrorBar'
import SuccessBar from './Components/MsgBars/SuccessBar'
import WarningBar from './Components/MsgBars/WarningBar'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar title="Gossip App" />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
