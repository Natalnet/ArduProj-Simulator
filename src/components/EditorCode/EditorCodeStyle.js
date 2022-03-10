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
  position: relative;
`;
export const InputEditor = styled.textarea`
  width: 100%;
  min-height: 500px;
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
export const ButtonAction = styled.button`
  padding: .5rem .7rem;
  font-size: 1rem;
  border-radius: 50%;
  border: none;
  background-color: var(--button-color);
  color: var(--letter-color);
  margin: .25rem;

  background-color: ${props => {
    if(props.name == 'stop' && props.running){
      return `#db4646;`;
    }else if(props.name == 'run' && props.running){
      return `var(--button-color);
              pointer-events: none;
              opacity: .5;`
    }else{
      return `var(--button-color)`;
    }
  }}
`;
export const ContainerActions = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 1rem;
  right: -3.5rem;
  z-index: 9;
`;
