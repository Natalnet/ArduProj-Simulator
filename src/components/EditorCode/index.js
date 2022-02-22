import React from "react";
import { Container, Header, Content, InputEditor, TabsContainer, Tab } from "./EditorCodeStyle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function EditorCode({editorCodeStatus, handleStatusEditorCode, diagram, setDiagram, code, setCode}) {
  const [tabsStatus, setTabsStatus] = React.useState({code: true, diagram: false});

  return (
    <Container status={!editorCodeStatus}>
      <Header>
        <TabsContainer>
          <Tab 
            onClick={() => setTabsStatus({code: true, diagram: false})}
            style={{opacity: `${tabsStatus.code ? '1' : '.5'}`}}>Code</Tab>
          <Tab 
            onClick={() => setTabsStatus({code: false, diagram: true})}
            style={{opacity: `${tabsStatus.diagram ? '1' : '.5'}`}}
            >Diagram</Tab>
        </TabsContainer>
        <FontAwesomeIcon icon={faTimes} onClick={handleStatusEditorCode} style={{cursor: 'pointer'}}/>
      </Header>
      <Content>
        { tabsStatus.code ? 
          <InputEditor 
            onChange={(e) => setCode(e.target.value)}
            value={code} 
            placeholder="Hello World..? (Code)"/> :
          <InputEditor 
            onChange={(e) => setDiagram(JSON.parse(e.target.value))}
            value={JSON.stringify(diagram)} 
            placeholder="Hello World..? (Diagram)"/>
        }
      </Content>
    </Container>
  );
}

export default EditorCode;