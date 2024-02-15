import React, { useState } from 'react'
import ListItem from './ListItem'
import './SideBar.css'
import { PeopleFill, PersonFillAdd, PlusCircleFill } from 'react-bootstrap-icons'
import SeachPeople from './SeachPeople/SeachPeople'
import { useSelector } from 'react-redux'

export default function SideBar() {
    const requests = useSelector((state) => state.user.requests)
    const [addperson, setAddPerson] = useState(false)
    return (
        <div className='sidebarlist'>
            <h3 className='chats'>
                <span className='chatstext'>Chats</span>
                <div className='groupaddicon'>
                    <PeopleFill />
                    <PlusCircleFill className='pluscirclefill' />
                </div>
                <div className='addperson'>
                    {requests.length !== 0 ? <div className='reddot'></div> : null}
                    <PersonFillAdd onClick={() => setAddPerson(!addperson)} className='addpersonicon' />
                </div>
            </h3>
            {addperson ? (<SeachPeople></SeachPeople>) : null}
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
            <ListItem name="person" lastmessage="hello" />
        </div>
    )
}


