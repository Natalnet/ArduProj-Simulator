import React from 'react'
import { createPortal } from 'react-dom'
import './SvgGridItemStyle.css'
import { AppContext } from '../../App'
import uuid from 'react-uuid'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { createConnectors } from '../../helpers/functionHelpers'
import { addConnectortToMatrix } from '../../helpers/connectivitysMatricesHelper'


export default function SvgGridItem({ svg, name, breadboard, part }) {


    const { setDragMap, dragMap, connectivityMtx, setConnectivityMtx, connectivityMtxMap, setConnectivityMtxMap } = React.useContext(AppContext)



    function dragMapHandler(xy) {
        let tempMap = [...dragMap]
        let id = uuid()
        let connectors = createConnectors(part, breadboard, id).connectorList
        tempMap.push({ componentName: name, breadboard: breadboard, part: part, id: id, connectors: connectors, position: xy })

        let matrixParams = addConnectortToMatrix(id, connectors, connectivityMtx, connectivityMtxMap)

        setConnectivityMtx(matrixParams.matrix)
        setConnectivityMtxMap(matrixParams.maping)
        setDragMap(tempMap)

    }

    const [{ x, y, scale, zindex }, api] = useSpring(() => ({
        x: 0,
        y: 0
    }))

    const bind = useDrag((params) => {
        api.start({ 
            x: params.down ? params.movement[0] : 0, 
            y: params.down ? params.movement[1]: 0, 
            scale: params.down ? 1.2 : 1, 
            zIndex: params.down ? 5 : 2 })

        if (params.down === false) {
            console.log(params)
            dragMapHandler(params.xy)
        }
        
    },
        (params) => api.start({ 
            x: params.down ? params.movement[0] : 0, 
            y: params.down ? params.movement[1]: 0, 
            scale: params.down ? 1.2 : 1, 
            zIndex: params.down ? 5 : 2 })
    )



    return (
        <>
            {createPortal(
                <animated.div {...bind()} style={{ x, y, scale, zindex, pointerEvents: 'auto' }} className={'animatedSvgGridItem'}>
                    <div className='ItemDiv' onClick={() => {  }}>

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
                </animated.div>,
                document.querySelector('.SideBar')
            )}

        </>

    )
}
