import LeaderLine from 'react-leader-line'
import useMousePosition from './linePositionHook'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import uuid from 'react-uuid';
import { editorCodeCaller } from './functionHelpers';



export function lineFunc(target, lines, setLines, dragMap, setDragMap, data, connectivityMtx, connectivityMtxMap, isSection = false) {

    console.log('linefunc')

    let tempLines = lines
    let tempDragMap = dragMap
    let tempConnectorsEndIndex

    if (!isSection) {
        console.log(target)
        var targetDragMap = dragMap.filter((i) => {
            return i.id === target.id.split('/')[1]
        })[0]


        var targetConnector = targetDragMap.connectors.filter((c, index) => {
            if (c.svgId === target.id.split('/')[0]) {
                tempConnectorsEndIndex = index
            }
            return c.svgId === target.id.split('/')[0]
        })[0]


        if (targetConnector) {
            if (targetConnector.connectedTo) throw Error('Conector ja esta sendo usado')
        }
    }

    //Essa primeira seção do codigo corresponde ao caso do caminho da linha ter sido devidamente fechado
    if (Object.values(tempLines).some(l => l.status === 'Em aberto') && (!isSection)) {


        let index = Object.values(tempLines).findIndex(l => { return l.endLine === undefined })

        tempLines[index].status = 'Fechado'
        tempLines[index].endLine = target.id
        tempLines[index].path = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
        //tempLines[index].id = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
        //?tempLines[index].position = function () { this.position() }



        // Logica para procurar o connector que inicia a linha e atualizar o valor de connectedTo nele
        let targetDragMapStart = dragMap.filter((i) => {
            return i.id === tempLines[index]['startLine'].split('/')[1]
        })[0]

        let tempConnectorsStartIndex
        let targetConnectorStart = targetDragMapStart.connectors.filter((c, indexc) => {
            if (c.svgId === tempLines[index]['startLine'].split('/')[0]) {
                tempConnectorsStartIndex = indexc
            }
            return c.svgId === tempLines[index]['startLine'].split('/')[0]
        })[0]

        targetConnectorStart.connectedTo = tempLines[index]['startLine']
        let tempIndexStart = tempDragMap.findIndex((e) => {
            return e === targetDragMapStart
        })

        tempDragMap[tempIndexStart].connectors[tempConnectorsStartIndex].connectedTo = tempLines[index]['endLine']


        // Logica para procurar o connector que termina a linha e atualizar o valor de connectedTo nele
        targetConnector.connectedTo = target.id
        let tempIndexEnd = tempDragMap.findIndex((e) => {
            return e === targetDragMap
        })

        tempDragMap[tempIndexEnd].connectors[tempConnectorsEndIndex].connectedTo = tempLines[index]['startLine']

        let tempSection

        tempLines[index].sections.map(section => {
            if (section.status === 'moving') {
                section.endLine = target.id
                section.status = 'end'
                section.leaderLine.remove()
                tempSection = section
            }
        })

        makeLine(tempLines, tempSection)

        //let newLineWithEmitters = makeEmitters(tempLines[index], emitter, tempDragMap[tempIndexEnd].componentName, data)

        //tempLines[index] = newLineWithEmitters

        console.log(tempLines)

        setDragMap(tempDragMap)
        setLines(tempLines)

        attConnectivityMtx(tempLines, connectivityMtx, tempDragMap, connectivityMtxMap)

    } else if (Object.values(tempLines).some(l => l.status === 'Em aberto') && (isSection)) {
        //Aqui temos a adição de mais uma section

        console.log('nova section')

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

        console.log('nova linha')

        let sectionUuid = uuid()

        let tempSections = []
        if (tempLines.sections) {
            tempSections = tempLines.sections
        }

        tempSections.push({ startLine: target.id, endLine: `section/${sectionUuid}`, id: sectionUuid, status: 'moving' })



        tempLines.push({ startLine: `${target.id}`, status: 'Em aberto', id: uuid(), sections: tempSections })

        setLines([...tempLines])

        //! Usar esse formato
        //let temp = {...lines, novoObj}

    }

}



