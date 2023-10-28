import WorkerBuilder from "../Components/ArduinoSimulator/worker-builder";
import ArduinoWorker from "../Components/ArduinoSimulator/arduino.worker";
import ArduinoWorkerMock from "../Components/ArduinoSimulator/arduino.mock";

export function newSimulationController(
    connectivityMtx,
    dragMap,
    data,
    eletronicMtx,
    lines,
    eletronicStateList,
    circuitChanged,
    setCircuitChanged,
    setEletronicMtx
) {
    console.log("simulacao comecoua ");

    let emptyEletronicMtx = true;

    var eletronicMtxHOLDER;
    if (emptyEletronicMtx) {
        eletronicMtxHOLDER = JSON.parse(JSON.stringify(connectivityMtx));
        Object.keys(connectivityMtx).forEach((outConnectorLoop) => {
            Object.keys(connectivityMtx).forEach((inConnectorLoop) => {
                eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null;
            });
        });
    } else {
        eletronicMtxHOLDER = JSON.parse(JSON.stringify(eletronicMtx));
    }

    // Aqui filtramos os componentes e fazemos um Set com apenas aqueles que estão em conexão com um outro componente
    const toBeLookedComponentsSet = new Set();
    lines.forEach((line) => {
        let id;
        id = line.startLine.split("/")[2];
        toBeLookedComponentsSet.add(id);
        id = line.endLine.split("/")[2];
        toBeLookedComponentsSet.add(id);
    });

    // Baseado na filtragem acima conseguimos um dragMap filtrado
    let allSimulatedComponents;
    allSimulatedComponents = dragMap.filter((component) => {
        return toBeLookedComponentsSet.has(component.id);
    });

    var toBeSimulatedComponents = [];
    var simulatedComponents = [];

    // Aqui definimos o primeiro elemento a ser simulado e adicionamos no segundo Set
    allSimulatedComponents.forEach((component) => {
        if (
            component.config.type === "power_source" ||
            component.config.type === "microcontroller"
        ) {
            toBeSimulatedComponents.push(component);
        }
    });

    // Aqui simulamos o primeiro elemento vulgo elemento de alimentação

    //TODO Fazer ele ir tirando os componentes que já foram simulados e parar em algum momento e continuar quando tiver mudanças

    while (toBeSimulatedComponents.length > 0) {
        toBeSimulatedComponents.forEach((component) => {
            if (toBeSimulatedComponents[0].id !== component.id) return;
            console.log("toBeSimulated INICIO DO LOOP: ");
            toBeSimulatedComponents.forEach((component) => {
                console.log(component.componentName);
            });

            // Aqui iteramos pela eletronicMtxHolder para achar qualquer valor de entrada não nulo para o componente atual e guardamos no input
            let input = {};
            component.connectors.forEach((connectorPin) => {
                input[connectorPin.svgId] = null;
            });
            component.connectors.forEach((connectorPin) => {
                Object.keys(eletronicMtxHOLDER).forEach((inComponent) => {
                    if (
                        eletronicMtxHOLDER[inComponent][connectorPin.fullId] !==
                        null
                    ) {
                        //! Ver o caso de multiplos inputs
                        input[connectorPin.svgId] =
                            eletronicMtxHOLDER[inComponent][
                                connectorPin.fullId
                            ];
                    }
                });
            });

            if (component.config.type === "interactive_component") {
                input.events = eletronicStateList[component.id];
            }

            input.id = component.id;

            // Então pegamos o output pelo behavior do componente
            let output = component.doBehavior(input);

            // Depois disso iteramos por cada pino do componente
            Object.keys(component.config.pins).forEach((connectorPin) => {
                // Seguindo apenas com aqueles que são de saida
                //! Ver caso de in-out
                if (component.config.pins[connectorPin] === "in") return;

                // Aqui atualizamos o valor do eletronicMtx para todos que estão conectados com o devido pino
                component.connectors.forEach((connector) => {
                    if (connector.svgId === connectorPin) {
                        connector.connectedTo.forEach((connectedTo) => {
                            eletronicMtxHOLDER[connector.fullId][connectedTo] =
                                output[connectorPin];

                            // Aqui adicionamos o componente connectado ao pino atual e o adicionamos na fila.
                            let toAddComponent = allSimulatedComponents.find(
                                (component) => {
                                    return (
                                        component.id ===
                                        connectedTo.split("/")[2]
                                    );
                                }
                            );
                            if (
                                toBeSimulatedComponents.some(
                                    (component) =>
                                        component.id === toAddComponent.id
                                )
                            )
                                return;
                            if (
                                simulatedComponents.some(
                                    (component) => component === toAddComponent
                                )
                            )
                                return;
                            toBeSimulatedComponents.push(toAddComponent);
                        });
                    }
                });
            });

            simulatedComponents.push(component);

            let shiftResult = toBeSimulatedComponents.shift();

            /*
            !ERRO AQUI vvvvvvvvvvvvvvvvv
            
            !^^^^^^^^^^^^^^^^^^^^^^^^^^
            */
            //toBeSimulatedComponents.filter(toBeSComponents => {return toBeSComponents.id !== component.id} )
        });
    }

    resetComponents(allSimulatedComponents, simulatedComponents);
    setCircuitChanged(false);
    setEletronicMtx(eletronicMtxHOLDER);
}

