import React from 'react'
import { useSelector } from 'react-redux'
import Account from '../Account/Account'

export default function Home() {
  const isLogin = useSelector((state) => state.user.isLogin)

  if (isLogin) {
    return (<Account />)
  }
  return (
    <div>
      
      Home
    </div>
  )
}
