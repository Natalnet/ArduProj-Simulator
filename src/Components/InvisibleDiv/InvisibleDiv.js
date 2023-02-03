import React, { useState } from 'react'
import useMousePosition from '../../helpers/linePositionHook'
import { makeLine, lineFunc } from '../../helpers/linesHelpers'
import { AppContext } from '../../App'


export default function InvisibleDiv({ updatePositionCallback, sectionUuid }) {


    const { dragMap, setDragMap, lines, setLines } = React.useContext(AppContext)


    const mousePosition = useMousePosition

    const [isStoped, setIsStoped] = useState(false)
    const [finalLocation, setFinalLocation] = useState(mousePosition)

    updatePositionCallback(sectionUuid, lines)

    React.useEffect(() => {
        makeLine(lines, sectionUuid)
    }, [])

    function handleClick() {
        console.log('clickaaa')
        setIsStoped(true)
        setFinalLocation(mousePosition)


        lineFunc(document.getElementById(sectionUuid), lines, setLines, dragMap, setDragMap, true)
    }



    return (
        <div
            className='invisibleDiv'
            id={sectionUuid}
            style={{
                display: 'block',
                position: 'fixed',
                width: '5px',
                height: '5px',
                top: isStoped ? finalLocation.y : mousePosition.y,
                left: isStoped ? finalLocation.x : mousePosition.x
            }
            }
            stoped={isStoped}
            onClick={handleClick}
        />)
}

