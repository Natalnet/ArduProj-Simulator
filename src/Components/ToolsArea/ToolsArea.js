import React from 'react'
import { EditorContext } from '../../Pages/Editor/Editor'
import ToolsAreaComponent from '../ToolsAreaComponent/ToolsAreaComponent'

export default function ToolsArea() {

    const { toolsMap } = React.useContext(EditorContext)

    return (
        <div className='DragAreaDiv'>
            {toolsMap.map(t => {
                return (
                    <ToolsAreaComponent 
                    id={t.id}
                    color={t.color}
                    icon={t.icon}
                    type={t.type}
                    />
                )
            })}
        </div>
    )
}