export function resetCircuit(dragMap, lines, setCircuitChanged) {
    // Aqui filtramos os componentes e fazemos um Set com apenas aqueles que estão em conexão com um outro componente
    const toBeLookedComponentsSet = new Set();
    lines.forEach((line) => {
        let id;
        id = line.startLine.split("/")[2];
        toBeLookedComponentsSet.add(id);
        id = line.endLine.split("/")[2];
        toBeLookedComponentsSet.add(id);
    });

    // Baseado na filtragem acima conseguimos um dragMap filtrado
    let allSimulatedComponents;
    allSimulatedComponents = dragMap.filter((component) => {
        return toBeLookedComponentsSet.has(component.id);
    });

    console.log(allSimulatedComponents);
    resetComponents(allSimulatedComponents, []);
    setCircuitChanged(false);
}

function resetComponents(allSimulatedComponents, simulatedComponents) {
    console.log("r\n e\n s\n e\n t\n");
    let notSimulatedComponents = [];

    if (simulatedComponents.length > 0) {
        allSimulatedComponents.forEach((generalComponent) => {
            if (
                !simulatedComponents.some(
                    (simulatedComponent) =>
                        simulatedComponent.id === generalComponent.id
                )
            )
                notSimulatedComponents.push(generalComponent);
        });
    } else {
        notSimulatedComponents = allSimulatedComponents;
    }
    console.log(notSimulatedComponents);

    notSimulatedComponents.forEach((component) => {
        let input = {};

        input.id = component.id;

        component.connectors.forEach((connector) => {
            input[connector.svgId] = null;
        });

        component.doBehavior(input);
    });

    console.log("e\n n\n d\n r\n");
}

export function runCode(code_, arduinos) {
    /*if (executedCode === code_) {
        console.log("Calling main");
        arduinos[arduinos.length - 1].terminate();
        arduinos[arduinos.length - 1] = new WorkerBuilder(Worker);
        arduinos[arduinos.length - 1].postMessage({ start: `http://localhost:3001/${lastExecuted.jsfile}` });
        //Arduinos[Arduinos.length - 1].postMessage({getState: `?`});
    } else {*/
    console.log("Compiling code " + code_);
    
    fetch("http://localhost:3001/compile-wasm", {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ code: code_ }),
    })
        .then(async (response) => {
            const resJson = await response.json();
            //lastExecuted = resJson.res;
            const executedCode = code_;
            console.log(resJson);
            console.log(`received binary size ${resJson}`);
            /*versão com js global*/
            //loadJS(`http://localhost:3001/${resJson.res.jsfile}`);
            
            let inicializado = false;
            /*versão com workers*/
            var instance = new WorkerBuilder(ArduinoWorker);
            
            //var instance = new WorkerBuilder(ArduinoWorkerMock);
            instance.onmessage = (msg) => {
                //let diagramTemp = JSON.parse(JSON.stringify(diagram));

                if (msg.data.type === "stateUpdate") {
                    var pinStates = JSON.parse(msg.data.pinValues);

                    //for (let i = 0; i < diagramTemp.parts.length; i++) {
                    //if (diagramTemp.parts[i].type === 'wokwi-led') {
                    console.log(`pin states: ${pinStates}`);
                    instance.pinState = pinStates;
                    //* setCircuitChanged()
                    //* instance.setPinStates(pinStates)

                    //    diagramTemp.parts[i].attrs.value = pinStates[13] === 1 ? '1' : '';
                    //    setDiagram(diagramTemp);
                    //}
                    //diagramTemp = undefined;
                }
                else if (msg.data.type === "log"){
                    inicializado = true;
                    console.log("Inicializacao terminada");
                }
                
                //console.log("Diagram Values");
                //console.log(diagram);
            };
            instance.addEventListener("error", () => {
                console.log("error while loading");
                instance.terminate();
            });
            arduinos.push(instance);
            arduinos[arduinos.length - 1].postMessage({
                start: resJson.res.binary,
            });

            //while(!inicializado);

        })
        .then((data) => console.log(data))
        .catch((error) => {
            console.error("Error:", error);
        });

    //}
}
