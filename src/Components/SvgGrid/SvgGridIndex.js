import React from 'react'
import SvgGridItemIndex from '../SvgGridItem/SvgGridItemIndex';
import './SvgGridStyle.css'
import {AppContext} from '../../App'

export default function SvgGridIndex(props) {
  const parser = new DOMParser();
  const [count, setCount] = React.useState('0')
  
  
/*
  const [localData, setLocalData] = React.useState(props.data);
  React.useEffect(() => { 
    setLocalData(props.data) 
    setCount(count + 1)
    console.log("data mudou")
  }, []);
 */ 

  return (
    <div className='Grid' key={count} >

      <button className='GridButton' onClick={() => {setCount(count + 1)}}> Load </button>

      {props.data.map(d => {
        if(!d.icon) {return}
        const doc = parser.parseFromString(d.icon, 'text/html');
        const currentSvg = doc.getElementsByTagName('svg')[0];
        return(
              <SvgGridItemIndex
                key={d.componentName}
                svg={currentSvg}
                name={d.componentName}
                breadboard={d.breadboard}
                part={d.part}
              />
        )
      })}
      
    </div>
  )
}