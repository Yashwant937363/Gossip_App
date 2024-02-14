import React, { useEffect } from 'react';
import './Home.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow/ChatWindow';
import SideBar from './Sidebar/Sidebar';
import { socket } from '../../store/socket';

export default function Home() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }
  
  useEffect(() => {
    socket.connect()
  },[])

  return (
    <div className='home'>
      <SideBar />
      <ChatWindow name='person' />
    </div>
  );
}
