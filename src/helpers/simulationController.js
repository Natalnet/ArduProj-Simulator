import { editorCodeCaller } from "./functionHelpers"

export function simulationController(connectivityMtx, connectivityMtxMap, dragMap, data, eletronicMtx, lines, eletronicStateList) {

    let depth = createDepth(lines, dragMap)

    let outConnector = [], inConnector = []


    let eletronicMtxHOLDER

    let isEletronicMtxEmpty = true
    if(eletronicMtx !== null) {
    connectivityMtxMap.forEach(line => {
        connectivityMtxMap.forEach(row => {
            if(eletronicMtx[line][row] !==  null) {
                isEletronicMtxEmpty = false
            }
        })
    })
    }

    if (isEletronicMtxEmpty) {

        eletronicMtxHOLDER = JSON.parse(JSON.stringify(connectivityMtx))
        connectivityMtxMap.forEach( outConnectorLoop => {
            connectivityMtxMap.forEach( inConnectorLoop => {
                eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null
            })
        })

        //Aqui definimos o primeiro elemento a ser chamado baseado em quem é power source
        depth.forEach(depthLevel => {
            depthLevel.forEach(outComponent => {

            let behaviorFunctions = editorCodeCaller(undefined, outComponent.behavior)
            let configOutput = behaviorFunctions.configPins


            if (configOutput.type === 'power_source'){
                outComponent.connectors.forEach(outConnector => {
                    if(configOutput[outConnector.svgId] === 'in'){
                        return
                    }

                    outConnector.connectedTo.forEach(inComponentFullId => {
                        depth.forEach(depthLevel => {
                            depthLevel.forEach(inComponent => {
                                if(inComponent.id !== inComponentFullId.split('/')[2]) return
                                inComponent.connectors.forEach( inConnector => {
                                    let isConnectedTo = outConnector.connectedTo.some(outConnectorConnectedTo => {
                                        return outConnectorConnectedTo === inConnector.fullId
                                    } )
                                    if (!isConnectedTo) return
                                    eletronicMtxHOLDER[outConnector.fullId][inConnector.fullId] = {value: 1}
                                    
                                })
                            })
                        })
                        
                    })
                })
            }
        })
    })

        
    } else {
        eletronicMtxHOLDER = JSON.parse(JSON.stringify(eletronicMtx))
    }





    //Loop para encontrar em que parte da matrix eletronica a corrente esta sendo passada sendo a linha aquele que esta passando a corrente e a coluna aquele que a está recebendo.
    connectivityMtxMap.forEach( outConnectorLoop => {
        connectivityMtxMap.forEach( inConnectorLoop => {
            if(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] !== null) {
                outConnector.push(outConnectorLoop)
                inConnector.push(inConnectorLoop)
            }
        })
    })


    //Busca do codigo de comportamento do componente que esta sendo passado a corrente (componente que possui o connector com o id igual ao inConnector)
  
    let nextComponentInLineID = [] 
    inConnector.forEach(inConnectorLoop => {
        nextComponentInLineID.push(inConnectorLoop.split('/')[2])
    })

    let nextComponentInLineDATA = [] 
    inConnector.forEach(inConnectorLoop => {
        nextComponentInLineDATA.push(data.find( dataComponent => dataComponent.componentName === inConnectorLoop.split('/')[0]))
    }) 

    //Tratamento de erro para um possivel caso do codigo do componente não estar presente
    nextComponentInLineDATA.forEach(dataComponent => {
        if(!dataComponent.behavior){
            return
        }
    })

    


    for(let indexInLine = 0; indexInLine < nextComponentInLineID.length; indexInLine++){

        let input = {}

        input.id =  nextComponentInLineID[indexInLine]

        connectivityMtxMap.forEach( outConnectorLoop => {
            connectivityMtxMap.forEach( inConnectorLoop => {
                    if(inConnectorLoop.split('/')[2] ===  input.id){
                        let inConnectorDragMap = dragMap.find(component => {
                            return component.id === input.id
                        })
                        inConnectorDragMap.connectors.forEach(inConnector => {
                            inConnector.connectedTo.forEach(inConnectorConnectedTo => {
                                input[inConnector.svgId] = {}
                                input[inConnector.svgId] = eletronicMtxHOLDER[inConnectorConnectedTo][inConnector.fullId]
                            })
                        })
                    }
            })
        })

        

        /*
        let configOutput = editorCodeCaller(undefined, nextComponentInLineDATA[indexInLine].behavior).configPins
        
        if (configOutput.type === 'interactable_component') {
            configOutput.events.forEach(eventType => {
                document.getElementById(nextComponentInLineID[indexInLine]).addEventListener(eventType, (e) => {
                    input.events.eventType = e
                })
            })
        }
        */
        //TODO: TENHO QUE PENSAR COMO FAZER O EVENT LISTENER OU ALGO DO GENERO. SE EU COLOCAR PRA CRIAR EVENTO SEMPRE Q RODAR VAI TER EVENTO INFINITO. TALVEZ A SOLUÇÃO SEJA CRIAR UMA FUNÇÃO DE SETUP QUE SÓ RODE UMA VEZ QUANDO A SIMULAÇÃO FOR INICIADA.
        
        //TODO: Arrumar isso vvv
        //! Acho que isso não funcionará pro caso de um componente que possua mais de 1 tipo de evento. 
        input.events = eletronicStateList[nextComponentInLineID[indexInLine]]


        console.log(input)

    // Codigo do componente que esta sendo passado a corrente sendo chamado
    let behaviorFunctions = editorCodeCaller(input, nextComponentInLineDATA[indexInLine].behavior)
    let mainFunc = new Function("input", behaviorFunctions.main)
    var output = mainFunc(input)
    }
    // Esvaziamento da matriz eletronica para poder inserir o output
    connectivityMtxMap.forEach( outConnectorLoop => {
        connectivityMtxMap.forEach( inConnectorLoop => {
            eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null
        })
    })

    for(let indexInLine = 0; indexInLine < nextComponentInLineID.length; indexInLine++){


        let configPins = editorCodeCaller(undefined, nextComponentInLineDATA[indexInLine].behavior).configPins

    // Busca dos index dos connectors que estão passando e recebendo a corrente eletronica no proximo loop
    let connectorsKeysArray = Object.keys(output)
    connectorsKeysArray.forEach((pin) => {

        if(configPins[pin] !== 'out') return

        let newOutConnectorId = `${inConnector[indexInLine].split('/')[0]}/${pin}/${nextComponentInLineID[indexInLine]}`
        let connectoroutConnector 
        dragMap.forEach( dragComponent => {
            dragComponent.connectors.find( connector => {
                if(connector.fullId === newOutConnectorId) {
                    connectoroutConnector = connector
                    return connector
                }
            })
        })
        
       
        let nextComponentInLinedragComponent = dragMap.find( component => {
            return component.id === nextComponentInLineID[indexInLine]
        })

        let nextComponentInLineDragComponentConnector = nextComponentInLinedragComponent.connectors.find( connector => {
            return connector.svgId === pin
        })
        let nextComponentInLineConnectedToConnector = connectivityMtxMap.find(connector => { 
            //!Erro aqui vvv
            let isTrue = nextComponentInLineDragComponentConnector.connectedTo.some(connectorTo => connectorTo === connector)
            if(isTrue) return connector
            //return connector === nextComponentInLineDragComponentConnector.connectedTo
        })
        
        
        // Inserção do output na matriz eletronica
        if(nextComponentInLineConnectedToConnector){
            console.log(output)
            eletronicMtxHOLDER[connectoroutConnector.fullId][nextComponentInLineConnectedToConnector] = output[connectoroutConnector.svgId]
        }


        
    });
    }

    return(eletronicMtxHOLDER)
}

