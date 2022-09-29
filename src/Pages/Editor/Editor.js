import React from 'react'
import EditorComponentDisplay from '../../Components/EditorComponentDisplay/EditorComponentDisplay'
import EditorComponentSideBar from '../../Components/EditorComponentSideBar/EditorComponentSideBar'
import SideBar from '../../Components/SideBar/SideBar'
import ToolsArea from '../../Components/ToolsArea/ToolsArea'
import './EditorStyle.css'

export const EditorContext = React.createContext(null)

export default function Editor() {

    const [toolsMap, setToolsMap] = React.useState([])

    return (
        <div className='Editor'>
            <EditorContext.Provider value={{toolsMap, setToolsMap}}>
                <SideBar pageAlignment='editor' />
                <ToolsArea />
                <EditorComponentDisplay />
                <EditorComponentSideBar />
            </EditorContext.Provider>
        </div>
    )
}
