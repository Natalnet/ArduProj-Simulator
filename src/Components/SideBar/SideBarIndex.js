import React from 'react'
import ReactDOM from 'react-dom/client';
import './SideBarStyle.css'
import DropZoneIndex from '../DropZone/DropZone';
import SvgGridIndex from '../SvgGrid/SvgGridIndex';
import {AppContext} from '../../App'
import uuid from 'react-uuid'
import { changeColor } from '../../Functions/Behavior';

export default function SideBarIndex() {

  // * Biblioteca para converter hex em hsl
  var hexToHsl = require('hex-to-hsl');

  //Arquivos importados
  const [data, setData] = React.useState([])

  const {setDragMap, dragMap} = React.useContext(AppContext)

  const parser = new DOMParser();

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

  const [entrada, setEntrada] = React.useState(0)

  function createLed() {
    console.log(entrada)
    changeColor(entrada,dragMap[0].id)
    if (entrada === 0) {
      setEntrada(1)
    } else {setEntrada(0)}
  }
    
  return (
    <div ref={SideBarRef} className="SideBar" >
      <div ref={ButtonRef} className="Button" onClick={ () => SideBarButtonClick()} />
      { sideBarStatus ? 
      <> </> : <DropZoneIndex data={data} setData={setData} />}
      <SvgGridIndex data={data} />
      <button className='BtnTeste' onClick={() => {createLed()}}>Teste de LED</button>
    </div>
  )
}