function createDepth(lines, dragMap) {
    // Aqui filtramos os componentes e fazemos um Set com apenas aqueles que estão em conexão com um outro componente
    const toBeLookedComponentsSet = new Set()
    lines.forEach(line => {
        let id
        id = line.startLine.split('/')[2]
        toBeLookedComponentsSet.add(id)
        id = line.endLine.split('/')[2]
        toBeLookedComponentsSet.add(id)
    })

    // Baseado na filtragem acima conseguimos um dragMap filtrado
    let filteredDragMap
    filteredDragMap = dragMap.filter(component => {
        return toBeLookedComponentsSet.has(component.id)
    })

    //Aqui damos inicio a criação do depthMap usando de um fifo
    let fifo = []
    let depthMap = []
    let aux = []

    aux.push(filteredDragMap[0])

    //! Erro em transformar o primeiro termo do depthMap em array
    depthMap.push(aux)

    fifo.push(filteredDragMap[0])



    
    while(fifo.length > 0){

        //Pegamos o primeiro componente da fila 
        let currentComponent = fifo.shift()

        //! Usar os connectors de saida para definir o depthMap
        //Então a partir desse componente percorremos seus conectores e verificamos com quem eles estão conectados
        let depthMapAux = []
        currentComponent.connectors.forEach(connector => {
            
            let behaviorFunctions = editorCodeCaller(undefined, currentComponent.behavior)
            let configOutput = behaviorFunctions.configPins


            console.log(connector.connectorConfig)
            if(connector.connectorConfig === 'in'){
                return
            }

            // O inout só é analisado se o componente que ele está conectado é um 'in', tornando ele um 'out'
            if(connector.connectorConfig === 'in-out'){
                let connectedToConnectorConfig = null
                dragMap.forEach(connectedToComponent => {

                    let auxConfig = null

                    if(connectedToComponent.id === connector.connectedTo[0].split('/')[2]){
                        auxConfig = connectedToComponent.connectors.find(connectedToConnector => {
                            if(connectedToConnector.fullId === connector.connectedTo[0]){
                                connectedToConnectorConfig = connectedToConnector.connectorConfig
                            }
                        })
                    }

                    if(auxConfig) {
                        connector.auxConfig = auxConfig
                        return auxConfig
                    }
                })
                console.log(connector)
                if(!connectedToConnectorConfig) return
                if(connectedToConnectorConfig.connectorConfig === 'out'){
                    return
                }
            }

            let components = []
            if(connector.connectedTo.length > 0){
                connector.connectedTo.forEach(outConnector => {
                    let componentToPush = dragMap.find(inComponent => { 
                        //TODO: trocar para achar o componente pela matriz
                        if(!connector.connectedTo){
                            return null
                        }
                        return (inComponent.id === outConnector.split('/')[2]) 
                    })
                    if(!componentToPush) return
                    components.push(componentToPush)
                })
            }
            
            
            if(!components) return 

            //! Erro aqui vvv
            let includesComponent = false

            //Verificamos se os componentes alvos dos conectores ja estão no depthMap
            components.forEach(componentToPush => {
                depthMap.forEach(depthLevel => {
                    depthLevel.forEach(depthComponent => {
                        console.log(depthComponent)
                        console.log(componentToPush)
                        if(depthComponent === componentToPush){
                            includesComponent = true
                        }
                    })
                })
            //Então se o teste acima for falso adicionamos o componente ao depthMap e ao fifo
                if(!includesComponent){
                    depthMapAux.push(componentToPush)
                    fifo.push(componentToPush)
                }
            })

        })
        if(depthMapAux.length > 0){
            depthMap.push(depthMapAux)
        }
    }


    console.log(depthMap)
    
    return(depthMap)
}

