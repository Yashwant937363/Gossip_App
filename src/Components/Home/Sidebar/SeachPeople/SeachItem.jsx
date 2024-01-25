import React from 'react'
import { PersonAdd } from 'react-bootstrap-icons'
import { sendChatRequest } from '../../../../store/socket'

export default function SeachItem(props) {
    const { profile, username, uid } = props
    const handlePersonAdd = () => {
        sendChatRequest(uid)
        .then((data) => console.log("Data",data))
        .catch((error) => console.log("Error : ",error))
    }
    return (
        <div className='searchitem'>
            <img className='profileimg' src={profile} />
            <div className='seachitemtext'>
                <h3>{username}</h3>
                <div>{uid}</div>
            </div>
            <PersonAdd className='personaddicon' onClick={handlePersonAdd}></PersonAdd>
        </div>
    )
}
