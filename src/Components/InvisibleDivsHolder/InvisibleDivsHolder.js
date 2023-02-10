import React,{ useId } from 'react'
import { AppContext } from '../../App'
import InvisibleDivsSectionHolder from '../InvisibleDivsSectionHolder/InvisibleDivsSectionHolder'

export default function InvisibleDivsHolder() {

    const { lines } = React.useContext(AppContext)

    return (
        <div
            id='invisibleDivsHolder'
        >
            {
                lines.map(line => {
                    console.log(line)
                    return <InvisibleDivsSectionHolder key={useId} sections={line.sections} line={line} />
                })
            }
        </div>
    )
}
