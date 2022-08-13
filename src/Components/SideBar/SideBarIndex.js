import React from 'react'
import ReactDOM from 'react-dom/client';
import './SideBarStyle.css'
import DropZoneIndex from '../DropZone/DropZone';
import SvgGridIndex from '../SvgGrid/SvgGridIndex';
import {AppContext} from '../../App'
import uuid from 'react-uuid'

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

  function createLed() {
    let tempMap = [...dragMap]
    let id = uuid()

    // * Aqui pegamos o primeiro componente do SvgGrid
    var component = data[1].breadboard

    component = parser.parseFromString(component,'text/html')
    
    component = component.getElementsByTagName('svg')

    // * Aqui buscamos o componente Svg que possui a cor #FF0000, cor essa que será definida pelo usuario
    var led = component[0].querySelector('[fill="#FF0000"]')

    // * Transformamos a cor em HEX para melhor manuseio e criamos sua versão escura
    const hex = led.getAttribute('fill')
    var hsl = hexToHsl(hex)
    var darkHsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2] - 35}%)`
    hsl = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`
    

    var splitedComponent = component[0].outerHTML.split(led.outerHTML)

    const splitLed = led.outerHTML.split('</')

    // * O componente animate é o responsavel por criar a animação de blink
    led = `${splitLed[0]}<animate
    class="animate"
    attributeName="fill"
    values="${darkHsl};${hsl};${darkHsl}"
    dur="2s"
    repeatCount="indefinite"
  /></${splitLed[1]}
    `
    component = `${splitedComponent[0]}${led}${splitedComponent[1]}`

    tempMap.push({componentName: data[1].componentName, breadboard:component, part:data[1].part, id:id})

    setDragMap(tempMap)
  }
    
  return (
    <div ref={SideBarRef} className="SideBar">
      <div ref={ButtonRef} className="Button" onClick={ () => SideBarButtonClick()} />
      { sideBarStatus ? 
      <> </> : <DropZoneIndex data={data} setData={setData} />}
      <SvgGridIndex data={data} />
      <button className='BtnTeste' onClick={() => {createLed()}}>Teste de LED</button>
    </div>
  )
}
