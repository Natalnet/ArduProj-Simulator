import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

export default function DragComponentIndex() {

    //Ainda não terminado
    function DragComponent() {
        const [{ x, y }, api] = useSpring(() => ({ x: 200, y: 200 }))
        const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y }))
        return (
        <animated.div {...bind()} style={{ x, y }}  className='teste'>
          <svg></svg>
        </animated.div>)
      }


  return (
    <div>{DragComponent()}</div>
  )
}