export function makeLine(lines, section = false) {

    if (!lines.some(l => l.status == 'Em aberto') && lines.length > 0 && (!section)) {
        console.log('codigo morto?')
        /*
        let lastLine = lines[lines.length - 1]

        lines[lines.length - 1].LeaderLine = new LeaderLine(
            LeaderLine.pointAnchor(document.getElementById(lastLine.startLine), {
                x: '50%',
                y: '50%'
            }),
            LeaderLine.pointAnchor(document.getElementById(lastLine.endLine), {
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
            */
    } else {
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
                console.log(section.leaderLine)
                console.log(section.leaderLine.end)
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

function makeEmitters(newClosedLine, emitter, componentName, data) {

    let emitterEndComponent = data.find(component => { return (component.componentName = componentName) })

    emitter.on(newClosedLine.id, input => {
        //let func = editorCodeCaller(input, emitterEndComponent.behavior).main
        //func()
        console.log(input)
    })

    function emitFunc(input) {
        emitter.emit(newClosedLine.id, input)
    }

    newClosedLine.emit = emitFunc

    return (newClosedLine)

}

function attConnectivityMtx(lines, connectivityMtx, dragMap, connectivityMtxMap){

    lines.forEach(line => {
        //! Erro aqui
        console.log('startline', line.startLine)
        console.log('endline', line.endLine)
        connectivityMtx[line.startLine][line.endLine] = 1
        connectivityMtx[line.endLine][line.startLine] = 1
    })

    console.log(connectivityMtx)

    const toBeLookedComponentsSet = new Set()
    lines.forEach(line => {
        let id
        id = line.startLine.split('/')[1]
        toBeLookedComponentsSet.add(id)
        id = line.endLine.split('/')[1]
        toBeLookedComponentsSet.add(id)
    })

    let filteredDragMap
    filteredDragMap = dragMap.filter(component => {
        return toBeLookedComponentsSet.has(component.id)
    })

    let fifo = []
    let queue = []

    fifo.push(filteredDragMap[0])
    queue.push(filteredDragMap[0])

    console.log('fifo:')
    console.log(fifo)

    console.log('queue:')
    console.log(queue)

    while(fifo.length > 0){
        let currentComponent = fifo.shift()
        //! Erro aqui
        console.log(currentComponent)
        let queueAux = []
        currentComponent.connectors.forEach(connector => {
            let component = dragMap.find(component => { return (component.id === connector.connectedTo) })
            if(!queue.includes(component)){
                queueAux.push(component)
                fifo.push(component)
            }
        })
        queue.push(queueAux)
    }

    console.log('queue:')
    console.log(queue)
    /*
    //! Erro nessa logica?????????????
    filteredDragMap.forEach((component) => {
    
     let behaviorFunctions = editorCodeCaller(undefined, component.behavior)
     let configOutput = behaviorFunctions.configPins

    let configOutputPinKeys = Object.keys(configOutput)

    configOutputPinKeys.forEach(pin => {
        let pinId = `${pin}/${component.id}`
        connectivityMtxMap.forEach(upper => {
            console.log(upper)
            console.log(pinId)
            console.log(connectivityMtxMap)

            if (connectivityMtx[pinId][upper] !== null) {
                if(configOutput.pinId === 'in'){
                    connectivityMtx[pinId][upper] = -1
                } else if(configOutput.pinId === 'out'){
                    connectivityMtx[pinId][upper] = 1
                } else {
                    connectivityMtx[pinId][upper] = 0
                }
        }})
    })

    configOutputPinKeys.forEach(pin => {
        let pinId = `${pin}/${component.id}`
        connectivityMtxMap.forEach(lefter => {
            if (connectivityMtx[lefter][pinId] !== null) {
                if(configOutput.pinId === 'in'){
                    connectivityMtx[lefter][pinId] = 1
                } else if(configOutput.pinId === 'out'){
                    connectivityMtx[lefter][pinId] = -1
                } else {
                    connectivityMtx[lefter][pinId] = 0
                }
        }})
    })

    })
*/
    console.log('connectivityMtx:')
    console.log(connectivityMtx)
}
