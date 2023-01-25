import React from 'react'
import './SvgGridItemStyle.css'
import { AppContext } from '../../App'
import uuid from 'react-uuid'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { createConnectors } from '../../helpers/functionHelpers'
import { addConnectortToMatrix } from '../../helpers/connectivitysMatricesHelper'


export default function SvgGridItem({ svg, name, breadboard, part }) {


    const { setDragMap, dragMap, connectivityMtx, setConnectivityMtx, connectivityMtxMap, setConnectivityMtxMap } = React.useContext(AppContext)

    

    function dragMapHandler() {
            let tempMap = [...dragMap]
            let id = uuid()
            let connectors = createConnectors(part, breadboard, id).connectorList
            tempMap.push({ componentName: name, breadboard: breadboard, part: part, id: id, connectors: connectors })
            console.log(connectors)

            let matrixParams = addConnectortToMatrix(id, connectors, connectivityMtx, connectivityMtxMap )

            setConnectivityMtx(matrixParams.matrix)
            setConnectivityMtxMap(matrixParams.maping) 
            setDragMap(tempMap)
       
    }

    const [{ x, y, scale, zindex }, api] = useSpring(() => ({
        x: 0,
        y: 0
    }))

    const bind = useDrag(({ down, movement: [mx, my] }) =>
        api.start({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1, zindex: down ? 5 : 2 })
    )



    return (
        <animated.div {...bind()} style={{ x, y, scale, zindex, pointerEvents: 'auto' }} className={'animatedSvgGridItem'}>
            <div className='ItemDiv' onClick={() => { dragMapHandler() }}>

                <div
                    className='SvgDiv'
                    width={svg.width.baseVal.value}
                    height={svg.height.baseVal.value}
                >
                    <svg
                        className='Svg'
                        width={svg.width.baseVal.value}
                        height={svg.height.baseVal.value}
                        dangerouslySetInnerHTML={{ __html: svg.innerHTML }}
                    />
                </div>
            </div>
        </animated.div>
    )
}
