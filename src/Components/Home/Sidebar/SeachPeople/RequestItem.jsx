import React from 'react'
import { CheckSquareFill, PersonFill, XSquareFill } from 'react-bootstrap-icons'
import { requestAnswer, sendChatRequest } from '../../../../store/socket'
import { useSelector } from 'react-redux'

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export default function RequestItem(props) {
    const touid = useSelector((state) => state.user.uid)
    const tousername = useSelector((state) => state.user.username)
    const { profile, username, uid } = props

    const answerRequest = (answer) => {
        requestAnswer({ uid, touid, answer, tousername })
    }
    console.log(profile)
    return (
        <div className='searchandreqitem reqitem'>
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
            <div className='acceptandreject'>
                <XSquareFill color='red' onClick={() => answerRequest(false)}></XSquareFill>
                <CheckSquareFill color='green' onClick={() => answerRequest(true)}></CheckSquareFill>
            </div>
        </div>
    )
}
