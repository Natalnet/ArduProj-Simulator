import React from "react";
import './App.css';
import { ContainerFlex, Container } from './AppStyles';
import EditorCode from './components/EditorCode';
import Header from './components/Header';
import EditorComponents from './components/EditorComponents';
import defaultDiagram from './lib/defaultDiagram';
import defaultCode from './lib/defaultCode';

function App() {
  const [diagram, setDiagram] = React.useState(defaultDiagram);
  const [code, setCode] = React.useState(defaultCode);
  const [editorCodeStatus, setEditorStatusCode] = React.useState(false);
  const handleStatusEditorCode = () => setEditorStatusCode(!editorCodeStatus);
  
  return (
    <Container>
      <Header editorCodeStatus={editorCodeStatus} handleStatusEditorCode={handleStatusEditorCode}/>
      <ContainerFlex>
        <EditorCode 
          editorCodeStatus={editorCodeStatus} 
          handleStatusEditorCode={handleStatusEditorCode}
          diagram={diagram} setDiagram={setDiagram}
          code={code} setCode={setCode}
        />
        <EditorComponents diagram={diagram} setDiagram={setDiagram}/>     
      </ContainerFlex>
    </Container>
  );
}

export default App;
