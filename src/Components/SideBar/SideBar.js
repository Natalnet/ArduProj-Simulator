import React from "react";
import "./SideBarStyle.css";
import DropZone from "../DropZone/DropZone";
import SvgGrid from "../SvgGrid/SvgGrid";
import ToolsButton from "../ToolsButton/ToolsButton";
import ToolsGrid from "../ToolsGrid/ToolsGrid";

import { AppContext } from "../../App";
import { EditorContext } from "../../Pages/Editor/Editor";
import { changeColor } from "../../helpers/Behavior";
import {
    editorCodeCaller,
    updateConnectorsValues,
} from "../../helpers/functionHelpers";

import { Fab } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DisplaySettingsRoundedIcon from "@mui/icons-material/DisplaySettingsRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

import JSZip from "jszip";
import { saveAs } from "file-saver";

import code_default from "../../helpers/default_code";

import {
    simulationController,
    simulationSetup,
} from "../../helpers/simulationController";
import {
    newSimulationController,
    resetCircuit,
    runCode,
} from "../../helpers/newSimulationControler";
import default_code from "../../helpers/default_code";

const PAGINATION_SETTINGS = 3;

export default function SideBar(props) {
    //Arquivos importados

    const {
        data,
        setData,
        dragMap,
        setDragMap,
        alignment,
        lines,
        setLines,
        connectivityMtx,
        setConnectivityMtx,
        eletronicMtx,
        setEletronicMtx,
        running,
        setRunning,
        eletronicStateList,
        setEletronicStateList,
        buildingCircuit,
        setBuildingCircuit,
    } = React.useContext(AppContext);

    const [screen, setScreen] = React.useState("components");

    const [pagination, setPagination] = React.useState(0);

    const [intervalId, setIntervalId] = React.useState();

    const [warningSnackBarState, setWarningSnackBarState] =
        React.useState(false);

    const [clock, setClock] = React.useState({});

    const [finished, setFinished] = React.useState(true);

    const [alertOpen, setAlertOpen] = React.useState(false);

    const [circuitChanged, setCircuitChanged] = React.useState(false);

    const [arduinos, setArduinos] = React.useState([]);

    const [invert, setInvert] = React.useState(false);

    React.useEffect(() => {
        setClock({ tempo: 0 });
    }, []);

    React.useEffect(() => {
        if (running && finished && circuitChanged) {
            let auxIntervalId = setTimeout(() => {
                try {
                    setFinished(false);
                    //let auxEletronicMtx = JSON.parse(JSON.stringify(simulationController(connectivityMtx, dragMap, data, eletronicMtx, lines, eletronicStateList, setCircuitChanged)))
                    newSimulationController(
                        connectivityMtx,
                        dragMap,
                        data,
                        eletronicMtx,
                        lines,
                        eletronicStateList,
                        circuitChanged,
                        setCircuitChanged,
                        setEletronicMtx
                    );
                    //setEletronicMtx(auxEletronicMtx)
                    //console.log(auxEletronicMtx)
                    setFinished(true);
                } catch (error) {
                    console.log(error);
                    setAlertOpen(true);
                }
                setClock({ ...clock, tempo: clock.tempo++ });
            }, 50);
            setIntervalId(auxIntervalId);
        }
        if (!running && circuitChanged) {
            console.log("aqui ó");
            resetCircuit(dragMap, lines, setCircuitChanged);
        }
    }, [
        running,
        eletronicMtx,
        eletronicStateList,
        finished,
        clock,
        circuitChanged,
    ]);

    function updateConfigPins() {

        if(!invert)
            arduinos[0].postMessage({
                    updatePins: [
                        0,//0
                        0,//1
                        0,//2
                        0,//3
                        0,//4
                        0,//5
                        0,//6
                        0,//7
                        0,//8
                        0,//9
                        1,//10
                        0,//11
                        0,//12
                        0//13
                    ]
            })
        else
            arduinos[0].postMessage({
                updatePins: [
                    0,//0
                    0,//1
                    0,//2
                    0,//3
                    0,//4
                    0,//5
                    0,//6
                    0,//7
                    0,//8
                    0,//9
                    0,//10
                    0,//11
                    0,//12
                    0//13
                ]
            })
        
        setInvert(!invert)

        console.log("dragMap:");
        console.log(dragMap);
        console.log("connectivityMtx:");
        console.log(connectivityMtx);
        console.log("lines:");
        console.log(lines);
        console.log("data:");
        console.log(data);
        console.log("eletronicMtx:");
        console.log(eletronicMtx);
        console.log("eletronicStateList:");
        console.log(eletronicStateList);
    }

    function startSimulation() {
        if (alignment === "simulador") {
            if (running) {
                setCircuitChanged(true);
                setRunning(false);
                let auxIntervalId = intervalId;
                clearInterval(auxIntervalId);
                setClock({ tempo: 0 });
                setEletronicMtx(null);
                arduinos[arduinos.length - 1].postMessage({ stop: "stop" });
                arduinos[arduinos.length - 1].terminate();
            } else {
                simulationSetup(
                    dragMap,
                    eletronicStateList,
                    setEletronicStateList,
                    setCircuitChanged
                );
                setCircuitChanged(true);
                setRunning(true);
                runCode(code_default, arduinos, dragMap, eletronicMtx, setEletronicMtx, setCircuitChanged);
            }
        } else {
            if (props.editorComponent) {
                if (running) {
                    setRunning(false);
                } else {
                    setRunning(true);
                }
            } else {
                setWarningSnackBarState(true);
                setTimeout(() => {
                    setWarningSnackBarState(false);
                }, 1000);
            }
        }
    }

    function stopSimulation() {
        clearInterval(intervalId);
    }

    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    //Função que testa se a pagina esta no simulador ou editor e adiciona o dropzone baseado nisso
    const hasDropZone = () => {
        if (alignment == "simulador") {
            return (
                <DropZone
                    data={data}
                    setData={setData}
                    dragMap={dragMap}
                    setDragMap={setDragMap}
                    lines={lines}
                    setLines={setLines}
                    connectivityMtx={connectivityMtx}
                    setConnectivityMtx={setConnectivityMtx}
                    setBuildingCircuit={setBuildingCircuit}
                />
            );
        } else {
            return (
                <DropZone
                    data={data}
                    setData={setData}
                    dragMap={dragMap}
                    setDragMap={setDragMap}
                    lines={lines}
                    setLines={setLines}
                    connectivityMtx={connectivityMtx}
                    setConnectivityMtx={setConnectivityMtx}
                />
            );
        }
    };

    const saveButton = () => {
        if (alignment === "editor") {
            const jszip = new JSZip();

            let dataFolder = jszip.folder("data");

            data.forEach((component) => {
                dataFolder.file(
                    `breadboard.${component.componentName}.svg`,
                    component.breadboard
                );
                dataFolder.file(
                    `part.${component.componentName}.fzp`,
                    component.part
                );
                dataFolder.file(
                    `behavior.${component.componentName}.js`,
                    component.behavior
                );
            });

            jszip.generateAsync({ type: "blob" }).then(function (blob) {
                saveAs(blob, "customElement.zip");
            });
        } else {
            const jszip = new JSZip();

            let dataFolder = jszip.folder("data");

            data.forEach((component) => {
                dataFolder.file(
                    `breadboard.${component.componentName}.svg`,
                    component.breadboard
                );
                dataFolder.file(
                    `part.${component.componentName}.fzp`,
                    component.part
                );
                dataFolder.file(
                    `behavior.${component.componentName}.js`,
                    component.behavior
                );
            });

            let dragMapFolder = jszip.folder("dragMap");

            dragMap.forEach((component) => {
                console.log(component);
                let stringComponent = JSON.stringify(component);
                dragMapFolder.file(
                    `${component.componentName}_${component.id}`,
                    stringComponent
                );
            });

            let stringConnectivityMtx = JSON.stringify(connectivityMtx);
            jszip.file("connectivityMtx", stringConnectivityMtx);

            let linesFolder = jszip.folder("lines");

            lines.forEach((line) => {
                let stringLine = JSON.stringify(line);
                linesFolder.file(`${line.id}`, stringLine);
            });

            jszip.generateAsync({ type: "blob" }).then(function (blob) {
                saveAs(blob, "customCircuit.zip");
            });
        }
    };

    return (
        <div className="SideBar">
            <div className="DropZoneHolder">{hasDropZone()}</div>
            <Fab
                className="FabButton"
                size="small"
                style={{
                    position: "absolute",
                    top: "11rem",
                    right: "-1.25rem",
                    zIndex: 1,
                }}
                onClick={() => {
                    startSimulation();
                }}
            >
                {running ? <StopRoundedIcon /> : <PlayArrowRoundedIcon />}
            </Fab>
            <Fab
                className="FabButton"
                size="small"
                style={{
                    position: "absolute",
                    top: "15rem",
                    right: "-1.25rem",
                    zIndex: 1,
                }}
                onClick={() => {
                    saveButton();
                }}
            >
                <SaveRoundedIcon />
            </Fab>
            {screen == screen ? ( //"components"
                //TODO ver possibilidade de parar de usar as tools ou muda-las
                <SvgGrid
                    pagination={pagination}
                    PAGINATION_SETTINGS={PAGINATION_SETTINGS}
                />
            ) : (
                <ToolsGrid />
            )}

            <Fab
                className="FabButton"
                size="small"
                style={{
                    position: "absolute",
                    bottom: "3rem",
                    right: "-1.25rem",
                    zIndex: 1,
                }}
                onClick={() => {
                    updateConfigPins();
                }}
            >
                <DisplaySettingsRoundedIcon />
            </Fab>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={false}
                message={`Tempo de simulação: ${clock.tempo}s`}
                //* Fazer isso funcionar seria bom: TransitionComponent={SlideTransition()}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            />
            <Snackbar
                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                open={warningSnackBarState}
                message="Você precisa escolher um componente primeiro"
                severity="error"
                autoHideDuration={3000}
            />
            <Collapse
                in={alertOpen}
                style={{
                    position: "fixed",
                    bottom: "0",
                    right: "0",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Alert severity="error">
                    Há um erro na sua simulação.
                    <CloseIcon
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setAlertOpen(false);
                        }}
                    />
                </Alert>
            </Collapse>
            <div id="SideBarItemHolder"></div>
            <ToolsButton
                screen={screen}
                setScreen={setScreen}
                pagination={pagination}
                setPagination={setPagination}
                data={data}
                PAGINATION_SETTINGS={PAGINATION_SETTINGS}
            />
        </div>
    );
}
