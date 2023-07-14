import LeaderLine from 'react-leader-line'
import useMousePosition from './linePositionHook'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import uuid from 'react-uuid';
import { editorCodeCaller } from './functionHelpers';



export function lineFunc(target, lines, setLines, dragMap, setDragMap, data, connectivityMtx, setConnectivityMtx, isSection = false) {

    let tempLines = lines
    let tempDragMap = dragMap
    let tempConnectorsEndIndex

    if (!isSection) {
        var targetDragMap = dragMap.filter((i) => {
            return i.id === target.id.split('/')[2]
        })[0]


        var targetConnector = targetDragMap.connectors.filter((c, index) => {
            if (c.svgId === target.id.split('/')[1]) {
                tempConnectorsEndIndex = index
            }
            return c.svgId === target.id.split('/')[1]
        })[0]

        

        //Logica para verificar se o target ja esta sendo usado

        /*
        if (targetConnector) {
            if (targetConnector.connectedTo) throw Error('Conector ja esta sendo usado')
        }
        */
    }

    //Essa primeira seção do codigo corresponde ao caso do caminho da linha ter sido devidamente fechado
    if (Object.values(tempLines).some(l => l.status === 'Em aberto') && (!isSection)) {


        let index = Object.values(tempLines).findIndex(l => { return l.endLine === undefined })

        tempLines[index].status = 'Fechado'
        tempLines[index].endLine = targetConnector.fullId
        tempLines[index].path = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
        //tempLines[index].id = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
        //?tempLines[index].position = function () { this.position() }



        // Logica para procurar o connector que inicia a linha e atualizar o valor de connectedTo nele
        let targetDragMapStart = dragMap.filter((i) => {
            return i.id === tempLines[index]['startLine'].split('/')[2]
        })[0]

        let tempConnectorsStartIndex
        let targetConnectorStart = targetDragMapStart.connectors.filter((c, indexc) => {
            if (c.svgId === tempLines[index]['startLine'].split('/')[1]) {
                tempConnectorsStartIndex = indexc
            }
            return c.svgId === tempLines[index]['startLine'].split('/')[1]
        })[0]

        //targetConnectorStart.connectedTo.push(tempLines[index]['startLine'])
        let tempIndexStart = tempDragMap.findIndex((e) => {
            return e === targetDragMapStart
        })

        tempDragMap[tempIndexStart].connectors[tempConnectorsStartIndex].connectedTo.push(tempLines[index]['endLine'])


        // Logica para procurar o connector que termina a linha e atualizar o valor de connectedTo nele

        targetConnector.connectedTo.push(tempLines[index]['startLine'])
        
        
        let tempSection

        tempLines[index].sections.map(section => {
            if (section.status === 'moving') {
                section.endLine = targetConnector.fullId
                section.status = 'end'
                section.leaderLine.remove()
                tempSection = section
            }
        })

        makeLine(tempLines, tempSection)

        //let newLineWithEmitters = makeEmitters(tempLines[index], emitter, tempDragMap[tempIndexEnd].componentName, data)

        //tempLines[index] = newLineWithEmitters


        setDragMap(tempDragMap)
        setLines(tempLines)

        var attConnectivityMtxOutput = attConnectivityMtx(tempLines, tempDragMap, connectivityMtx)

        //! Não sei se isso vai dar erro vvvv
        setConnectivityMtx(attConnectivityMtxOutput.connectivityMtx)


    } else if (Object.values(tempLines).some(l => l.status === 'Em aberto') && (isSection)) {
        //Aqui temos a adição de mais uma section

        let sectionUuid = uuid()

        let tempSection

        tempLines.map(line => {
            if (line.status === 'Em aberto') {
                line.sections.map(section => {
                    if (section.status === 'moving') {
                        section.status = 'stoped'
                        tempSection = { startLine: section.endLine, endLine: `section/${sectionUuid}`, id: sectionUuid, status: 'moving' }
                    }

                    //! Olhar a fundo porque o tempSection não é definido as vezes
                    if (tempSection) {
                        line.sections = [...line.sections, tempSection]
                    }
                })
            }
        })

        if (!tempSection) throw Error('Problemas definindo o section')

        setLines([...tempLines])

    }
    //Aqui temos o caso de estar sendo iniciado uma nova linha
    else {

        let sectionUuid = uuid()

        let tempSections = []
        if (tempLines.sections) {
            tempSections = tempLines.sections
        }

        tempSections.push({ startLine: targetConnector.fullId, endLine: `section/${sectionUuid}`, id: sectionUuid, status: 'moving' })



        tempLines.push({ startLine: `${targetConnector.fullId}`, status: 'Em aberto', id: uuid(), sections: tempSections })

        setLines([...tempLines])

        //! Usar esse formato
        //let temp = {...lines, novoObj}

    }

}



