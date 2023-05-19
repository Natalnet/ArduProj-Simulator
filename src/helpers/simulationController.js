import { editorCodeCaller } from "./functionHelpers"

export function simulationController(connectivityMtx, connectivityMtxMap, dragMap, data, eletronicMtx, lines, eletronicEventsList) {

    let depth = createDepth(lines, dragMap)

    let outConnector = [], inConnector = []

    console.log('testeeee')

    let eletronicMtxHOLDER
    console.log(eletronicMtx)

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

        depth.forEach(depthLevel => {
            depthLevel.forEach(outComponent => {

            console.log(outComponent)

            let behaviorFunctions = editorCodeCaller(undefined, outComponent.behavior)
            let configOutput = behaviorFunctions.configPins

            console.log(configOutput)

            if (configOutput.type === 'power_source'){
                outComponent.connectors.forEach(outConnector => {
                    console.log(configOutput[outConnector.svgId])
                    console.log(outConnector)
                    if(configOutput[outConnector.svgId] === 'in'){
                        return
                    }

                    console.log('1')
                    outConnector.connectedTo.forEach(inComponentFullId => {
                        console.log('2')
                        depth.forEach(depthLevel => {
                            console.log('3')
                            depthLevel.forEach(inComponent => {
                                console.log('4')
                                console.log(inComponent.id)
                                console.log(inComponentFullId.split('/')[2])
                                if(inComponent.id !== inComponentFullId.split('/')[2]) return
                                inComponent.connectors.forEach( inConnector => {
                                    console.log('5')
                                    console.log(eletronicMtxHOLDER)
                                    console.log(outConnector.fullId)
                                    console.log(inConnector.fullId)
                                    console.log(eletronicMtxHOLDER[outConnector.fullId][inConnector.fullId])
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

        console.log('eletronicMtxHOLDER:')
        console.log(eletronicMtxHOLDER)
        
    } else {
        eletronicMtxHOLDER = JSON.parse(JSON.stringify(eletronicMtx))
    }


    console.log('eletronicMtxHOLDER:')
    console.log(eletronicMtxHOLDER)

    console.log('connectivityMtxMap:')
    console.log(connectivityMtxMap)


    //Loop para encontrar em que parte da matrix eletronica a corrente esta sendo passada sendo a linha aquele que esta passando a corrente e a coluna aquele que a está recebendo.
    connectivityMtxMap.forEach( outConnectorLoop => {
        connectivityMtxMap.forEach( inConnectorLoop => {
            console.log(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop])
            if(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] !== null) {
                outConnector.push(outConnectorLoop)
                inConnector.push(inConnectorLoop)
            }
        })
    })

    console.log('outConnector:',outConnector,'inConnector:', inConnector)

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
            console.log('Não há condigo no componente:' + dataComponent.componentName)
            return
        }
    })

    

    console.log('ate aqui chega')

    for(let indexInLine = 0; indexInLine < nextComponentInLineID.length; indexInLine++){

        let input

        connectivityMtxMap.forEach( outConnectorLoop => {
            connectivityMtxMap.forEach( inConnectorLoop => {
                console.log(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop])
                if(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] !== null) {
                    input = eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop]
                }
            })
        })

        input.id =  nextComponentInLineID[indexInLine]

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
        input.events = eletronicEventsList[nextComponentInLineID[indexInLine]]


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
                console.log('connector.id')
                console.log(connector)
                console.log('newOutConnectorId.split/2')
                console.log(newOutConnectorId)
                if(connector.fullId === newOutConnectorId) {
                    connectoroutConnector = connector
                    return connector
                }
            })
        })
        
        console.log('connectoroutConnector:',connectoroutConnector)
       
        let nextComponentInLinedragComponent = dragMap.find( component => {
            return component.id === nextComponentInLineID[indexInLine]
        })
        console.log('nextComponentInLine:',nextComponentInLinedragComponent)

        let nextComponentInLineDragComponentConnector = nextComponentInLinedragComponent.connectors.find( connector => {
            console.log(connector.svgId)
            console.log(pin)
            return connector.svgId === pin
        })
        console.log('nextComponentInLineDragComponentConnector:',nextComponentInLineDragComponentConnector)
        let nextComponentInLineConnectedToConnector = connectivityMtxMap.find(connector => { 
            console.log(connector)
            console.log(nextComponentInLineDragComponentConnector)
            //!Erro aqui vvv
            let isTrue = nextComponentInLineDragComponentConnector.connectedTo.some(connectorTo => connectorTo === connector)
            if(isTrue) return connector
            //return connector === nextComponentInLineDragComponentConnector.connectedTo
        })
        
        
        console.log(nextComponentInLineConnectedToConnector)
        // Inserção do output na matriz eletronica
        if(nextComponentInLineConnectedToConnector){
            console.log(connectoroutConnector)
            eletronicMtxHOLDER[connectoroutConnector.fullId][nextComponentInLineConnectedToConnector] = output
        }

        console.log('connectivityMtxMap:')
        console.log(connectivityMtxMap)

        console.log('eletronicMtxHOLDER:')
        console.log(eletronicMtxHOLDER)
        
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


    console.log('fifo:')
    console.log(fifo)

    console.log('depthMap:')
    console.log(depthMap)
    
    while(fifo.length > 0){

        //Pegamos o primeiro componente da fila 
        let currentComponent = fifo.shift()

        //! Usar os connectors de saida para definir o depthMap
        //Então a partir desse componente percorremos seus conectores e verificamos com quem eles estão conectados
        let depthMapAux = []
        currentComponent.connectors.forEach(connector => {
            
            let behaviorFunctions = editorCodeCaller(undefined, currentComponent.behavior)
            let configOutput = behaviorFunctions.configPins

            console.log('configOutput:')
            console.log(configOutput)

            if(configOutput[connector.svgId] === 'in'){
                return
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

    console.log('fifo:')
    console.log(fifo)

    console.log('depthMap:')
    console.log(depthMap)

    return(depthMap)
}

export function simulationSetup( dragMap, eletronicEventsList, setEletronicEventsList) {
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
            document.getElementById(currentComponent.id).addEventListener(event, attEventList(currentComponent.id, eletronicEventsList, setEletronicEventsList))
        })

    })

    //TODO: Como resetar a eventlist????????

}

function attEventList(componentId, eletronicEventsList, setEletronicEventsList) {
    //! Acho que isso não funcionará pro caso de um componente que possua mais de 1 tipo de evento. 
    let auxEletronicEventsList = eletronicEventsList
    auxEletronicEventsList[componentId] = 1
    setEletronicEventsList(auxEletronicEventsList)
}