import LeaderLine from 'react-leader-line'
import useMousePosition from './linePositionHook'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import uuid from 'react-uuid';



export function lineFunc(target, lines, setLines, dragMap, setDragMap, isSection = false) {

    let tempLines = lines
    let tempDragMap = dragMap
    let tempConnectorsEndIndex

    if (!isSection) {
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
    if (Object.values(tempLines).some(l => l.id === 'Em aberto') && (!isSection)) {

        let index = Object.values(tempLines).findIndex(l => { return l.endLine === undefined })

        tempLines[index].endLine = target.id
        tempLines[index].id = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
        tempLines[index].position = function () { this.position() }
        setLines(tempLines)


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
            console.log(e)
            console.log(targetDragMap)
            return e === targetDragMap
        })

        tempDragMap[tempIndexEnd].connectors[tempConnectorsEndIndex].connectedTo = tempLines[index]['startLine']


        setDragMap(tempDragMap)

        makeLine(lines)
    }
    //Aqui temos o caso de estar sendo iniciado uma nova linha
    else {
        let sectionUuid = uuid()

        let tempSections = []
        if (tempLines.sections) {
            tempSections = tempLines.sections
        }
        /*
        if (tempLines.sections.some(section => { return section.status === 'moving' })) {
            tempLines.sections.map(section => { 
                return(
                    section.status === 'stoped'
                )
                 
            }
            )
        }
        */
        let finalId = target.in
        if(target.id.split('/').length < 2) {
            finalId = `section/${target.id}`
        }
        tempSections.push({ startLine: target.id, endLine: `section/${sectionUuid}`, id: sectionUuid, status:'moving' })

        tempLines.push({ startLine: `${target.id}`, id: 'Em aberto', sections: tempSections })
        console.log(tempLines)
        setLines(tempLines)
        

    }

}



export function makeLine(lines, invisibleDivId = '') {
    if (!lines.some(l => l.id == 'Em aberto') && lines.length > 0) {

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

    } else {

        let lastLine = lines[lines.length - 1]

        console.log(document.getElementById(invisibleDivId))

        lines[lines.length - 1].LeaderLine = new LeaderLine(
            LeaderLine.pointAnchor(document.getElementById(lastLine.startLine), {
                x: '50%',
                y: '50%'
            }),
            LeaderLine.pointAnchor(document.getElementById(invisibleDivId), {
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
}
