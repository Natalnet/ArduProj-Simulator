import React from 'react'
import SvgGridItem from '../SvgGridItem/SvgGridItem';
import './SvgGridStyle.css'
import { AppContext } from '../../App';


export default function SvgGrid(pageAlignment) {
    const parser = new DOMParser();

    const { data } = React.useContext(AppContext)

    // Checar https://stackoverflow.com/questions/55823296/reactjs-prevstate-in-the-new-usestate-react-hook

    return (
        <div className='Grid'>
            {data.map(d => {
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
                        pageAlignment={pageAlignment}
                    />
                )
            })}

        </div>
    )
}