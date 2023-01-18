import React from 'react'
import '../SvgGridItem/SvgGridItemStyle.css'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { EditorContext } from '../../Pages/Editor/Editor'

export default function SvgGridItemEditor({ svg, name, breadboard, part }) {



    const { setEditorComponent } = React.useContext(EditorContext)
    

    function dragMapHandler() {
            setEditorComponent({ componentName: name, breadboard: breadboard, part: part })
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
