import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'


export default function ToolsAreaComponent(props) {

    const [{ x, y, width, height }, api] = useSpring(() => ({
        x: 0,
        y: 0,
        width: '3rem',
        height: '3rem'
    }))

    function DragComponent() {

        const bind = useDrag((params) => {
            api.set({
                x: params.offset[0],
                y: params.offset[1]
            })

            /*
            if(params.tap && params.elapsedTime >= 500 && params.event.target.className.baseVal === 'connector') {
              lineFunc(params.event.target,lines,setLines)
            }
            */



        },
            ({ down, movement: [mx, my] }) => api.start({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 })


        )
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
