import React from 'react'
import InvisibleDiv from '../InvisibleDiv/InvisibleDiv'

export default function InvisibleDivsSectionHolder({ sections, line }) {

    //Função para atualizar a linha quando o componente recebe um drag
    function updatePosition(lines) {
        //const elementId = targetId.split('/')[1]
        let filteredSections = []
        //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
        lines.forEach(line => {
            if (line.status === 'Em aberto') {
                line.sections.forEach(section => {
                    filteredSections.push(section)
                })
            }
        })

        //console.log(filteredSections)

        //Aqui é chamada a função que atualiza a LeaderLine
        filteredSections.forEach(section => {
            if (!section.leaderLine) return
            section.leaderLine.position()
        })
    }

    return (
        <div>
            {sections.map(section => {
                if (section.status === 'end') return
                return (
                    <InvisibleDiv
                        key={section.id}
                        updatePositionCallback={updatePosition}
                        sectionUuid={section.id}
                        section={section}
                        line={line}
                    />
                )
            })}
        </div>
    )
}
