export function newSimulationController(connectivityMtx, dragMap, data, eletronicMtx, lines, eletronicStateList, circuitChanged, setCircuitChanged) {

    console.log('simulacao comecoua ')

    var eletronicMtxHOLDER = JSON.parse(JSON.stringify(connectivityMtx))
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
    let allSimulatedComponents
    allSimulatedComponents = dragMap.filter(component => {
        return toBeLookedComponentsSet.has(component.id)
    })

    var toBeSimulatedComponents = []
    var simulatedComponents = []


    // Aqui definimos o primeiro elemento a ser simulado e adicionamos no segundo Set
    allSimulatedComponents.forEach(component => {
        if(component.config.type === "power_source"){
            toBeSimulatedComponents.push(component)
        }
    })

    // Aqui simulamos o primeiro elemento vulgo elemento de alimentação
    let input = {}

    //TODO Fazer ele ir tirando os componentes que já foram simulados e parar em algum momento e continuar quando tiver mudanças

    
    while(toBeSimulatedComponents.length > 0){
        
        
        let currentComponent
        toBeSimulatedComponents.forEach(component => {
            console.log(component)
            currentComponent = component
            
            // Aqui iteramos pela eletronicMtxHolder para achar qualquer valor de entrada não nulo para o componente atual e guardamos no input
            component.connectors.forEach(connectorPin => {
                Object.keys(eletronicMtxHOLDER).forEach(inComponent => {
                    if(eletronicMtxHOLDER[inComponent][connectorPin.fullId] !== null){
                        //! Ver o caso de multiplos inputs
                        console.log(inComponent)
                        console.log(connectorPin.fullId)
                        console.log(eletronicMtxHOLDER[inComponent][connectorPin.fullId])
                        input[connectorPin.svgId] = eletronicMtxHOLDER[inComponent][connectorPin.fullId]
                    }
                })
            })

            if(component.config.type === 'interactive_component'){
                input.events = eletronicStateList[component.id]
            }
            

            input.id = component.id

            //! Porque 
            console.log(input)

        
            // Então pegamos o output pelo behavior do componente
            let output = component.doBehavior(input)

            console.log(output)

            // Depois disso iteramos por cada pino do componente
            Object.keys(component.config.pins).forEach(connectorPin => {
                // Seguindo apenas com aqueles que são de saida
                //! Ver caso de in-out
                if(component.config.pins[connectorPin] === 'in') return

                // Aqui atualizamos o valor do eletronicMtx para todos que estão conectados com o devido pino
                component.connectors.forEach(connector => {
                    if(connector.svgId === connectorPin) {
                        console.log(connector)
                        console.log(connectorPin)
                        connector.connectedTo.forEach(connectedTo => {
                            eletronicMtxHOLDER[connector.fullId][connectedTo] = output[connectorPin]

                            console.log(eletronicMtxHOLDER)

                            // Aqui adicionamos o componente connectado ao pino atual e o adicionamos na fila.
                            let toAddComponent = allSimulatedComponents.find(component => {
                                return component.id === connectedTo.split('/')[2]
                            })
                            console.log(toAddComponent)
                            if(toBeSimulatedComponents.some(component => component.id === toAddComponent.id)) return
                            if(simulatedComponents.some(component => component === toAddComponent)) return
                            toBeSimulatedComponents.push(toAddComponent)
                        
                            console.log(toBeSimulatedComponents)
                        })
                    }
                })

            })


            simulatedComponents.push(component)
            toBeSimulatedComponents.shift()

            console.log(toBeSimulatedComponents)
            console.log(simulatedComponents)
            console.log(eletronicMtxHOLDER)
            
        
            
        })
    }

    resetComponents(allSimulatedComponents, simulatedComponents)
    setCircuitChanged(false)

}

function resetComponents(allSimulatedComponents, simulatedComponents){
    let notSimulatedComponents = []
    allSimulatedComponents.forEach(generalComponent => {
        if(!(simulatedComponents.some(simulatedComponent => simulatedComponent.id === generalComponent.id))) notSimulatedComponents.push(generalComponent)
    })

    notSimulatedComponents.forEach(component => {
        let input = {}

        input.id = component.id

        component.connectors.forEach( connector => {
            input[connector.svgId] = null
        })

        component.doBehavior(input)
    })
}


