import React from 'react'
import './SideBarStyle.css'
import DropZone from '../DropZone/DropZone';
import SvgGrid from '../SvgGrid/SvgGrid';
import { AppContext } from '../../App'
import { changeColor } from '../../Functions/Behavior';
import ToolsButton from '../ToolsButton/ToolsButton';

import code_default from '../../Functions/default_code';
import WorkerBuilder from '../ArduinoSimulator/worker-builder';
import Worker from '../ArduinoSimulator/arduino.worker';
import ToolsGrid from '../ToolsGrid/ToolsGrid';

export default function SideBar(pageAlignment) {

  //Arquivos importados

  const { data, setData, setDragMap, dragMap, } = React.useContext(AppContext)

  //const [alignment, setAlignment] = React.useState(pageAlignment)

  const [entrada, setEntrada] = React.useState(0)

  const [screen, setScreen] = React.useState('components')

  const [running, setRunning] = React.useState(false)

  var arduino = undefined; //variavel para guardar a instancia em execução

  function testButton() {
    console.log(entrada)
    changeColor(entrada, dragMap[0].id)
    if (entrada === 0) {
      setEntrada(1)
    } else { setEntrada(0) }
  }

  function createLed() {
    console.log(entrada)
    /*
    changeColor(entrada,dragMap[0].id)
    if (entrada === 0) {
      setEntrada(1)
    } else {setEntrada(0)}
    */

    console.log("Compiling code " + code_default);
    fetch('http://localhost:3001/compile-wasm',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 'code': code_default })
      }
    )
      .then(async (response) => {
        const resJson = await response.json();
        //lastExecuted = resJson.res;
        //executedCode = code_default;
        console.log(resJson, `http://localhost:3001/${resJson.res.jsfile}`);
        /*versão com js global*/
        //loadJS(`http://localhost:3001/${resJson.res.jsfile}`);

        /*versão com workers*/
        var instance = new WorkerBuilder(Worker);
        instance.onmessage = (msg) => {

          if (msg.data.type === 'stateUpdate') {
            var pinStates = JSON.parse(msg.data.pinValues);
            /*TODO: @Mario adiciona aqui a lógica para mudar a cor do led*/
          }
        };
        instance.addEventListener("error", (event) => {
          console.log("error while loading " + event.message + " on " + event.filename + "::" + event.lineno);
          instance.terminate();
        });
        if (arduino !== undefined)
          arduino.terminate()

        arduino = instance
        arduino.postMessage({ start: `http://localhost:3001/${resJson.res.jsfile}` });
      })
      .then(data => console.log(data))
      .catch((error) => {
        setRunning(false);
        console.error('Error:', error);
      });

  }

  //Função que testa se a pagina esta no simulador ou editor e adiciona o dropzone baseado nisso
  const hasDropZone = () => {
    if (pageAlignment.pageAlignment == 'simulador') {
      return <DropZone data={data} setData={setData} />
    } else {
      return
    }
  }

  const screenDisplay = () => {
    if (screen == 'components') {
      return <SvgGrid data={data} />
    } else {
      return <ToolsGrid />
    }
  }

  //Função que testa se a pagina esta no simulador ou editor e adiciona o toolsButton baseado nisso
  const hasTools = () => {
    if (pageAlignment.pageAlignment === 'simulador') {
      return
    } else {
      console.log(pageAlignment)
      return (<ToolsButton screen={screen} setScreen={setScreen} />)
    }
  }


  return (
    <div className="SideBar" >
      {hasDropZone()}
      {screenDisplay()}
      {hasTools()}
    </div>
  )
}
