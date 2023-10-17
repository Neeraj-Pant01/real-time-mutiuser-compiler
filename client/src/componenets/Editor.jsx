import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import {} from "@uiw/react-codemirror"
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import {java} from '@codemirror/lang-java';



const Editor = ({socketRef, roomId, oncodeChange}) => {
    const extensions = [javascript({ jsx: true })];
    const codeRef = useRef()
    const [code, setCode] = useState('')


    const handleChange = (e) =>{
        setCode(e)
        oncodeChange(e)
    }

    const handliclick = () =>{
        socketRef.current.emit('code-change',{
            roomId,
            code
        })
    }

    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=>{
                setCode(code)
            })
        }
        return () =>{
            socketRef.current.off('code-change')
        }
    },[handliclick])

    return (
        <>
    <button style={{float:"right"}} onClick={handliclick}>Apply changes</button>
        <div>
            <CodeMirror
            extensions={extensions}
            theme={okaidia}
            height='90vh'
            value={code}
            onChange={handleChange}
            />
        </div>
        </>
    )
}

export default Editor
