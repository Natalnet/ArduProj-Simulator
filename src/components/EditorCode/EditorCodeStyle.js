import styled from 'styled-components';

export const Container = styled.div`
  width: 600px;
  height: 100%;
  position: relative;
  transition: all ease .3s;
  background-size: 40px 40px;
  background-color: var(--base-color);
  color: var(--letter-color);
  margin-left: ${props => props.status? '-600px' : '0'};
`;
export const Header = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: .5rem 1rem 0 .5rem;
  font-size: 1.5rem;
`;
export const Content = styled.div`
  padding: 0 .5rem .5rem .5rem;
  width: 100%;
  height: 95%;
`;
export const InputEditor = styled.textarea`
  width: 100%;
  height: 100%;
  border-radius: 0 .5rem .5rem .5rem;
  resize: none;
  outline: none;
  padding: 1rem;
  background-color: var(--container-color);
  border: none;
  color: var(--letter-color);
`;
export const TabsContainer = styled.div`
  display:flex;
  align-items:center;
  justify-content: flex-end;
  gap: .25rem;
  font-size: 1rem;
`;
export const Tab = styled.div`
  color: var(--letter-color);
  background-color: var(--container-color);
  padding: .5rem 2rem .5rem 1rem;
  border-radius: .5rem 2rem 0 0;
  cursor: pointer;
`;