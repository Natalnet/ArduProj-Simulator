import React from 'react'
import SvgGridItemIndex from '../SvgGridItem/SvgGridItemIndex';
import './SvgGridStyle.css'


export default function SvgGridIndex(props) {
  const parser = new DOMParser();


  return (
    <div className='Grid'>
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