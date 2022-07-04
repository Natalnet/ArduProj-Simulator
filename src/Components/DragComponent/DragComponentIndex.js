import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import './DragComponentStyle.css'

export default function DragComponentIndex({name, svg, part}) {

    const parser = new DOMParser();
    const connectorsDoc = parser.parseFromString(part, 'text/html')
    const doc = parser.parseFromString(svg, 'text/html')
    const currentSvg = doc.getElementsByTagName('svg')[0]

    //Função que seleciona os elementos no svg responsaveis pelos conectores e adiciona a classe 'connector' a eles
    function createConnectors () {
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
      }
      return(currentSvg.innerHTML)
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
          dangerouslySetInnerHTML={{__html: createConnectors()}}
          />
        </animated.div>)
      }

  return (
    <div className='svgDiv'>{DragComponent()}</div>
  )
}
