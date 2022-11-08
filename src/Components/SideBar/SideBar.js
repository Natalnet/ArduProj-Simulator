import React from 'react'
import './SideBarStyle.css'
import DropZone from '../DropZone/DropZone';
import SvgGrid from '../SvgGrid/SvgGrid';
import { AppContext } from '../../App'
import { changeColor } from '../../Functions/Behavior';
import ToolsButton from '../ToolsButton/ToolsButton';
import { Fab } from '@material-ui/core';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DisplaySettingsRoundedIcon from '@mui/icons-material/DisplaySettingsRounded';
import { EditorContext } from '../../Pages/Editor/Editor';

import code_default from '../../Functions/default_code';
import WorkerBuilder from '../ArduinoSimulator/worker-builder';
import Worker from '../ArduinoSimulator/arduino.worker';
import ToolsGrid from '../ToolsGrid/ToolsGrid';

export default function SideBar({editorCode}) {

	//Arquivos importados

	const { data, setData, setDragMap, dragMap, alignment } = React.useContext(AppContext)
	//const { editorCode } = React.useContext(EditorContext)

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

	function startSimulation() {
		if (alignment == 'simulador') {
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
		} else {
			//TODO: TRANSFORMAR ESSA FUNÇÃO NUMA PROMISSE
			var func = Function(editorCode)
			func()
		}


	}

	//Função que testa se a pagina esta no simulador ou editor e adiciona o dropzone baseado nisso
	const hasDropZone = () => {
		if (alignment == 'simulador') {
			return <DropZone data={data} setData={setData} />
		} else {
			return <DropZone data={data} setData={setData} />
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
		if (alignment === 'simulador') {
			return
		} else {
			return (<ToolsButton screen={screen} setScreen={setScreen} />)
		}
	}


	return (
		<div className="SideBar" >
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					top: '1rem',
					right: '-1.25rem'
				}}
				//TODO ADICIONAR A FUNÇÃO PARA LIGAR O SIMULADOR AQUI
				onClick={() => { startSimulation() }}
			>
				<PlayArrowRoundedIcon />
			</Fab>
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					top: '5rem',
					right: '-1.25rem'
				}}
				onClick={() => { console.log(editorCode) }}
			>
				<SaveRoundedIcon />
			</Fab>
			{hasDropZone()}
			{screenDisplay()}
			{hasTools()}
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					bottom: '2rem',
					right: '-1.25rem'
				}}
			>
				<DisplaySettingsRoundedIcon />
			</Fab>
		</div>
	)
}