export function simulationSetup( dragMap, eletronicStateList, seteletronicStateList) {
    let tempEletronicEventList = {}
    const InteractiveConnectedComponentsSet = new Set()
    dragMap.forEach(currentComponent => {

        //TODO: Fazer o caso onde o componente é interativo mas não está conectado no circuito 

        let behaviorFunctions = editorCodeCaller(undefined, currentComponent.behavior).configPins

        if(behaviorFunctions.type === 'interactive_component') {
            InteractiveConnectedComponentsSet.add(currentComponent)
            tempEletronicEventList[currentComponent.id] = null
            return
        }
    })
    
    //? Perguntar sobre isso a julio
    //TODO:Talvez criar uma lista de opções que o usuario pode adicionar alem do tipo de evento para custumizar a interatividade. Ex:. definir qual componente especifico deve ser clicado para o evento acontecer.

    InteractiveConnectedComponentsSet.forEach(currentComponent => {
        let behaviorFunctions = editorCodeCaller(undefined, currentComponent.behavior).configPins

        behaviorFunctions.events.forEach(event => {
            document.getElementById(currentComponent.id).addEventListener(event, attEventList(currentComponent.id, eletronicStateList, seteletronicStateList))
        })

    })

    //TODO: Como resetar a eventlist????????

}

function attEventList(componentId, eletronicStateList, seteletronicStateList) {
    //! Acho que isso não funcionará pro caso de um componente que possua mais de 1 tipo de evento. 
    let auxeletronicStateList = eletronicStateList
    auxeletronicStateList[componentId] = 1
    seteletronicStateList(auxeletronicStateList)
}


