import { useEffect, useReducer, useState } from 'react'
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Navbar from './Components/Navbar/navbar'
import Home from './Components/Home/Home'
import NotFound from './Components/NotFound/NotFound'
import { useDispatch, useSelector } from 'react-redux'
import ErrorBar from './Components/MsgBars/ErrorBar'
import SuccessBar from './Components/MsgBars/SuccessBar'
import WarningBar from './Components/MsgBars/WarningBar'
import Account from './Components/Account/Account'
import { addRequest, getUser, setErrorMsgUser, setSucessMsgUser } from './store/slices/UserSlice'
import { connecttoserver, socket } from './store/socket'
import Cookies from 'js-cookie'
import Profile from './Components/Profile/Profile'


function App() {
  const dispatch = useDispatch()
  const isLogin = useSelector((state) => state.user.isLogin)
  const username = useSelector((state) => state.user.username)
  const profile = useSelector((state) => state.user.profile)
  const uid = useSelector((state) => state.user.uid)
  const successmsguser = useSelector((state) => state.user.successmsg)
  const errormsguser = useSelector((state) => state.user.errormsg)
  useEffect(() => {
    const authtoken = Cookies.get('authtoken')
    if (authtoken) {
      dispatch(getUser({ authtoken }))
    }
  }, [])

  const requests = useSelector((state) => state.user.requests)
  console.log(requests)
  useEffect(() => {
    socket.on("requestfromuser", ({ uid, profile, username }) => {
      dispatch(addRequest({ uid, profile, username }))
    })
    return () => {
      socket.off("requsetfromuser")
    }
  }, [socket])

  useEffect(() => {
    connecttoserver({ dispatch, username, profile, uid })
  }, [isLogin])

  useEffect(() => {
    if (successmsguser !== '') {
      setTimeout(() => {
        dispatch(setSucessMsgUser(''));
      }, 3000);
    }
    if (errormsguser !== '') {
      setTimeout(() => {
        dispatch(setErrorMsgUser(''));
      }, 5000);
    }
  })
  return (
    <>

      {(successmsguser !== '') ? (<SuccessBar msg={successmsguser} />) : null}
      {(errormsguser !== '') ? (<ErrorBar msg={errormsguser} />) : null}
      {/* {(successmsgnote !== '') ? (<SuccessMsgBar msg={successmsgnote} />) : null}
      {(errormsgnote !== '') ? (<ErrorMsgBar msg={errormsgnote} />) : null} */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar title="Gossip App" />}>
            <Route index element={<Home />} />
            <Route path='/login' element={<Account />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App