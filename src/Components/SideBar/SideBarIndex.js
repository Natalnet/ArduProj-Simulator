import React from 'react'
import './SideBarStyle.css'
import DropZoneIndex from '../DropZone/DropZoneIndex';
import SvgGridIndex from '../SvgGrid/SvgGridIndex';
import {AppContext} from '../../App'

export default function SideBarIndex({onDrop}) {

  const {data} = React.useContext(AppContext)

  //Não terminado
  const [sideBarStatus, setsideBarStatus] = React.useState(false)
  const SideBarRef = React.useRef(null)
  const ButtonRef = React.useRef(null)

  //Não terminado
  const SideBarButtonClick = () => {
    SideBarRef.current.classList.toggle("closed")
    ButtonRef.current.classList.toggle("closed")
    console.log(data)
    setsideBarStatus(!sideBarStatus)
  }
    
  return (
    <aside ref={SideBarRef} className="SideBar">
      <div ref={ButtonRef} className="Button" onClick={ () => SideBarButtonClick()} />
      { sideBarStatus ? 
      <> </> : <DropZoneIndex onDrop={ onDrop }/>}
      <SvgGridIndex />
    </aside>
  )
}
