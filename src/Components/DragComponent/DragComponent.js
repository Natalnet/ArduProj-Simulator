import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'
import LeaderLine from 'react-leader-line'
import './DragComponentStyle.css'
import {AppContext} from '../../App'
import { lineFunc } from '../../Functions/Functions'

export default function DragComponentIndex({name, svg, part, id, updatePositionCallback}) {

    const {dragMap, setDragMap, lines, setLines} = React.useContext(AppContext)

    const parser = new DOMParser();
    const connectorsDoc = parser.parseFromString(part, 'text/html')
    const doc = parser.parseFromString(svg, 'text/html')
    const currentSvg = doc.getElementsByTagName('svg')[0]

    
    //Função que seleciona os elementos no svg responsaveis pelos conectores e adiciona a classe 'connector' a eles
    function createConnectors () {
      let frontConnectors = <g></g>
      let frontConnectorsArray = []
      for (let index = 0; connectorsDoc.getElementsByTagName('connector')[index]; index++) {
        
        let breadboardView = connectorsDoc.getElementsByTagName('breadboardView')[1]
        let p = breadboardView.querySelectorAll('[layer=breadboard]')[index]
        let connectorSvgId = p.getAttribute('svgId')

        //Elemento que é um conector baseado no part
        const svgConnector = currentSvg.getElementById(connectorSvgId)

        //Classe adicionada no conector
        svgConnector.setAttribute('class','connector')
        //Classe adicionada no conector
        svgConnector.setAttribute('id',`${connectorSvgId}/${id}`)

        svgConnector.setAttribute('pointer-events','fill')

        svgConnector.parentElement.appendChild(svgConnector)
        
        //? Arrumar bug dos highlight - Em progresso
        /* 
        svgConnector.removeAttribute('style')

        svgConnector.setAttribute('fill','none') 

        svgConnector.parentElement.insertBefore(svgConnector, null)
        */
      }

      return(currentSvg.innerHTML)
    }

    const [{x, y, width, height}, api] = useSpring(() => ({
      x:0, 
      y:0, 
      width:currentSvg.width.baseVal.value ? currentSvg.width.baseVal.value : currentSvg.height.baseVal.value, 
      height:currentSvg.height.baseVal.value ? currentSvg.height.baseVal.value : currentSvg.width.baseVal.value}))

    function DragComponent() {
        
        const bind = useDrag((params) => {
          api.set({
            x: params.offset[0],
            y: params.offset[1]
          })
          
          if(params.tap && params.elapsedTime >= 500 && params.event.target.className.baseVal === 'connector') {
            lineFunc(params.event.target,lines,setLines)
          }

          updatePositionCallback(params.currentTarget.id)
          if(params.tap) console.log(params)
          
        },
        ({ down, movement: [mx, my] }) => api.start({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 })
        
      
        ) 
        return (
        <animated.div {...bind()} style={{ x, y, width, height, pointerEvents:'auto' }} id={`animatedDiv/${id}`}  className='animatedSvgDiv' >
          
          <svg
          className='dragSvg'
          dangerouslySetInnerHTML={{__html: createConnectors()}}
          width={currentSvg.width.baseVal.value}
          height={currentSvg.height.baseVal.value}
          viewBox={currentSvg.viewBox}
          
          //viewBox={currentSvg.getAttribute(viewBox)}
          />
          
        </animated.div>)
      }

    //TODO Função para remover o componente e as linhas ligadas a ele
    function removeComponent() {
      //Aqui remove o componente do DragMap
      let filteredMap = dragMap.filter(item => {
        return item.id !== id
      })
      setDragMap(filteredMap)

      //TODO: Remover linhas ao remover componente. Está bugado 
      //? Aqui remove o Leader Line
      let toRemoveLines = lines.filter((i) => { 
        return i.startLine === `animatedDiv/${id}` || i.endLine === `animatedDiv/${id}`
      })
      ////console.log(toRemoveLines)
      toRemoveLines.forEach(i => {
        i.LeaderLine.remove()
      })
      
      //E aqui remove a linha do lines
      let filteredLines = lines.filter((i) => { 
        return !(i.startLine === `animatedDiv/${id}`) && !(i.endLine === `animatedDiv/${id}`)
      })

      console.log(filteredLines)
      
      setLines(filteredLines)
      console.log(lines)
    }

    //create your forceUpdate hook
    function useForceUpdate(){
      const [value, setValue] = React.useState(0); // integer state
      console.log(value)
      return () => setValue(value => value + 1); // update state to force render
      // An function that increment 👆🏻 the previous state like here 
      // is better than directly setting `value + 1`
    }

    const forceUpdate = useForceUpdate();

  return (
    <div className='svgDiv' id={id} style={{position:'fixed', x:400, y:-300, pointerEvents:'none'}} onClick={forceUpdate}  onDoubleClick={() => {removeComponent()}}>
      {DragComponent()}
    </div>
  )
}
