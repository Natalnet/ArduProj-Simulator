import React from 'react'
import SvgGridItem from '../SvgGridItem/SvgGridItem';
import './SvgGridStyle.css'


export default function SvgGrid(props) {
    const parser = new DOMParser();


    return (
        <div className='Grid'>
            {props.data.map(d => {
                if (!d.icon) { return }
                const doc = parser.parseFromString(d.icon, 'text/html')
                const currentSvg = doc.getElementsByTagName('svg')[0]
                return (
                    <SvgGridItem
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