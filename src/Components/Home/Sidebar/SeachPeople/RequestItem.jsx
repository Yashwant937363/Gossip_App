import React from 'react'
import { CheckSquareFill, PersonFill, XSquareFill } from 'react-bootstrap-icons'
import { requestAnswer, sendChatRequest } from '../../../../store/socket'
import { useDispatch, useSelector } from 'react-redux'
import { removeRequest, setSucessMsgUser } from '../../../../store/slices/UserSlice'

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

export default function RequestItem(props) {
    const touid = useSelector((state) => state.user.uid)
    const tousername = useSelector((state) => state.user.username)
    const { profile, username, uid } = props
    const dispatch = useDispatch()
    const answerRequest = async (answer) => {
        const fromuid = uid
        const res = await requestAnswer({ fromuid, touid, answer, tousername })
        .catch((err) => console.log("Error While Answering Request : ",err))
        dispatch(setSucessMsgUser(res))
        dispatch(removeRequest(fromuid))
    }
    console.log(profile)
    return (
        <div className='searchandreqitem reqitem'>
            {(profile !== '') ?
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
