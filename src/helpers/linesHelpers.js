import LeaderLine from 'react-leader-line'
import useMousePosition from './linePositionHook'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import uuid from 'react-uuid';
import { editorCodeCaller } from './functionHelpers';



export function lineFunc(target, lines, setLines, dragMap, setDragMap, data, connectivityMtx, connectivityMtxMap, setConnectivityMtx, isSection = false) {

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

        var attConnectivityMtxOutput = attConnectivityMtx(tempLines, tempDragMap, connectivityMtx, connectivityMtxMap)

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

function attConnectivityMtx(lines, dragMap, connectivityMtx, connectivityMtxMap){

    //? trocar parametro lines por uma line singular

    let tempConnectivityMtx = JSON.parse(JSON.stringify(connectivityMtx))
    
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
        console.log(component)
    
    //Primeiro pegamos o valor do output do configPins
     let behaviorFunctions = editorCodeCaller(undefined, component.behavior)
     let configOutput = behaviorFunctions.configPins
    let configOutputPinKeys = Object.keys(configOutput)

    //E a partir dos pinos dados checamos se o seu valor é de in ou out e atribuimos um devido valor
    configOutputPinKeys.forEach(pin => {
        if(pin === 'type') return
        let pin = `${component.componentName}/${pin}/${component.id}`
        connectivityMtxMap.forEach(upper => {
            if (tempConnectivityMtx[pin][upper] !== null) {
                if(configOutput[pin] === 'in'){
                    tempConnectivityMtx[pin][upper] = -1
                } else if(configOutput[pin] === 'out'){
                    tempConnectivityMtx[pin][upper] = 1
                } else if(configOutput[pin] === 'in-out') {
                    tempConnectivityMtx[pin][upper] = 0
                } else {
                    tempConnectivityMtx[pin][upper] = 0
                }
        }})
    })

    //Aqui temos o mesmo caso acima mas com a ordem invertida na matriz
    configOutputPinKeys.forEach(pin => {
        if(pin === 'type') return
        let pin = `${component.componentName}/${pin}/${component.id}`
        connectivityMtxMap.forEach(lefter => {
            if (tempConnectivityMtx[lefter][pin] !== null) {
                if(configOutput[pin] === 'in'){
                    tempConnectivityMtx[lefter][pin] = 1
                } else if(configOutput[pin] === 'out'){
                    tempConnectivityMtx[lefter][pin] = -1
                } else {
                    tempConnectivityMtx[lefter][pin] = 0
                }
        }})
    })

    })

    /*

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
            let behaviorFunctions = editorCodeCaller(undefined, component.behavior)
            let configOutput = behaviorFunctions.configPins

            if(configOutput[connector.svgId] === 'in'){
                return
            }

            let component = dragMap.find(component => { 
                //TODO: trocar para achar o componente pela matriz
                if(!connector.connectedTo){
                    return null
                }
                return (component.id === connector.connectedTo.split('/')[2]) 
            })
            
            if(!component) return 

            //! Erro aqui vvv
            let includesComponent = false

            //Verificamos se os componentes alvos dos conectores ja estão no depthMap
            //TODO: otimizar isso vvv
            depthMap.forEach(depthLevel => {
                depthLevel.forEach(depthComponent => {
                    if(depthComponent === component){
                        includesComponent = true
                    }
                })
            })

            //Então se o teste acima for falso adicionamos o componente ao depthMap e ao fifo
            if(!includesComponent){
                depthMapAux.push(component)
                fifo.push(component)
            }
        })
        if(depthMapAux.length > 0){
            depthMap.push(depthMapAux)
        }
    }

    console.log('fifo:')
    console.log(fifo)

    //! Erro aqui vvv
    console.log('depthMap:')
    console.log(depthMap)
    */
    return ({connectivityMtx: tempConnectivityMtx})
}
