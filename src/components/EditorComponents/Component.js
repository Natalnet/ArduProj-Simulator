import React from 'react';
import "@wokwi/elements";
import LeaderLine from 'react-leader-line'
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';

function Component({limitsContainer, Component, diagram, CompleteDiagram, compId, setDiagram, handleDoubleClick}) {
  let line;
  const el = React.useRef(null);

  setTimeout(() => {
    console.log(el.current?.pinInfo)
  }, 1000);
  
  const bindingDiagram = (ox, oy) => {
    let diagramCopy = CompleteDiagram;
    diagramCopy.parts = diagramCopy.parts.map((el, id) => {
      if(id === compId) {el.top = oy; el.left = ox;}
      return el;
    });
    if(line){
      line.position();
    }else{
      line = new LeaderLine(
        document.getElementById('uno'),
        document.querySelector('#led1')
      );
      line.setOptions({ 
        color: 'green',
        startPlug: 'disc',
        endPlug: 'disc'
      });
    } 
    setDiagram(diagramCopy);
  }
  const [{ x, y }, api] = useSpring(() => ({ x: diagram.left, y: diagram.top }))
  const bind = useDrag(({ down, offset: [ox, oy] }) => {
    bindingDiagram(ox, oy)
    api.start({ x: ox, y: oy, immediate: down })
  }, { bounds: limitsContainer, rubberband: true });
  return (
    <animated.div 
      {...bind()} 
      style={{ x, y, width: "fit-content", cursor: 'pointer', touchAction: 'none' }} 
      id={`component-${diagram.id}`
    }>
      <Component id={diagram.id} ref={el} {...diagram.attrs} style={{position: "absolute"}} onClick={e => {if(e.detail === 2) handleDoubleClick(diagram)}}/>
    </animated.div>
  );
}

export default Component;