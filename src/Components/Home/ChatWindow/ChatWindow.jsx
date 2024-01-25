import React from 'react'
import { Person, PersonFill, SendFill } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import './ChatWindow.css'
import SendChat from './SendChat'
import ReceivedChat from './Received'

export default function ChatWindow(props) {
    const { register, formState: { errors }, handleSubmit } = useForm()
    const sendMessage = (data) => {
        console.log(data)
    }
    return (
        < div className='chatwindow' >
            <div className='profilebar'>
                <div className='outerimg'>
                    <img className="chatprofileimg" src="https://i.pinimg.com/236x/51/44/71/5144713488ef4a7f88c98ebe34fff03a.jpg" alt="" />
                </div>
                <div className='listItemtext'>
                    <div>{props.name}</div>
                </div>
            </div>
            <div className='chatcontainer'>
                <SendChat message="hello" status="send" time={new Date()} />
                <ReceivedChat message="hello" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
                <SendChat message="hello world" status="read" time={new Date()} />
                <ReceivedChat message="bhai kaisa hai" time={new Date()} />
            </div>
            <form className='messagefield' onSubmit={handleSubmit(sendMessage)} >
                <input {...register("message", { required: "Empty Message Cannot be Send" })} />
                <button type='submit'><SendFill></SendFill></button>
            </form>
        </div >
    )
}