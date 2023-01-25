import { useContext} from 'react'
import DragArea from '../../Components/DragArea/DragArea'
import SideBar from '../../Components/SideBar/SideBar'
import { AppContext } from '../../App'

export default function Simulador() {

  const { setAlignment } = useContext(AppContext)



  setAlignment('simulador')

  return (
    <>
      <SideBar editorCode="nada" />
      <DragArea />
    </>
  )
}
