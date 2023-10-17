import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Editor from '../componenets/Editor'
import { initSocket } from '../socket'
import { ACTIONS } from '../actions'

const EditorPage = () => {
  const [clients, setClients] = useState([])
  const socketRef = useRef(null)
  const location = useLocation()
  const reactNavigator = useNavigate()
  const {roomId} = useParams()
  const codeRef = useRef(null)

  console.log(codeRef)

  useEffect(()=>{
    const init = async () =>{
      socketRef.current = await initSocket();

      socketRef.current.on('connect-error',(err)=>handleError(err))
      socketRef.current.on('connect-failed',(err)=>handleError(err))

      const handleError = (err) =>{
        console.log(err)
        alert('connection failed')
        reactNavigator('/')
      }

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state.username
      })

      socketRef.current.on('joined',(data)=>{
        if(data.username !==location.state?.username){
          alert(`${data.username} joined the room`)
        }
        setClients(data.clients)

        //so the new joined user can see the old code
        socketRef.current.emit('sync-code',{
          code:codeRef.current,
          socket_Id:data.socketId
        })
      })
      

      socketRef.current.on('disconnected',(data)=>{
        alert(`${data.username} left the room`);
        setClients((pre)=>{
          return pre.filter((client)=>client.socketId != data.socketId)
        })
      })
    }

    init()

    return () => {
      socketRef.current.off('joined');
      socketRef.current.off('disconnected')
      socketRef.current.disconnect();

    }
  },[location.state.username])

if(!location.state){
  return <Navigate to={`/`}/>
}

const copyRoomId = async () =>{
  try{
    await navigator.clipboard.writeText(roomId)
    alert("roomId has been copied !")
  }catch(err){
    console.log(err)
  }
}

const leaveRoom = () =>{
  reactNavigator('/')
}

  return (
    <>
    <div className='EditorPage' style={{display:"flex", width:"100vw", height:"90vh"}}>
        <div className="left" style={{flex:"1", border:"1px solid green"}}>users<br></br>
        {
          clients.map((c)=>{
            return(
              <>
              <b key={c.socketId}>{c.username} <br/></b>
              </>
            )
          })
        }
        <button style={{alignSelf:"flex-end",justifySelf:"flex-end", float:"inline-end"}} onClick={copyRoomId}>copy roomID</button>
        <button onClick={leaveRoom}>Leave Room</button>

        </div>
        <div className="right" style={{flex:"4", border:"1px solid red",}}>
        <Editor socketRef={socketRef} roomId={roomId} oncodeChange={(code)=>{codeRef.current = code}}/>
        </div>
    </div>
    </>
  )
}

export default EditorPage
