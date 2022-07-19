import React from 'react'
import DragComponentIndex from '../DragComponent/DragComponentIndex'
import './DragAreaStyle.css'
import LeaderLine from 'react-leader-line'
import {AppContext} from '../../App'

export default function DragAreaIndex() {

  
  const {dragMap, lines} = React.useContext(AppContext)

  //Ainda não terminado

  const [count, setCount] = React.useState(0)

  React.useEffect(() => { 
    setCount(count + 1)
    console.log("dragMap mudou")
  }, [dragMap])

  return (
    <div className='DragAreaDiv'>
      {dragMap.map(d => {
        return(
        <DragComponentIndex 
          name={d.componentName}
          svg={d.breadboard}
          part={d.part}
          id={d.id}
          key={d.id}
        />)
      }) }
      {lines.map(d => {
        new LeaderLine(document.getElementById(d.startLine),document.getElementById(d.endLine))
      })}
      <button className='GridButton2' onClick={() => {setCount(count + 1)}}> Load </button>
    </div>
  )
}
