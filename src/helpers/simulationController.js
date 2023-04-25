import { editorCodeCaller } from "./functionHelpers"

export function simulationController(connectivityMtx, connectivityMtxMap, dragMap, data, eletronicMtx) {
    let lefterConnector = 0, upperConnector = 0

    let eletronicMtxHOLDER = eletronicMtx

    eletronicMtxHOLDER[0][2] = 1
    console.log('eletronicMtxHOLDER:')
    console.log(eletronicMtxHOLDER)

    //Loop para encontrar em que parte da matrix eletronica a corrente esta sendo passada sendo a linha aquele que esta passando a corrente e a coluna aquele que a está recebendo.
    for (let lefterConnectorLoop = 0; lefterConnectorLoop < connectivityMtxMap.length; lefterConnectorLoop++) {
        for (let upperConnectorLoop = 0; upperConnectorLoop < connectivityMtxMap.length; upperConnectorLoop++) {
            if(eletronicMtxHOLDER[lefterConnectorLoop][upperConnectorLoop] > 0) {
                lefterConnector = lefterConnectorLoop
                upperConnector = upperConnectorLoop
            }
        }
    }

    console.log('lefterConnector:',lefterConnector,'upperConnector:', upperConnector)

    //Busca do codigo de comportamento do componente que esta sendo passado a corrente (componente que possui o connector com o id igual ao upperConnector)
  
    let nextComponentInLineID = connectivityMtxMap[upperConnector].split('/')[1]

    let nextComponentInLineDRAGMAP = dragMap.find( dragMapComponent => dragMapComponent.id === nextComponentInLineID)
    
    let nextComponentInLineDATA = data.find( dataComponent => dataComponent.componentName === nextComponentInLineDRAGMAP.componentName)

    //Tratamento de erro para um possivel caso do codigo do componente não estar presente
    if(!nextComponentInLineDATA.behavior){
        console.log('Não há condigo.')
        return
    }

    //* Input hardcoded
    let input = {value: 0, id: nextComponentInLineID}

    // Codigo do componente que esta sendo passado a corrente sendo chamado
    let behaviorFunctions = editorCodeCaller(input, nextComponentInLineDATA.behavior)
    let mainFunc = new Function("input", behaviorFunctions.main)
    let output = mainFunc(input)

    console.log(output)

    console.log(nextComponentInLineID)

    // Busca dos index dos connectors que estão passando e recebendo a corrente eletronica no proximo loop
    let connectorsKeysArray = Object.keys(output.connectors)
    connectorsKeysArray.forEach((pin) => {
        let connectorID = `${pin}/${nextComponentInLineID}`
        let connectorINDEXLEFTerConnector = connectivityMtxMap.findIndex(connector => { 
            console.log('connectorIndexLEFTerConnector:')
            console.log(connector)
            console.log(connectorID)

            return connector == connectorID})
       
        let dragComponent = dragMap.filter( component => {
            return component.id === nextComponentInLineID
        })
        console.log('dragComponent:',dragComponent)

        let dragComponentConnector = dragComponent[0].connectors.filter( connector => {
            console.log(connector.svgId)
            console.log(pin)
            return connector.svgId === pin
        })
        console.log('dragComponentConnector:',dragComponentConnector)
        let connectedToINDEXUPPERConnector = connectivityMtxMap.findIndex(connector => { 
            console.log(connector)
            console.log(dragComponentConnector[0].connectedTo)
            return connector === dragComponentConnector[0].connectedTo
        })
        
        // Esvaziamento da matriz eletronica para poder inserir o output
        let eletronicMtxHOLDER = []
        for(let i = 0; i < connectivityMtxMap.length; i++){
            eletronicMtxHOLDER.push([])
            for(let j = 0; j < connectivityMtxMap.length; j++){
                eletronicMtxHOLDER[i].push(null)
            }
        }

        // Inserção do output na matriz eletronica
        if(connectedToINDEXUPPERConnector>=0){
            console.log(connectorINDEXLEFTerConnector)
            eletronicMtxHOLDER[connectorINDEXLEFTerConnector][connectedToINDEXUPPERConnector] = output.connectors[pin]
        }

        console.log('connectivityMtxMap:')
        console.log(connectivityMtxMap)

        console.log('eletronicMtxHOLDER:')
        console.log(eletronicMtxHOLDER)
        
    });

}