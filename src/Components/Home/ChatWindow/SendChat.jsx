import React, { useState } from 'react'
import { Check, CheckAll } from 'react-bootstrap-icons'

export default function SendChat(props) {
    const time = new Date(props.time)
    const [message, setMessage] = useState(props.status)
    return (
        <div className='chat'>
            <div className='sendchat'>
                <div className='chattext'>{props.message}</div>
                <div className='timecheck'>
                    <div>{time.getHours()}:{time.getMinutes()}</div>
                    <div>{message === "send" ? (<Check className='sendcheck check' />) : message === "received" ? (<CheckAll className='receivedcheck check' />) : (<CheckAll className='readcheck check' />)}</div>
                </div>
            </div>
        </div>
    )
}
