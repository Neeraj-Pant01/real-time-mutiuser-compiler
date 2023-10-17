import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';


const Homepage = () => {
    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const handleClick = () =>{
    const id = uuidv4();
    setRoomId(id)
    }

    const handleJoin = (e) =>{
        e.preventDefault()
        if(!roomId || !username){
            return setError(true)
        }
        setError(false)
        navigate(`/editorpage/${roomId}`,{
            state : {
                username
            }
        })
    }

  return (
    <div className='homepage'>
        <form>
            <input type='text' value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder='enter room id' />
            <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='enter userName' />
            <button onClick={handleJoin}>JOIN</button>
            <p>enter the rommId or create <a onClick={handleClick} style={{cursor:"pointer"}}>new room</a></p>
        </form>
        {error && <h2 style={{color:"red"}}>Fill all details</h2> }
    </div>
  )
}

export default Homepage
