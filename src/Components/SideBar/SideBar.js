import React from 'react'
import './SideBarStyle.css'
import DropZone from '../DropZone/DropZone';
import SvgGrid from '../SvgGrid/SvgGrid';
import ToolsButton from '../ToolsButton/ToolsButton';
import ToolsGrid from '../ToolsGrid/ToolsGrid';

import { AppContext } from '../../App'
import { EditorContext } from '../../Pages/Editor/Editor';
import { changeColor } from '../../helpers/Behavior';
import { editorCodeCaller, updateConnectorsValues } from '../../helpers/functionHelpers';

import { Fab } from '@material-ui/core';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DisplaySettingsRoundedIcon from '@mui/icons-material/DisplaySettingsRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import code_default from '../../helpers/default_code';
import WorkerBuilder from '../ArduinoSimulator/worker-builder';
import Worker from '../ArduinoSimulator/arduino.worker';
import { simulationController, simulationSetup } from '../../helpers/simulationController';

export default function SideBar(props) {

	//Arquivos importados

	const { data, setData, dragMap, alignment, lines, connectivityMtxMap, connectivityMtx, eletronicMtx, setEletronicMtx, running, setRunning, eletronicStateList, setEletronicStateList } = React.useContext(AppContext)

	const [screen, setScreen] = React.useState('components')

	const [intervalId, setIntervalId] = React.useState()

	const [warningSnackBarState, setWarningSnackBarState] = React.useState(false)

	const [clock, setClock] = React.useState({})


	var arduino = undefined; //variavel para guardar a instancia em execução

	React.useEffect(() => {
		setClock({ tempo: 0 })
	}, [])

	/*
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
	*/

	React.useEffect(() => {
		if(running) {
            simulationSetup(dragMap, eletronicStateList, setEletronicStateList)
            let auxIntervalId = setInterval(() => {
				try {
					console.log(eletronicMtx)
					let auxEletronicMtx = JSON.parse(JSON.stringify(simulationController(connectivityMtx, connectivityMtxMap, dragMap, data, eletronicMtx, lines, eletronicStateList)))
					setEletronicMtx(auxEletronicMtx)
					console.log(auxEletronicMtx)
					console.log(eletronicMtx)
				} catch (error) {
					console.log(error)
				}
            
				setClock({ ...clock, tempo: clock.tempo++ })
            }, 1000)
			setIntervalId(auxIntervalId)
		}
	},
	[running])
	
	function updateConfigPins() {
		let configHolder = editorCodeCaller(undefined, props.editorCode).configPins
		let connectorValuesHOLDER = props.connectorValues

		Object.keys(configHolder).map((c) => {
			connectorValuesHOLDER = { ...connectorValuesHOLDER, [c]: { value: connectorValuesHOLDER[c].value, type: configHolder[c] } }
		})

		props.setConnectorValues(connectorValuesHOLDER)
	}


	function startSimulation() {
		if (alignment == 'simulador') {
			/*
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

					//versão com workers
					/*
					var instance = new WorkerBuilder(Worker);
					instance.onmessage = (msg) => {

						if (msg.data.type === 'stateUpdate') {
							var pinStates = JSON.parse(msg.data.pinValues);
							//TODO: @Mario adiciona aqui a lógica para mudar a cor do led
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
				*/
				if (running) {
					setRunning(false)
					let auxIntervalId = intervalId
					clearInterval(auxIntervalId)
					setClock({ tempo: 0 })
				}
				 else {
					setRunning(true)
				}
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

	const saveButton = () => {
		if (alignment === 'editor') {
			const jszip = new JSZip()

			console.log(data)
			console.log(props.editorComponent)

			data.forEach(component => {
				jszip.file(`breadboard.${component.componentName}.svg`, component.breadboard)
				jszip.file(`part.${component.componentName}.fzp`, component.part)
				jszip.file(`behavior.${component.componentName}.js`, component.behavior)
			})

			jszip.generateAsync({ type: 'blob' })
				.then(function (blob) {
					saveAs(blob, 'customElement.zip')
				})
		} else {
			console.log('dragMap:')
		console.log(dragMap)
		console.log('connectivityMtx:')
		console.log(connectivityMtx)
		console.log('lines:')
		console.log(lines)
		console.log('data:')
		console.log(data)
		console.log('eletronicMtx:')
		console.log(eletronicMtx)
		console.log('connectivityMtxMap:')
		console.log(connectivityMtxMap)
		setEletronicMtx(simulationController(connectivityMtx, connectivityMtxMap, dragMap, data, eletronicMtx, lines))
		}
	}


	return (
		<div className="SideBar" >
			<div className='DropZoneHolder'>
				{hasDropZone()}
			</div>
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					top: '11rem',
					right: '-1.25rem',
					zIndex: 1
				}}
				onClick={() => { startSimulation() }}
			>
				{running ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
			</Fab>
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					top: '15rem',
					right: '-1.25rem',
					zIndex: 1
				}}
				onClick={() => { saveButton() }}
			>
				<SaveRoundedIcon />
			</Fab>
			{screen == 'components' ? <SvgGrid data={data} /> : <ToolsGrid />}
			{hasTools()}
			<Fab
				className='FabButton'
				size='small'
				style={{
					position: 'absolute',
					bottom: '3rem',
					right: '-1.25rem',
					zIndex: 1
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
