import styled from 'styled-components';

export const ListComponents = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100% - 70px);
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(min-content, max-content);
  gap: .75rem;
  padding: 0 2rem;
`;
export const ItemList = styled.button`
  width: 100%;
  max-height: 70px;
  display: block;
  background-color: var(--container-color);
  padding: 1rem 0;
  border-radius: .5rem;
  cursor: pointer;
  border:none;
  outline: none;
  font-size: 1rem;
  color: var(--letter-color);
  &:hover {
    opacity: .7;
  }
`;

export const SearchComponent = styled.input`
  width: 100%;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: .25rem;
  border: none;
  outline: none;
  background-color: var(--container-color);
  color: var(--letter-color);
  font-size: 16px;
`;