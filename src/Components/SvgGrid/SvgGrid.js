import React from 'react'
import SvgGridItem from '../SvgGridItem/SvgGridItem';
import './SvgGridStyle.css'
import { AppContext } from '../../App';
import SvgGridItemEditor from '../SvgGridItemEditor/SvgGridItemEditor';


export default function SvgGrid() {
    const parser = new DOMParser();

    const { data, alignment } = React.useContext(AppContext)

    //* Checar https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook



    return (
        <div className='Grid'>
            {data.map(d => {
                let icone
                if (d.icon) {
                    icone = d.icon
                } else {
                    icone = d.breadboard
                }
                const doc = parser.parseFromString(icone, 'text/html')
                const currentSvg = doc.getElementsByTagName('svg')[0]
                if (alignment === 'simulador') {
                    return (
                        <SvgGridItem
                            key={d.componentName}
                            svg={currentSvg}
                            name={d.componentName}
                            breadboard={d.breadboard}
                            part={d.part}
                        />
                    )
                } else {
                    return (
                        <SvgGridItemEditor
                            key={d.componentName}
                            svg={currentSvg}
                            name={d.componentName}
                            breadboard={d.breadboard}
                            part={d.part}
                        />
                    )
                }

            })}

        </div>
    )
}