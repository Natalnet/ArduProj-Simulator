import { useContext} from 'react'
import React from 'react'
import DragArea from '../../Components/DragArea/DragArea'
import SideBar from '../../Components/SideBar/SideBar'
import { AppContext } from '../../App'
import MatrizDisplay from '../../Components/MatrizDisplay/MatrizDisplay'

export default function Simulador() {

  const { setAlignment } = useContext(AppContext)

  setAlignment('simulador')

  return (
    <>
      <SideBar />
      <DragArea />
    </>
  )
}
