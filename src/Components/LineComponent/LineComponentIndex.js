import React from 'react'
import {AppContext} from '../../App'
import LeaderLine from 'react-leader-line'

export default function LineComponentIndex(startLine,endLine,id) {

  const {lines} = React.useContext(AppContext)

  React.useEffect(() => {

  },[])

    
  const line = new LeaderLine(
    document.getElementById(startLine),
    document.getElementById(endLine),
    {
      path:'grid',
      startPlug:'disc',
      endPlug:'disc'
    }
    )

    return React.createElement(line)
}