export function makeLine(lines, section = false, building = false) {
    console.log(lines)
    console.log(section)

    if (!lines.some(l => l.status == 'Em aberto') && lines.length > 0 && (!section) && building) {
        console.log('codigo morto?')
        
        lines.forEach(line => {
            line.sections.forEach(section => {
                if(section.leaderLine._id) return
                section.leaderLine = new LeaderLine(
                    LeaderLine.pointAnchor(document.getElementById(section.startLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    LeaderLine.pointAnchor(document.getElementById(section.endLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    {
                        path: 'straight',
                        startPlug: 'disc',
                        endPlug: 'disc',
                        color: 'red',
                        size: 3,
                        outline: true,
                        outlineColor: 'black'
                    }
                )
            })
            

        })
    } else if (!building) {
        lines[lines.length - 1].sections.map(section => {

        
            if (section.status === 'moving') {

                section.leaderLine = new LeaderLine(
                    LeaderLine.pointAnchor(document.getElementById(section.startLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    LeaderLine.pointAnchor(document.getElementById(section.endLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    {
                        path: 'straight',
                        startPlug: 'disc',
                        endPlug: 'behind',
                        color: 'red',
                        size: 3,
                        outline: true,
                        outlineColor: 'black'
                    }
                )
            } else if (section.status === 'end') {
                section.leaderLine = new LeaderLine(
                    LeaderLine.pointAnchor(document.getElementById(section.startLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    LeaderLine.pointAnchor(document.getElementById(section.endLine), {
                        x: '50%',
                        y: '50%'
                    }),
                    {
                        path: 'straight',
                        startPlug: 'disc',
                        endPlug: 'disc',
                        color: 'red',
                        size: 3,
                        outline: true,
                        outlineColor: 'black'
                    }
                )
            }
        })
    }
}

function attConnectivityMtx(lines, dragMap, connectivityMtx){

    //? trocar parametro lines por uma line singular

    let tempConnectivityMtx = JSON.parse(JSON.stringify(connectivityMtx))

    console.log(tempConnectivityMtx)
    
    //! ERRO AQUI 
    // Aqui alteramos o valor da matriz para definir todos aqueles que estão conectados entre si
    lines.forEach(line => {
        tempConnectivityMtx[line.startLine][line.endLine] = 1
        tempConnectivityMtx[line.endLine][line.startLine] = 1
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

    //Aqui iremos definir se os valores no connectorMtx são entradas ou saidas baseadas no configPins
    filteredDragMap.forEach((component) => {
    
    //Primeiro pegamos o valor do output do configPins
     let behaviorFunctions = editorCodeCaller(undefined, component.behavior)
     let configOutput = behaviorFunctions.configPins
    let configOutputPinKeys = Object.keys(configOutput)
    
    //E a partir dos pinos dados checamos se o seu valor é de in ou out e atribuimos um devido valor
    configOutputPinKeys.forEach(pin => {
        if(pin === 'type' || pin === 'events') return
        let pinFullId = `${component.componentName}/${pin}/${component.id}`
        Object.keys(connectivityMtx).forEach(upper => {
            if (tempConnectivityMtx[pinFullId][upper] !== null) {
                if(configOutput[pin] === 'in'){
                    tempConnectivityMtx[pinFullId][upper] = -1
                } else if(configOutput[pin] === 'out'){
                    tempConnectivityMtx[pinFullId][upper] = 1
                } else if(configOutput[pin] === 'in-out') {
                    let connectedToConnectorFullId = component.connectors.find(connector => connector.fullId === pinFullId).connectedTo[0]
                    let connectedToConnectorComponent = filteredDragMap.find(filtetedComponent => filtetedComponent.id === connectedToConnectorFullId.split('/')[2])
                    let connectedToConnectorConfig = connectedToConnectorComponent.connectors.find(connector => connector.fullId === connectedToConnectorFullId).connectorConfig
                    if(connectedToConnectorConfig === 'in'){
                        tempConnectivityMtx[pinFullId][upper] = 1
                    } else if (connectedToConnectorConfig === 'out') {
                        tempConnectivityMtx[pinFullId][upper] = -1
                    } else {
                        //! CONVERSAR COM JULIO SOBRE ESSES CASOS DE IN-OUT CONNECTADOS EM CADEIA
                        tempConnectivityMtx[pinFullId][upper] = 0
                    }
                }
                 else {
                    tempConnectivityMtx[pinFullId][upper] = 0
                }
        }})
    })

    //Aqui temos o mesmo caso acima mas com a ordem invertida na matriz
    configOutputPinKeys.forEach(pin => {
        if(pin === 'type' || pin === 'events') return
        let pinFullId = `${component.componentName}/${pin}/${component.id}`
        Object.keys(connectivityMtx).forEach(lefter => {
            if (tempConnectivityMtx[lefter][pinFullId] !== null) {
                if(configOutput[pin] === 'in'){
                    tempConnectivityMtx[lefter][pinFullId] = 1
                } else if(configOutput[pin] === 'out'){
                    tempConnectivityMtx[lefter][pinFullId] = -1
                } else if(configOutput[pin] === 'in-out') {
                    let connectedToConnectorFullId = component.connectors.find(connector => connector.fullId === pinFullId).connectedTo[0]
                    let connectedToConnectorComponent = filteredDragMap.find(filtetedComponent => filtetedComponent.id === connectedToConnectorFullId.split('/')[2])
                    let connectedToConnectorConfig = connectedToConnectorComponent.connectors.find(connector => connector.fullId === connectedToConnectorFullId).connectorConfig
                    if(connectedToConnectorConfig === 'in'){
                        tempConnectivityMtx[lefter][pinFullId] = -1
                    } else if (connectedToConnectorConfig === 'out') {
                        tempConnectivityMtx[lefter][pinFullId] = 1
                    } else {
                        //! CONVERSAR COM JULIO SOBRE ESSES CASOS DE IN-OUT CONNECTADOS EM CADEIA
                        tempConnectivityMtx[lefter][pinFullId] = 0
                    } 
                } else {
                    tempConnectivityMtx[lefter][pinFullId] = 0
                }
        }})
    })

    })

    return ({connectivityMtx: tempConnectivityMtx})
}
