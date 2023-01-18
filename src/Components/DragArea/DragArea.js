import React from 'react'
import DragComponentIndex from '../DragComponent/DragComponent'
import './DragAreaStyle.css'
import LeaderLine from 'react-leader-line'
import { AppContext } from '../../App'
import { lineFunc } from '../../helpers/functionHelpers'

export default function DragArea() {

  const { dragMap, lines, setLines } = React.useContext(AppContext)

  //Função para atualizar a linha quando o componente recebe um drag
  function updatePosition(targetId) {
    const elementId = targetId.split('/')[1]
    let filteredLines = []
    //Aqui é pego todas as linhas que estão ligadas ao componente que esta se movendo.
    lines.forEach(e => {
      if (e.id && e.id != 'Em aberto') {
        if (e.startLine.split('/')[1] == elementId || e.endLine.split('/')[1] == elementId) {
          filteredLines.push(e)
        }
      }
    })

    //Aqui é chamada a função que atualiza a LeaderLine
    filteredLines.forEach(element => {
      element.LeaderLine.position()
    });

  }


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
            updatePositionCallback={updatePosition}

          />
        )
      })}
    </div>
  )
}
