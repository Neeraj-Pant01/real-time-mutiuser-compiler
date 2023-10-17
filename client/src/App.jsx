import React from 'react'

import {
  Routes,
  Route,
} from "react-router-dom";
import Homepage from './pages/Homepage';

import EditorPage from './pages/EditorPage';

const App = () => {

  return (
    <div>
      <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/editorpage/:roomId' element={<EditorPage />} />
      </Routes>
    </div>
  )
}

export default App
