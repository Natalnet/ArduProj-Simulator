import React, { useEffect } from 'react'
import DragComponentIndex from '../DragComponent/DragComponent'
import './DragAreaStyle.css'
import LeaderLine from 'react-leader-line'
import { AppContext } from '../../App'
import { lineFunc } from '../../helpers/functionHelpers'
import InvisibleDivsHolder from '../InvisibleDivsHolder/InvisibleDivsHolder'

export default function DragArea() {

    const { dragMap, lines, emitter } = React.useContext(AppContext)

    //Função para atualizar a linha quando o componente recebe um drag
    function updatePosition(componentId) {
        //const elementId = targetId.split('/')[1]
        let filteredSections = []
        //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
        lines.forEach(line => {
            if (line.startLine.split('/')[1] === componentId || line.endLine.split('/')[1] === componentId) {
                line.sections.forEach(section => {
                    filteredSections.push(section)
                })
            }
        })


        //Aqui é chamada a função que atualiza a LeaderLine
        filteredSections.forEach(section => {
            if (!section.leaderLine) return
            section.leaderLine.position()
        })
    }

    useEffect(() => {
        console.log(lines)
        console.log(dragMap)
    }, [lines])



    return (
        <div className='DragAreaDiv'>
            {dragMap.map(d => {
                return (
                    <DragComponentIndex
                        name={d.componentName}
                        svg={d.breadboard}
                        part={d.part}
                        id={d.id}
                        key={d.id}
                        position={d.position}
                        updatePositionCallback={updatePosition}
                    />
                )
            })}
            <InvisibleDivsHolder />
        </div>
    )
}
