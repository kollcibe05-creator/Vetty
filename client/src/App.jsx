import React from 'react'
import Spinner from './components/Spinner'
import Notification from './components/Notification'
import ModalRoot from './components/ModalRoot'
import { RouterProvider } from 'react-router-dom'
import router from './components/Routes'

import './App.css'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Spinner />
      <Notification />
      <ModalRoot />
    </>
  )
}

export default App
