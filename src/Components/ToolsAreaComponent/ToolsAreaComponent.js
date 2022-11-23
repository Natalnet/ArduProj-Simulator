import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'
import { EditorContext } from '../../Pages/Editor/Editor'
import ToolsConnectorList from '../ToolsConnectorList/ToolsConnectorList'


export default function ToolsAreaComponent(props) {

    const { connectorList } = React.useContext(EditorContext)

    const [screenOpened, setScreenOpened] = React.useState(false)

    const [child, setChild] = React.useState(props.icon)



    function screenHandler(command) {
        console.log(command)
        if (!command) {
            if (screenOpened) {
                command = 'close'
            } else {
                command = 'open'
            }
        }

        console.log('comando pos att :' + command)
        let animated = document.getElementById(`toolsDiv/${props.id}`)

        if (command == 'close') {
            animated.style.width = '10rem'
            animated.style.height = '3rem'
            setChild(props.icon)
            setScreenOpened(false)
        } else if (command == 'open') {
            animated.style.width = '12rem'
            animated.style.height = '9rem'
            setChild(<ToolsConnectorList />)
            setScreenOpened(true)
        }
        /*
        setScreenOpened(true)
        //TODO: criar transição com css ou usar o useSpring
        let animated = document.getElementById(`toolsDiv/${props.id}`)
        animated.style.width == '3rem' ? setScreenOpened(false) : setScreenOpened(true)
        if (!screenOpened) {
            animated.style.width = '12rem'
            animated.style.height = '9rem'
            setChild(props.icon)
        } else {
            animated.style.width = '3rem'
            animated.style.height = '3rem'
            setChild(<ToolsConnectorList />)
        }
        */
    }

    const [{ x, y, width, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        width: '3rem',
        height: '3rem'
    }))

    const openButton = () => {
        return (
            <>
                {props.icon}
            </>
        )
    }

    function DragComponent() {

        const bind = useDrag((params) => {
            api.set({
                x: params.offset[0],
                y: params.offset[1]
            })
            if (props.type === 'screen') {
                if (params.tap && params.elapsedTime >= 500) {
                    screenHandler()
                } else if (params.delta[0] != 0 && params.delta[1] != 0) { //TODO: Testar offset em vez de movment
                    screenHandler('close')
                }
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
                    {screenOpened ? <ToolsConnectorList /> : props.icon}
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
