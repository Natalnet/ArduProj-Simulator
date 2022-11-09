import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'
import { EditorContext } from '../../Pages/Editor/Editor'


export default function ToolsAreaComponent(props) {

    const { connectorList } = React.useContext(EditorContext)

    const [screenOpened, setScreenOpened] = React.useState(false)

    const [{ x, y, width, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        width: '3rem',
        height: '3rem'
    }))

    function openScreen() {
        setScreenOpened(true)
        //TODO: criar transição com css ou usar o useSpring
        let animated = document.getElementById(`toolsDiv/${props.id}`)
        let aberto = false
        animated.style.width == '3rem' ? aberto = false : aberto = true
        if (!aberto) {
            animated.style.width = '12rem'
            animated.style.height = '9rem'

            return 'children'
        } else {
            animated.style.width = '3rem'
            animated.style.height = '3rem'
        }

    }

    function isOpened() {
        if (screenOpened) {
            //! MAP NÃO ESTA FUNCIONANDO
            connectorList.map(c => {
                console.log(c)
                return (
                    <p>{c.name}</p>
                )
            })
        } else {
            return (props.icon)
        }
    }

    function DragComponent() {

        const bind = useDrag((params) => {
            api.set({
                x: params.offset[0],
                y: params.offset[1]
            })


            if (params.tap && params.elapsedTime >= 500 && props.type === 'screen') {
                openScreen()
            }




        },
            ({ down, movement: [mx, my] }) => api.start({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 })


        )
        if (props.type == 'wire') {
            return (
                <animated.div
                    {...bind()}
                    style={{
                        x, y, width, height,
                        pointerEvents: 'auto',
                        backgroundColor: props.color,
                        borderRadius: '15%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    id={`toolsDiv/${props.id}`}
                >
                    {props.icon}
                    <div
                        style={{
                            backgroundColor: props.color,
                            width: '1rem',
                            height: '1rem',
                            borderRadius: '100%',
                            position: 'absolute',
                            right: '-.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                width: '.6rem',
                                height: '.6rem',
                                borderRadius: '100%',


                            }}
                        />
                    </div>
                </animated.div>)
        } else {
            //TODO: Colocar o codigo para precisar segurar pra abrir a tela
            return (
                <animated.div
                    {...bind()}
                    style={{
                        x, y, width, height,
                        pointerEvents: 'auto',
                        backgroundColor: props.color,
                        borderRadius: '15%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    id={`toolsDiv/${props.id}`}
                >
                    {isOpened}
                </animated.div>)
        }

    }

    return (
        <div
            className='svgDiv'
            id={props.id}
            style={{
                position: 'fixed',
                x: 400,
                y: -300,
                pointerEvents: 'none',

            }}
        >
            {DragComponent()}
        </div>
    )
}
