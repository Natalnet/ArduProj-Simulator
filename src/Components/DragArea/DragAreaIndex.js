import React from 'react'
import DragComponentIndex from '../DragComponent/DragComponentIndex'
import './DragAreaStyle.css'
import {AppContext} from '../../App'

export default function DragAreaIndex() {

  
  const {dragMap} = React.useContext(AppContext)

  //Ainda não terminado

  const [count, setCount] = React.useState(0)

  React.useEffect(() => { 
    setCount(count + 1)
    console.log("dragMap mudou")
  }, [dragMap]);

  return (
    <div className='DragAreaDiv' onClick={() => {console.log(dragMap)}} >
      {dragMap.map(d => {
        return(
        <DragComponentIndex 
          name={d.componentName}
          svg={d.breadboard}
          part={d.part}
        />)
      }) }
      <button className='GridButton2' onClick={() => {setCount(count + 1)}}> Load </button>
    </div>
  )
}
