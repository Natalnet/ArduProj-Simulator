import React from 'react'
import './SideBarStyle.css'
import DropZone from '../DropZone/DropZone';
import SvgGrid from '../SvgGrid/SvgGrid';
import { AppContext } from '../../App'
import { changeColor } from '../../helpers/Behavior';
import ToolsButton from '../ToolsButton/ToolsButton';
import { Fab } from '@material-ui/core';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DisplaySettingsRoundedIcon from '@mui/icons-material/DisplaySettingsRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import { EditorContext } from '../../Pages/Editor/Editor';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { editorCodeCaller, updateConnectorsValues } from '../../helpers/functionHelpers';


import code_default from '../../helpers/default_code';
import WorkerBuilder from '../ArduinoSimulator/worker-builder';
import Worker from '../ArduinoSimulator/arduino.worker';
import ToolsGrid from '../ToolsGrid/ToolsGrid';

export default function SideBar(props) {

	//Arquivos importados

	const { data, setData, setDragMap, dragMap, alignment, lines } = React.useContext(AppContext)

	const [screen, setScreen] = React.useState('components')

	const [running, setRunning] = React.useState(false)

	const [intervalId, setIntervalId] = React.useState()

	const [warningSnackBarState, setWarningSnackBarState] = React.useState(false)

	const [clock, setClock] = React.useState({})


	var arduino = undefined; //variavel para guardar a instancia em execução

	function testButton() {
		let func = new Function("input", props.editorCode)
		let algo = 'alogggg'
		func(algo)
	}

	React.useEffect(() => {
		setClock({ tempo: 0 })
	}, [])

	React.useEffect(() => {
		if (running) {
			let count = 0;
			console.log(props.connectorValues)
			let connectorValuesHOLDER = props.connectorValues
			let func = editorCodeCaller(connectorValuesHOLDER, props.editorCode).main
			let funcId = setInterval(() => {
				if (running) {
					let configHolder = editorCodeCaller(undefined, props.editorCode).configPins

					props.setConnectorValues(updateConnectorsValues(props.connectorValues, props.editorCode))
					/*
					Object.keys(configHolder).map((c) => {
						connectorValuesHOLDER = { ...connectorValuesHOLDER, [c]: { value: connectorValuesHOLDER[c].value, type: configHolder[c] } }
					})
					*/
					//props.setConnectorValues(connectorValuesHOLDER)
					count++
					setClock({ ...clock, tempo: clock.tempo++ })
				}
			}, 1000)
			return () => {
				clearInterval(funcId)
				setClock({ tempo: 0 })
			}
		}

	}, [running])

	React.useEffect(() => {
		if (running) {

			//TODO: Mudar a simulação para atualizar quando os connectors mudam. Usar o UseEffect para rodar com o connectorValues.
			let connectorValuesHOLDER = props.connectorValues

			let codeOutPuts = editorCodeCaller(connectorValuesHOLDER, props.editorCode)

			let configHolder = codeOutPuts.configPins


			Object.keys(configHolder).map((c) => {
				connectorValuesHOLDER = { ...connectorValuesHOLDER, [c]: { value: connectorValuesHOLDER[c].value, type: configHolder[c] } }
			})

			let output = codeOutPuts.main
			props.setConnectorValues(output)

		}

	}, [props.connectorValues])


	function updateConfigPins() {
		let configHolder = editorCodeCaller(undefined, props.editorCode).configPins
		let connectorValuesHOLDER = props.connectorValues

		Object.keys(configHolder).map((c) => {
			connectorValuesHOLDER = { ...connectorValuesHOLDER, [c]: { value: connectorValuesHOLDER[c].value, type: configHolder[c] } }
		})

		props.setConnectorValues(connectorValuesHOLDER)
	}


	function startSimulation() {
		console.log(running)
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
			if (props.editorComponent) {
				console.log(running)
				if (running) {
					setRunning(false)
				} else {
					setRunning(true)
				}
			} else {
				setWarningSnackBarState(true)
				setTimeout(() => { setWarningSnackBarState(false) }, 1000)
			}
		}
	}

	function stopSimulation() {
		clearInterval(intervalId)
	}

	function SlideTransition(props) {
		return <Slide {...props} direction="up" />;
	}


	//Função que testa se a pagina esta no simulador ou editor e adiciona o dropzone baseado nisso
	const hasDropZone = () => {
		if (alignment == 'simulador') {
			return <DropZone data={data} setData={setData} />
		} else {
			return <DropZone data={data} setData={setData} />
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

	const testFunc = () => {
		console.log(lines)
		console.log(dragMap)
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
				onClick={() => { setRunning(!running) }}
			>
				{running ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
			</Fab>
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					top: '5rem',
					right: '-1.25rem'
				}}
				onClick={() => { testFunc() }}
			>
				<SaveRoundedIcon />
			</Fab>
			{hasDropZone()}
			{screen == 'components' ? <SvgGrid data={data} /> : <ToolsGrid />}
			{hasTools()}
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					bottom: '2rem',
					right: '-1.25rem'
				}}
				onClick={() => { updateConfigPins() }}
			>
				<DisplaySettingsRoundedIcon />
			</Fab>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={running}
				message={`Tempo de simulação: ${clock.tempo}s`}
				//* Fazer isso funcionar seria bom: TransitionComponent={SlideTransition()}
				sx={{
					display: 'flex',
					justifyContent: 'center'
				}}
			/>
			<Snackbar
				anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
				open={warningSnackBarState}
				message="Você precisa escolher um componente primeiro"
				severity="error"
				autoHideDuration={3000}

			/>
		</div>
	)
}
