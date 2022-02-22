import { HeaderContainer,MenuButton } from './HeaderStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

function Header({editorCodeStatus, handleStatusEditorCode}) {
  return (
    <HeaderContainer>
      <MenuButton onClick={handleStatusEditorCode}>
        <FontAwesomeIcon icon={faBars} />
      </MenuButton>
      Arduino Proj. Simulator - v1.0.0
    </HeaderContainer>
  );
}

export default Header;