import React from 'react'
import { createPortal } from 'react-dom'
import './SvgGridItemStyle.css'
import { AppContext } from '../../App'
import uuid from 'react-uuid'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { createConnectors } from '../../helpers/functionHelpers'
import { addConnectortToMatrix } from '../../helpers/connectivitysMatricesObjHelper'


export default function SvgGridItem({ svg, name, breadboard, part, behavior }) {


    const { setDragMap, dragMap, connectivityMtx, setConnectivityMtx, connectivityMtxMap, setConnectivityMtxMap, eletronicMtx, setEletronicMtx } = React.useContext(AppContext)

    function dragMapHandler(xy) {

        // Aqui é criado um novo componente como objeto
        let tempMap = [...dragMap]
        let id = uuid()
        let connectors = createConnectors(part, breadboard, id).connectorList
        tempMap.push({ componentName: name, breadboard: breadboard, part: part, id: id, connectors: connectors, position: xy, behavior:behavior  })

        // É chamada a função helper para a atualização da matriz de conectividade e do seu maping
        let matrixParams = addConnectortToMatrix(id, connectors, connectivityMtx, connectivityMtxMap)

        //Atualização dos states do contexto
        setConnectivityMtx(matrixParams.matrix)
        setConnectivityMtxMap(matrixParams.maping)
        setEletronicMtx(matrixParams.eletronicMatrix)
        setDragMap(tempMap)

    }

    const [{ x, y, scale, zIndex, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        height: '10%'
    }))

    const bind = useDrag((params) => {
        api.start({
            x: params.down ? params.movement[0] : 0,
            y: params.down ? params.movement[1] : 0,
            scale: params.down ? 1.2 : 1,
            zIndex: params.down ? 5 : 0
        })

        if (params.down === false) {
            dragMapHandler(params.xy)
        }

    }
    )

    const svgViewBox = `${svg.viewBox.baseVal.x} ${svg.viewBox.baseVal.y} ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}`

    return (
        <>
            {createPortal(
                <animated.div {...bind()} style={{ x, y, scale, zIndex, height, pointerEvents: 'auto' }} className={'animatedSvgGridItem'}>
                    <div className='ItemDiv'>
                        <svg
                            className='Svg'
                            width='100%'
                            height='100%'
                            viewBox={svgViewBox.toString()}
                            preserveAspectRatio
                            dangerouslySetInnerHTML={{ __html: svg.innerHTML }}
                        />
                    </div>
                </animated.div>,
                document.querySelector('.SideBar')
            )}

        </>

    )
}
