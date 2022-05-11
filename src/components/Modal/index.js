import React from "react";
import { Container, Content, ModalHeader, ModalBody } from "./ModalStyle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Modal({status, setStatus, title, children}) {
  if(!status){
    return <></>;
  }else{
    return (
      <Container >
        <Content>
          <ModalHeader>
            {title}
            <FontAwesomeIcon icon={faTimes} onClick={() => setStatus(!status)} style={{cursor: 'pointer'}}/>
          </ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
        </Content>
      </Container> 
    );
  }
}

export default Modal;