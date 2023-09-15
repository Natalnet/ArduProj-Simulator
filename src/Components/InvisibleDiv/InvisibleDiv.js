import React, { useState } from 'react'
import useMousePosition from '../../helpers/linePositionHook'
import { makeLine, lineFunc } from '../../helpers/linesHelpers'
import { AppContext } from '../../App'
import useEventListener from '../../helpers/eventListenerHook'


export default function InvisibleDiv({ updatePositionCallback, sectionUuid, section, line }) {

    const { dragMap, setDragMap, lines, setLines, emitter } = React.useContext(AppContext)

    const [isStoped, setIsStoped] = useState(false)
    const [finalLocation, setFinalLocation] = useState({ x: 0, y: 0 })
    let tempPosition = useMousePosition()

    updatePositionCallback(lines)

    React.useEffect(() => {
        makeLine(lines, section)

        //document.current.addEventListener('onkeydown', cancelLines)

    }, [])

    var mousePosition = { x: 0, y: 0 }

    if (!isStoped) {
        mousePosition = tempPosition
    }

    function handleClick() {

            console.log('CLICLADO NO INVISBLE DIV ')

            setIsStoped(true)
            setFinalLocation(mousePosition)

            let clickedOver = document.elementsFromPoint(mousePosition.x, mousePosition.y)

            let connectorCliked = clickedOver.find(element => {
                return element.className.baseVal === 'connector'
            })
            console.log('clccick')
            if (connectorCliked) {

                lineFunc(connectorCliked, lines, setLines, dragMap, setDragMap)
                
            } else {
                lineFunc(document.getElementById(sectionUuid), lines, setLines, dragMap, setDragMap, true)
            }
    }

    function cancelLines() {


        line.sections.forEach(section => {
            section.leaderLine.remove()
        })
        

        let filteredLines = lines.filter((listLine) => {
            return !(listLine.id === line.id || listLine.id === line.id)
        })

        setLines(filteredLines)
    }

    const ESCAPE_KEYS = ['27', 'Escape'];

        function handler({ key }) {
          if (ESCAPE_KEYS.includes(String(key))) {
            console.log('Escape key pressed!')
            cancelLines()
          }
        }
      
        useEventListener('keydown', handler);

    return (
        <div
            className='invisibleDiv'
            id={`section/${sectionUuid}`}
            style={{
                display: 'block',
                position: 'fixed',
                width: '5px',
                height: '5px',
                top: isStoped ? finalLocation.y : mousePosition.y,
                left: isStoped ? finalLocation.x : mousePosition.x,
                zIndex: -5
            }
            }
            stoped={isStoped.toString()}
            onClick={handleClick}
            onContextMenu={(e) => {cancelLines(e)}}
           
        />)
}

