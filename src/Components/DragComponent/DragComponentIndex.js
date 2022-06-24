import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'

export default function DragComponentIndex({name, svg}) {

    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'text/html');
    const currentSvg = doc.getElementsByTagName('svg')[0];

    //Ainda não terminado
    function DragComponent() {
        const [{ x, y }, api] = useSpring(() => ({ x: 200, y: 200 }))
        const bind = useDrag(({ offset: [x, y] }) => api.start({ x, y }))
        return (
        <animated.div {...bind()} style={{ x, y }}  className='teste'>
          <svg
          dangerouslySetInnerHTML={{__html: currentSvg.innerHTML}}
          />
        </animated.div>)
      }


  return (
    <div>{DragComponent()}</div>
  )
}
