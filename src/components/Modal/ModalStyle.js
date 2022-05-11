import styled from 'styled-components';

export const Container = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 1rem;
  background-color: var(--base-color);
  color: var(--letter-color);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
  padding: 1rem 2rem;
`;

export const ModalBody = styled.div`
  padding: 1rem 0;
  height: calc(100% - 70px); 
`;