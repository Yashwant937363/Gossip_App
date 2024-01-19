import React from 'react'
import { XCircleFill } from 'react-bootstrap-icons'
import './MsgBar.css'

export default function ErrorBar(props) {
  return (
    <div className='errorbar msgbar'>
      <XCircleFill className='erroricon icon' />
      {props.msg}
    </div>
  )
}
