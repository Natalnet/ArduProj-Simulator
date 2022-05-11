import React, { useState, useEffect, useRef } from 'react'
import Component  from "./Component";
import ListComponents from './components/ListComponents';
import ShowDataComponent from './components/ShowDataComponent';
import { Container } from './EditorComponentsStyles';

function EditorComponents({diagram, setDiagram}) {
  const [limitsContainer, setLimitsContainer] = useState({x: 0, y: 0});
  const [currentEditComponent, setCurrentEditComponent] = useState(null);
  
  const doubleClickSetCurrentEditComponent = (diagram) =>  setCurrentEditComponent(diagram);
  const ref = useRef(null);
  
  return (
    <Container ref={ref} id="components-container">
      <ListComponents setDiagram={setDiagram} diagram={diagram}/>
      {currentEditComponent ? <ShowDataComponent currentEditComponent={currentEditComponent} setCurrentEditComponent={setCurrentEditComponent}/> : ''}
      {diagram.parts.map((e, id) => (
        <Component 
          handleDoubleClick={doubleClickSetCurrentEditComponent}
          limitsContainer={limitsContainer} 
          Component={e.type} 
          diagram={e} 
          CompleteDiagram={diagram} 
          setDiagram={setDiagram} 
          compId={id} 
          key={id}/>
      ))}
    </Container>
  );
}

export default EditorComponents;