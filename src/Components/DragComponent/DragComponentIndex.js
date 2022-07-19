import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import LeaderLine from 'react-leader-line'
import './DragComponentStyle.css'
import {AppContext} from '../../App'

export default function DragComponentIndex({name, svg, part, id}) {

    const {dragMap, setDragMap, lines, setLines, startLine, setStartLine} = React.useContext(AppContext)

    const parser = new DOMParser();
    const connectorsDoc = parser.parseFromString(part, 'text/html')
    const doc = parser.parseFromString(svg, 'text/html')
    const currentSvg = doc.getElementsByTagName('svg')[0]

    //Função que seleciona os elementos no svg responsaveis pelos conectores e adiciona a classe 'connector' a eles
    function createConnectors () {
      let frontConnectors = <g></g>
      let frontConnectorsArray = []
      for (let index = 0; connectorsDoc.getElementsByTagName('connector')[index]; index++) {
        /*
        Futuros usos:
        let connector = connectorsDoc.getElementsByTagName('connector')[index]
        let connectorId = connector.getAttribute('id')
        let connectorType = connector.getAttribute('type')
        let connectorName = connector.getAttribute('name')
        */
        let breadboardView = connectorsDoc.getElementsByTagName('breadboardView')[1]
        let p = breadboardView.querySelectorAll('[layer=breadboard]')[index]
        let connectorSvgId = p.getAttribute('svgId')

        //Elemento que é um conector baseado no part
        const svgConnector = currentSvg.getElementById(connectorSvgId)

        //Classe adicionada no conector
        svgConnector.setAttribute('class','connector')

        console.log(typeof frontConnectors)
        frontConnectorsArray.push(svgConnector)
        

        //document.getElementById(`frontSvg/${id}`).appendChild(svgConnector)
        
        //svgConnector.addEventListener('click',console.log("aaaaaaaaaaaaaaaaaa"))
        //svgConnector.addEventListener('click', 'console.log("clicadoo")')

        /*
        Arrumar bug dos highlight - Em progresso
        svgConnector.removeAttribute('style')

        svgConnector.setAttribute('fill','none') 

        svgConnector.parentElement.insertBefore(svgConnector, null)
        */
      }
      console.log(frontConnectorsArray)
      //frontConnectors.innerHTML = frontConnectorsArray
      return(
      frontConnectorsArray.map(c => {
        return(
          <div dangerouslySetInnerHTML={{__html: c.innerHTML}}>

          </div>
        )
      }))
    }


    

    function lineFunc() {
      
      console.log(startLine)
      if (startLine == null) 
      {
        setStartLine(id)
        console.log(startLine)
      } else {

        let index = lines.findIndex(item => {return item.endLine == null})
        
        let tempLines = lines
        tempLines.push({startLine:startLine, endLine:id})
        setLines(tempLines)
        console.log(lines)
        setStartLine(null)
      }
      
      
    }

    //Ainda não terminado
    function DragComponent() {
        const pos = useSpring({ x: 100, y: 100 })
        const bindPos = useDrag((params) => {
          pos.x.set(params.offset[0])
          pos.y.set(params.offset[1])
        })
        return (
        <animated.div {...bindPos()} style={{ x: pos.x, y:pos.y }}  className='animatedSvgDiv'>
          
          <svg
          className='dragSvg'
          dangerouslySetInnerHTML={{__html: currentSvg.innerHTML}}
          />
          <svg id={`frontSvg/${id}`}>
            <g>
              {createConnectors()}
            </g>
          </svg>
        </animated.div>)
      }

    function removeComponent() {
      let filteredMap = dragMap.filter(item => {
        return item.id != id
      })
      setDragMap(filteredMap)
    }

    

  return (
    <div className='svgDiv' id={id} onClick={() => {lineFunc()}} onDoubleClick={() => {removeComponent()}}>
      {DragComponent()}
    </div>
  )
}
