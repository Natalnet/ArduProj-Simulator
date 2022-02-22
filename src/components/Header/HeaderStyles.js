import styled from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  height: 70px;
  background-color: var(--base-color);
  color: var(--letter-color);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;
export const MenuButton = styled.div`
  position: absolute;
  top: 20%;
  left: 1rem;
  font-size: 2rem;
  cursor: pointer;
`;