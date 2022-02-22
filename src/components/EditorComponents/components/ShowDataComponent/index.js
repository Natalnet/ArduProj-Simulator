import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DataContainer, DataHeader, DataContent, InputGroup, Input, LabelInput, InputContainer } from './ShowDataComponentStyle';

const capitalizeName = name => name.replace(/\b(\w)/g, s => s.toUpperCase());

function ShowDataComponent({currentEditComponent, setCurrentEditComponent}) {
  const nameComponent = currentEditComponent.type.replace('wokwi-', '').replace(/-/g, ' ');
  const changeCurrentComponent = (isAttr, key, value) => {
    console.log(isAttr, key, value)
    let copyCurrentEditComponent = currentEditComponent;
    if(!isAttr){
      copyCurrentEditComponent[key] = value
    }else{
      copyCurrentEditComponent['attrs'][key] = value;
    };
    setCurrentEditComponent(copyCurrentEditComponent);
  }
  return (
    <DataContainer>
      <DataHeader>
        <p>{capitalizeName(nameComponent)}</p>
        <FontAwesomeIcon icon={faTimes} onClick={() => setCurrentEditComponent(null)} style={{cursor: 'pointer'}}/>
      </DataHeader>
      <DataContent>
        <InputGroup>
          <InputContainer>
            <LabelInput htmlFor="top">Top</LabelInput>
            <Input type="text" id="top" value={currentEditComponent.top} onChange={e => changeCurrentComponent(false, 'top', parseFloat(e.target.value))}/>
          </InputContainer>
          <InputContainer>
            <LabelInput htmlFor="left">Left</LabelInput>
            <Input type="text" id="left" value={currentEditComponent.left} onChange={e => changeCurrentComponent(false, 'left', parseFloat(e.target.value))}/>
          </InputContainer>
        </InputGroup>

        {Object.keys(currentEditComponent.attrs).map((key, id) => (
          <InputGroup key={`${key}-${id}`}>
            <InputContainer>
              <LabelInput>{key}</LabelInput>
              <Input 
                value={currentEditComponent.attrs[key]} 
                onChange={(e) => changeCurrentComponent(true, key, e.target.value)}
              />
            </InputContainer>
          </InputGroup>
        ))}

      </DataContent>
    </DataContainer>
  );
}

export default ShowDataComponent;