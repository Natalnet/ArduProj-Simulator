import React from 'react'
import { AppContext } from '../../App'
import InvisibleDiv from '../InvisibleDiv/InvisibleDiv'
import InvisibleDivsSectionHolder from '../InvisibleDivsSectionHolder/InvisibleDivsSectionHolder'

export default function InvisibleDivsHolder() {

    const { lines } = React.useContext(AppContext)

    console.log(lines)

    return (
        <div
            id='invisibleDivsHolder'
        >
            {
                lines.map(line => {
                    return <InvisibleDivsSectionHolder sections={line.sections} />
                })
            }
        </div>
    )
}
