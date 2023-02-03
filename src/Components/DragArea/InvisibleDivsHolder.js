import React from 'react'
import { AppContext } from '../../App'
import InvisibleDiv from '../InvisibleDiv/InvisibleDiv'

export default function InvisibleDivsHolder() {

    const { lines } = React.useContext(AppContext)

    //Função para atualizar a linha quando o componente recebe um drag
    function updatePosition(targetId, lines) {
        //const elementId = targetId.split('/')[1]
        let filteredLines = []
        //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
        lines.forEach(e => {
            if (e.id === 'Em aberto') {

                filteredLines.push(e)

            }
        })

        //Aqui é chamada a função que atualiza a LeaderLine
        filteredLines.forEach(element => {
            if (!element.LeaderLine) return
            element.LeaderLine.position()

        });

    }

    return (
        <div
            id='invisibleDivsHolder'
        >
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            {lines.map(line => {
                console.log(line)
                /*
                return(
                    line.sections.map(section => {
                        console.log(section)
                        return (
                            <InvisibleDiv
                                updatePositionCallback={updatePosition}
                                sectionUuid={section.id}
                            />
                        )
                    })
                )
                */
            })}
        </div>
    )
}
