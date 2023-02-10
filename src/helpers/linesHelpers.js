import LeaderLine from 'react-leader-line'
import useMousePosition from './linePositionHook'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client';
import uuid from 'react-uuid';



export function lineFunc(target, lines, setLines, dragMap, setDragMap, isSection = false) {

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

        console.log('fechado')

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
            console.log(e)
            console.log(targetDragMap)
            return e === targetDragMap
        })

        tempDragMap[tempIndexEnd].connectors[tempConnectorsEndIndex].connectedTo = tempLines[index]['startLine']

        console.log(targetDragMap)

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

        setDragMap(tempDragMap)
        setLines(tempLines)

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

    console.log('makeline')

    console.log(section)

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
            if (section.status === 'moving' ) {
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
