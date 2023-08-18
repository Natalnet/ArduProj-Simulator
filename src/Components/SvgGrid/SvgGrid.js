import React from 'react'
import { createPortal } from 'react-dom'
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
                if(!d.breadboard) return
                const doc = parser.parseFromString(d.breadboard, 'text/html')
                const currentSvg = doc.getElementsByTagName('svg')[0]
                let behavior = ''
                if (d.behavior) {
                    behavior = d.behavior
                }
                if (alignment === 'simulador') {
                    return createPortal(
                        <SvgGridItem
                            key={d.componentName}
                            svg={currentSvg}
                            name={d.componentName}
                            breadboard={d.breadboard}
                            part={d.part}
                            behavior={behavior}
                        />,
                        document.querySelector('.SideBar')
                    )
                } else {
                    return createPortal(
                        <SvgGridItemEditor
                            key={d.componentName}
                            svg={currentSvg}
                            name={d.componentName}
                            breadboard={d.breadboard}
                            part={d.part}
                            behavior={behavior}
                        />,
                        document.querySelector('.SideBar')
                    )
                }

            })}

        </div>
    )
}