import styled from 'styled-components';

export const DataContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 1rem;
  background-color: var(--base-color);
  color: var(--letter-color);
  z-index: 9;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
export const DataHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DataContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 1rem;
`;
export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  gap: .25rem;
  width: 100%;
`;
export const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;
export const LabelInput = styled.label`
  font-size: 1rem;
  margin-bottom: .25rem;
`;
export const Input = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: .5rem 1rem;
  border-radius: .25rem;
  border: none;
  outline: none;
  background-color: var(--container-color);
  color: var(--letter-color);
  font-size: 1rem;
`;