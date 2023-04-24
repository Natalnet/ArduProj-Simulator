import { editorCodeCaller } from "./functionHelpers"

export function simulationController(connectivityMtx, connectivityMtxMap, dragMap, data) {
    let left = 0, upper = 0

    let mtxKeys = Object.keys(connectivityMtx)
    let mtxValues = Object.values(connectivityMtx)

    console.log(mtxKeys, mtxValues)

    let connectivityMtxArray = []

    mtxValues.map( arr => {
        connectivityMtxArray.push(Object.values(arr))
    })

    connectivityMtxArray[0][2] = 1

    console.log(connectivityMtxArray)

    for (let leftLoop = 0; leftLoop < connectivityMtxMap.length; leftLoop++) {
        for (let upperLoop = 0; upperLoop < connectivityMtxMap.length; upperLoop++) {
            if(connectivityMtxArray[leftLoop][upperLoop] > 0) {
                left = leftLoop
                upper = upperLoop
            }
        }
    }

    /*
    console.log(`keys certas:` + mtxKeys[1] + mtxKeys[2])

    console.log(connectivityMtx)

    console.log(connectivityMtx[mtxKeys[1]])

    connectivityMtx[mtxKeys[1]][mtxKeys[2]] = 5


    for ( let loopUpper = 0; loopUpper < mtxKeys.length; loopUpper++) {
        for ( let loopLeft = 0; loopLeft < mtxKeys.length; loopLeft++) {
            console.log(mtxKeys[loopUpper].split('/')[1])
            console.log(mtxKeys[loopLeft].split('/')[1])
            if(mtxKeys[loopUpper].split('/')[1] != mtxKeys[loopLeft].split('/'[1])){
                console.log(loopUpper + ` ` + loopLeft + `:`  +connectivityMtx[mtxKeys[loopUpper]][mtxKeys[loopLeft]])
            if(connectivityMtx[mtxKeys[loopUpper]][mtxKeys[loopLeft]] > 0) {
                console.log(mtxKeys[loopUpper])
                console.log(mtxKeys[loopLeft])
                upper = loopUpper
                left = loopLeft
            }
            }
        }
    }

    
    */

    let nextComponentInLineID = connectivityMtxMap[upper].split('/')[1]

    let nextComponentInLineDRAGMAP = dragMap.find( dragMapComponent => dragMapComponent.id === nextComponentInLineID)
    
    let nextComponentInLineDATA = data.find( dataComponent => dataComponent.componentName === nextComponentInLineDRAGMAP.componentName)

    if(!nextComponentInLineDATA.behavior){
        console.log('Não há condigo.')
        return
    }

    let input = {value: 0, id: nextComponentInLineID}

    console.log(nextComponentInLineDATA.componentName)

    let behaviorFunctions = editorCodeCaller(input, nextComponentInLineDATA.behavior)

    console.log(behaviorFunctions)

    let mainFunc = new Function("input", behaviorFunctions.main)

    let output = mainFunc(input)

    console.log(output)

    //connectivityMtxArray[left][upper] = 0

    let connectorsKeysArray = Object.keys(output.connectors)
    connectorsKeysArray.forEach((pin, index) => {
        let connectorID = `${pin}/${nextComponentInLineID}`
        let connectorINDEX = connectivityMtxMap.findIndex(connector => { 
            console.log(connector)
            console.log(connectorID)

            return connector == connectorID})
        let dragComponent = dragMap.filter( component => {
            return component.id === nextComponentInLineID
        })
        console.log(dragComponent)
        let dragComponentConnector = dragComponent[0].connectors.filter( connector => {
            console.log(connector.id)
            console.log(pin)
            return connector.id === pin
        })
        let connectedToINDEX = connectivityMtxMap.findIndex(connector => { 
            console.log(connector)
            console.log(dragComponentConnector)
            return connector === dragComponentConnector[0].connectedTo})
        if(connectedToINDEX>=0){
            console.log(connectorINDEX)
            connectivityMtxArray[connectorINDEX][connectedToINDEX] = output.connectors[pin]
        }
        
    });

}