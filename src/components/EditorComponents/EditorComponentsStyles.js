import styled from 'styled-components';

export const Container = styled.div`
  touch-action: none;
  font-size: 1.5em;
  text-align: center;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 2rem;
  background-color: var(--editor-background-color);
  background-size: 25px 25px;
  background-image: radial-gradient(circle, #8d8d8d 1px, rgba(0, 0, 0, 0) 1px);
`;