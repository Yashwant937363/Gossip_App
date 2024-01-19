import React from 'react'
import { ExclamationTriangleFill } from 'react-bootstrap-icons'
import './MsgBar.css'

export default function WarningBar(props) {
    return (
        <div className='warningbar msgbar'>
            <ExclamationTriangleFill className='warningicon icon' />
            {props.msg}
        </div>
    )
}
