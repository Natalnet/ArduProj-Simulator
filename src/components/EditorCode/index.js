import React from "react";
import { Container, Header, Content, InputEditor, TabsContainer, ContainerActions, Tab, ButtonAction } from "./EditorCodeStyle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

import WorkerBuilder from './ArduinoWorker/worker-builder';
import Worker from './ArduinoWorker/arduino.worker';

function EditorCode({editorCodeStatus, handleStatusEditorCode, diagram, setDiagram, code, setCode}) {
  const [tabsStatus, setTabsStatus] = React.useState({code: true, diagram: false});
  const [valueDiagram, setValueDiagram] = React.useState(JSON.stringify(diagram));
  const [running, setRunning] = React.useState(false);

  var executedCode, lastExecuted;

  var Arduinos = []; //vetor com ambientes de execução

  /*
  setInterval(
    function () {
      if(Arduinos.length > 0){
        Arduinos[Arduinos.length - 1].postMessage({getState: `?`});
      }
    }, 1000
  );
  */

  React.useEffect(() => {
    setValueDiagram(JSON.stringify(diagram))
  }, [diagram]);

  function loadJS(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);
  
    document.body.appendChild(scriptEle);
  
    // success event 
    scriptEle.addEventListener("load", () => {
      console.log("File loaded " + window.Module)
      scriptEle.remove();
      Arduinos.push(window.Arduino)
      Arduinos[Arduinos.length - 1]();
    });
     // error event
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
      scriptEle.remove();
    });
  }

  const runCode = (code_) => {
    try{
      setDiagram(JSON.parse(valueDiagram));
    }catch(e){
      console.error("Diagrama incorreto: ", e)
      return 0;
    }
    setRunning(true);
    if (executedCode === code_){
      console.log("Calling main");
      Arduinos[Arduinos.length - 1].terminate();
      Arduinos[Arduinos.length - 1] = new WorkerBuilder(Worker);
      Arduinos[Arduinos.length - 1].postMessage({start: `http://localhost:3001/${lastExecuted.jsfile}`});
      //Arduinos[Arduinos.length - 1].postMessage({getState: `?`});
    }else{
      console.log("Compiling code " + code_);
      fetch('http://localhost:3001/compile-wasm',
        { 
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ 'code' : code_ })
        }
      )
      .then(async (response) => {
        const resJson = await response.json();
        lastExecuted = resJson.res;
        executedCode = code_;
        //console.log(resJson, `http://localhost:3001/${resJson.res.jsfile}`);
        /*versão com js global*/
        //loadJS(`http://localhost:3001/${resJson.res.jsfile}`);

        /*versão com workers*/
        var instance = new WorkerBuilder(Worker);
        instance.onmessage = (msg) => {
          let diagramTemp = JSON.parse(JSON.stringify(diagram));
          
          if(msg.data.type === 'stateUpdate'){
            var pinStates = JSON.parse(msg.data.pinValues);
            
            for(let i = 0; i < diagramTemp.parts.length; i ++){
              if(diagramTemp.parts[i].type === 'wokwi-led'){
                console.log('led state: ', pinStates[13] === 1 ? 'on' : 'off');
                diagramTemp.parts[i].attrs.value = pinStates[13] === 1 ? '1' : '';
                setDiagram(diagramTemp);
              }
            }
            diagramTemp = undefined;
          }
          //console.log("Diagram Values");
          //console.log(diagram);
        };
        instance.addEventListener("error", () => {
          console.log("error while loading");
          instance.terminate();
        });
        Arduinos.push(instance);
        Arduinos[Arduinos.length - 1].postMessage({start: `http://localhost:3001/${resJson.res.jsfile}`});
        
      })
      .then(data => console.log(data))
      .catch((error) => {
        setRunning(false);
        console.error('Error:', error);
      });

    }

    
    
    /*
    .then( async (response) => {
      const resJson = await response.json();
      console.log(resJson);
      
      const resBuffer = new Uint8Array(resJson.res.data);
      const { instance } = await WebAssembly.instantiate(resBuffer, info);
        
      console.log(instance.exports)
      let wasmMemory = instance.exports.memory;
      _malloc = instance.exports.malloc;
      updateGlobalBufferAndViews(wasmMemory.buffer);
      instance.exports.main();

      console.log(`Ret of state ${instance.exports._getArduinoState(0)}`);
    })
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
    */
  };

  const stopSimulation = () => {
    console.log("Stoping simulatiors");
    setRunning(false);
    for (let a of Arduinos){
      a.terminate();
    }
  };

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
            placeholder="Hello World..? (Code)"/> 
        :         
          <InputEditor 
            onChange={(e) => setValueDiagram(e.target.value)}
            value={valueDiagram} 
            placeholder="Hello World..? (Diagram)"/>
        }
        <ContainerActions>
          <ButtonAction running={running} name="run" onClick={() => runCode(code)}>
            <FontAwesomeIcon icon={faPlay} style={{cursor: 'pointer'}}/>
          </ButtonAction>
          <ButtonAction running={running} name="stop" onClick={() => stopSimulation()}>
            <FontAwesomeIcon icon={faStop} style={{cursor: 'pointer'}}/>  
          </ButtonAction>
        </ContainerActions>
      </Content>
    </Container>
  );
}

export default EditorCode;