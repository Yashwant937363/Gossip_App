import React, { useState } from 'react'
import { Check, CheckAll } from 'react-bootstrap-icons'

export default function SendChat(props) {
    const time = new Date(props.time)
    const status = props.status
    return (
        <div className='chat'>
            <div className='sendchat'>
                <div className='chattext'>{props.message}</div>
                <div className='timecheck'>
                    <div>{time.getHours()}:{time.getMinutes()}</div>
                    <div>{status === true ? (<CheckAll className='readcheck check' />) : status === false ? (<CheckAll className='receivedcheck check' />) : (<Check className='sendcheck check' />)}</div>
                </div>
            </div>
        </div>
    )
}
