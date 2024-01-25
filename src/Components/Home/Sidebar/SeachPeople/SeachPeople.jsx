import React, { useEffect, useState } from 'react'
import './SearchPeople.css'
import { Search } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import SeachItem from './SeachItem'
import { findusers } from '../../../../store/socket'

export default function SeachPeople() {
    const [users, setUsers] = useState([])
    const handleSearch = (input) => {
        if (input.length != 0) {
            findusers(input)
                .then(users => {
                    setUsers(users)
                })
                .catch(error => {
                    console.error("Error:", error.message);
                });
            console.log("Type : " + typeof user)
        }else{
            setUsers([])
        }
    }

    useEffect(() => {
        console.log("Users : ", users)
    }, [users])
    return (
        <div className='searchpeople'>
            <input
                type='text'
                className='searchfield'
                onChange={(e) => handleSearch(e.target.value)}
            />
            <div className='searchitems'>
                {users && users.length > 0 ? users.map((item, index) => (
                    <SeachItem key={index} profile={item.profile} uid={item.uid} username={item.username} />
                )) : <span>Users not found</span>}

            </div>
        </div>
    )
}
