import React from 'react';
import Modal from '../../../Modal';
import ComponentListing from '../ComponentListing';
import {ButtonStatusAddComponent} from './StyleListComponents';

function ListComponents({setDiagram, diagram}) {

  const [modalStatus, setModalStatus] = React.useState(false);

  return (
    <>
      <ButtonStatusAddComponent onClick={() => {setModalStatus(!modalStatus)}}>
        Adicionar Componente
      </ButtonStatusAddComponent>
      <Modal 
        status={modalStatus} 
        setStatus={setModalStatus} 
        title={"Componentes"} 
        children={<ComponentListing 
          statusModal={modalStatus} 
          setStatusModal={setModalStatus} 
          setDiagram={setDiagram} 
          diagram={diagram}/>}
      />
    </>
  );
}

export default ListComponents;