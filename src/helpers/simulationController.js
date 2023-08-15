import { editorCodeCaller } from "./functionHelpers"

export function simulationController(connectivityMtx, dragMap, data, eletronicMtx, lines, eletronicStateList, setCircuitChanged) {

    let outConnector = [], inConnector = []

    let eletronicMtxHOLDER

    let isEletronicMtxEmpty = true
    if(eletronicMtx !== null) {
    Object.keys(connectivityMtx).forEach(line => {
        Object.keys(connectivityMtx).forEach(row => {
            if(eletronicMtx[line][row] !==  null) {
                isEletronicMtxEmpty = false
            }
        })
    })
    }

    if (isEletronicMtxEmpty) {

        eletronicMtxHOLDER = JSON.parse(JSON.stringify(connectivityMtx))
        Object.keys(connectivityMtx).forEach( outConnectorLoop => {
            Object.keys(connectivityMtx).forEach( inConnectorLoop => {
                eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null
            })
        })

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

        
        //Aqui definimos o primeiro elemento a ser chamado baseado em quem é power source
        filteredDragMap.forEach(outComponent => {

            let behaviorFunctions = editorCodeCaller(undefined, outComponent.behavior)
            let configOutput = behaviorFunctions.configPins

            if (configOutput.type === 'power_source'){
                outComponent.connectors.forEach(outConnector => {
                    if(configOutput[outConnector.svgId] === 'in'){
                        return
                    }

                    outConnector.connectedTo.forEach(inComponentFullId => {
                        filteredDragMap.forEach(inComponent => {
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
            }

        })
        
    } else {
        eletronicMtxHOLDER = JSON.parse(JSON.stringify(eletronicMtx))
    }

    //Loop para encontrar em que parte da matrix eletronica a corrente esta sendo passada sendo a linha aquele que esta passando a corrente e a coluna aquele que a está recebendo.
    Object.keys(connectivityMtx).forEach( outConnectorLoop => {
        Object.keys(connectivityMtx).forEach( inConnectorLoop => {
            if(eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] !== null) {
                outConnector.push(outConnectorLoop)
                inConnector.push(inConnectorLoop)
            }
        })
    })


    //Busca do codigo de comportamento do componente que esta sendo passado a corrente (componente que possui o connector com o id igual ao inConnector)
  
    let nextComponentInLineID = [] 
    inConnector.forEach(inConnectorLoop => {
        if(nextComponentInLineID.some(id => id === inConnectorLoop.split('/')[2])) {
            return
        }
        nextComponentInLineID.push(inConnectorLoop.split('/')[2])
    })

    let nextComponentInLineDATA = [] 
    inConnector.forEach(inConnectorLoop => {
        if(nextComponentInLineDATA.some(dataComponent => dataComponent.componentName === inConnectorLoop.split('/')[0])) {
            return
        }
        nextComponentInLineDATA.push(data.find( dataComponent => dataComponent.componentName === inConnectorLoop.split('/')[0]))
    }) 

    //Tratamento de erro para um possivel caso do codigo do componente não estar presente
    nextComponentInLineDATA.forEach(dataComponent => {
        if(!dataComponent.behavior){
            return
        }
    })

    var output = []

    for(let indexInLine = 0; indexInLine < nextComponentInLineID.length; indexInLine++){

        var input = {}

        input.id =  nextComponentInLineID[indexInLine]

        Object.keys(connectivityMtx).forEach( outConnectorLoop => {
            Object.keys(connectivityMtx).forEach( inConnectorLoop => {
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

        
        input.events = eletronicStateList[nextComponentInLineID[indexInLine]]

        // Aqui temos o bloco de codigo que passa o path de cada entrada para o output e também testa se o circuito esta fechado
        input.path = []
        var circuitClosed = false
        Object.keys(input).forEach(inputKey => {
            if(inputKey.includes('connector')){
                console.log('INCLUDEEES')
                if(!input[inputKey]) return
                if(!input[inputKey].path) return
                input[inputKey].path.forEach(pathId => {
                    if(input.path.some(inputPath => { return inputPath === pathId})){
                        console.log('CIRCUITO FECHADO')
                        setCircuitChanged(false)
                        circuitClosed = true
                        resetPaths(eletronicMtxHOLDER)
                    } else {
                        input.path.push(pathId)
                    }
                })
            }
        })

        if(circuitClosed) break

        
/*

    input.path = new Set
    console.log(input.path) 
    if(input.path.size == 0){
        input.path.add(input.id)
    } else if(input.path.has(input.id)){
        console.log('CIRCUITO FECHADOOOO')
    }

    */
    
    let behaviorFunctions = editorCodeCaller(input, nextComponentInLineDATA[indexInLine].behavior)
    let mainFunc = new Function("input", behaviorFunctions.main)

    
    try {
        output.push(mainFunc(input))
    } catch (error) {
        console.log('Erro no comportamento:')
        console.log(error)
    }
    
    /*
        output[indexInLine].id = input.id
        pathHOLDER.add(input.id)
        output[indexInLine].path = pathHOLDER
    */
        console.log(nextComponentInLineID)
        console.log(nextComponentInLineDATA)
        console.log('input:')
        console.log(input)
        console.log('output:')
        console.log(output[indexInLine])


    }
    // Esvaziamento da matriz eletronica para poder inserir o output
    Object.keys(connectivityMtx).forEach( outConnectorLoop => {
        Object.keys(connectivityMtx).forEach( inConnectorLoop => {
            eletronicMtxHOLDER[outConnectorLoop][inConnectorLoop] = null
        })
    })

    if(circuitClosed) return eletronicMtxHOLDER

    for(let indexInLine = 0; indexInLine < nextComponentInLineID.length; indexInLine++){

        let configPins = editorCodeCaller(undefined, nextComponentInLineDATA[indexInLine].behavior).configPins

    // Busca dos index dos connectors que estão passando e recebendo a corrente eletronica no proximo loop
    Object.keys(output[indexInLine]).forEach((pin) => {
        if(configPins[pin] !== 'out' && configPins[pin] !== 'in-out') return
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
       
       // Aqui pegamos o dragMap do outComponente atual
        let nextComponentInLinedragComponent = dragMap.find( component => {
            return component.id === nextComponentInLineID[indexInLine]
        })

        //* Pegar cada componente do nextComponentInLinedragComponent
        //* pegar com quem eles estão connectados
        //* ir na matriz eletronica e por [os connectors][os connectedTo deles]: output[os connectors]

        nextComponentInLinedragComponent.connectors.forEach(outConnector => {
            outConnector.connectedTo.forEach(NEWoutConnector => {
                if(!output[indexInLine][outConnector.fullId.split('/')[1]]) return
                if(output[indexInLine][outConnector.fullId.split('/')[1]].value > 0){
                    if(!output[indexInLine][outConnector.fullId.split('/')[1]].path){
                        output[indexInLine][outConnector.fullId.split('/')[1]].path = input.path
                    }
                    let pathLineId = findLine(lines, NEWoutConnector, outConnector.fullId).id
                    if(!output[indexInLine][outConnector.fullId.split('/')[1]].path.some(path => { return pathLineId === path})){
                        output[indexInLine][outConnector.fullId.split('/')[1]].path.push(pathLineId)
                    }
                    console.log(output[indexInLine][outConnector.fullId.split('/')[1]].path)
                }
                eletronicMtxHOLDER[outConnector.fullId][NEWoutConnector] = output[indexInLine][outConnector.fullId.split('/')[1]]
            })
        })

        
    })
    }

    console.log(eletronicMtxHOLDER)

    return(eletronicMtxHOLDER)
}

function findLine(lines,startLine, endLine){
    return(lines.find(line => {
        if(line.startLine === startLine && line.endLine === endLine){
            return line.id
        }
        if(line.startLine === endLine && line.endLine === startLine){
            return line.id
        }
    }))
}

function resetPaths(eletronicMtx){
    Object.keys(eletronicMtx).forEach(line => {
        Object.keys(eletronicMtx).forEach(row => {
            if(eletronicMtx[line][row] !==  null && eletronicMtx[line][row].path) {
                eletronicMtx[line][row].path = []
            }
        })
    })

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


            if(connector.connectorConfig === 'in'){
                return
            }

            /*
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

                if(!connectedToConnectorConfig) return
                if(connectedToConnectorConfig.connectorConfig === 'out'){
                    return
                }
            }
            */
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
    console.log(depthMap)
    
    return(depthMap)
}

export function simulationSetup( dragMap, eletronicStateList, seteletronicStateList, setCircuitChanged) {
    let tempEletronicEventList = {}
    const InteractiveConnectedComponentsSet = new Set()
    dragMap.forEach(currentComponent => {

        //TODO: Fazer o caso onde o componente é interativo mas não está conectado no circuito 

        if(currentComponent.config.type === 'interactive_component') {
            InteractiveConnectedComponentsSet.add(currentComponent)
            tempEletronicEventList[currentComponent.id] = null
            return
        }
    })
    
    InteractiveConnectedComponentsSet.forEach(currentComponent => {
        currentComponent.config.events.forEach(event => {
            console.log(typeof event)
            document.getElementById(currentComponent.id).addEventListener(event, (event) => {attEventList(currentComponent.id, eletronicStateList, seteletronicStateList, setCircuitChanged)} )
        })

    })

    //TODO: Como resetar a eventlist????????

}

function attEventList(componentId, eletronicStateList, seteletronicStateList, setCircuitChanged) {
    console.log(componentId)
    //! Acho que isso não funcionará pro caso de um componente que possua mais de 1 tipo de evento. 
    // Fazer os eventos alterarem o valor inicial a cada evento.
    let auxeletronicStateList = eletronicStateList
    if(!auxeletronicStateList[componentId]){
        auxeletronicStateList[componentId] = true
    } else {
        auxeletronicStateList[componentId] = !auxeletronicStateList[componentId]
    }
    console.log(auxeletronicStateList)
    setCircuitChanged(true)
    seteletronicStateList(auxeletronicStateList)
}

