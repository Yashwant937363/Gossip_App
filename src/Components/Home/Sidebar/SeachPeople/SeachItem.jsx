import React from 'react'
import { PersonAdd, PersonFill } from 'react-bootstrap-icons'
import { sendChatRequest } from '../../../../store/socket'
import { useSelector } from 'react-redux'

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export default function SeachItem(props) {
    const fromuid = useSelector((state) => state.user.uid)
    const { profile, username, uid } = props
    const handlePersonAdd = () => {
        sendChatRequest(fromuid,uid)
            .then((data) => console.log("Data", data))
            .catch((error) => console.log("Error : ", error))
    }
    console.log(profile)
    return (
        <div className='searchitem'>
            {(profile !== SERVER_URL) ?
                (<img src={profile} className='profileimg' />)
                :
                (<div className='personfillicon'>
                    <PersonFill></PersonFill>
                </div>)}
            <div className='seachitemtext'>
                <h3>{username}</h3>
                <div>{uid}</div>
            </div>
            <PersonAdd className='personaddicon' onClick={handlePersonAdd}></PersonAdd>
        </div>
    )
}
