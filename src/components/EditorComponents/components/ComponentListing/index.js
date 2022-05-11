import React from "react";
import parts from '../../../../lib/parts';
import {ListComponents, ItemList, SearchComponent } from './ComponentListingStyles';

function ComponentListing({setDiagram, diagram, statusModal, setStatusModal}) {
  const [partsToRender, setPartsToRender] = React.useState(parts);

  const handdleAddComponent = (name) => {
    try{
      let component = parts.filter(part => part.name === name)[0];
      let diagramCopy = JSON.parse(JSON.stringify(diagram));
      diagramCopy.parts.push(JSON.parse(component.diagram));
      setDiagram(diagramCopy);
      setStatusModal(!statusModal);
    }catch(e){
      console.error(`Could not add ${name}. \n [Error] - ${e}`)
    }
  }

  const handleFilterParts = (e) => {
    let value = e.target.value;
    if(e.target.value === '') return setPartsToRender(parts);
    setPartsToRender( parts.filter(el => el.name.toLowerCase().includes(value.toLowerCase())) );
  }

  return (
    <>
      <div style={{padding: "0 2rem"}}>
        <SearchComponent onChange={handleFilterParts} placeholder="Buscar componente..."/>
      </div>
      <ListComponents>
        {partsToRender.map((comp, id) => (
          <ItemList key={id} onClick={()=>handdleAddComponent(comp.name)}>{comp.name}</ItemList>
        ))}
      </ListComponents>
    </>
  );
}

export default ComponentListing;