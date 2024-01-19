import React from 'react'
import { CheckCircleFill } from 'react-bootstrap-icons'
import './MsgBar.css'

export default function SuccessBar(props) {
  return (
    <div className='successbar msgbar'>
        <CheckCircleFill className='successicon icon'/>
      {props.msg}
    </div>
  )
}
