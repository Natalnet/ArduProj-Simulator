import React from 'react'
import EditorComponentDisplay from '../../Components/EditorComponentDisplay/EditorComponentDisplay'
import EditorComponentSideBar from '../../Components/EditorComponentSideBar/EditorComponentSideBar'
import SideBar from '../../Components/SideBar/SideBar'
import ToolsArea from '../../Components/ToolsArea/ToolsArea'
import './EditorStyle.css'
import { AppContext } from '../../App'
import defaultLedCode from '../../Functions/defaultLedCode'
import { createConnectors } from '../../Functions/Functions'

export const EditorContext = React.createContext(null)

export default function Editor() {

    const { setAlignment } = React.useContext(AppContext)

    const [toolsMap, setToolsMap] = React.useState([])

    const [editorCode, setEditorCode] = React.useState(defaultLedCode)

    const [connectorList, setConnectorList] = React.useState()

    const [editorComponent, setEditorComponent] = React.useState()

    

    React.useEffect(() => {
        if(editorComponent){
            setConnectorList(createConnectors(editorComponent.part, editorComponent.breadboard, 'displayedSvg').connectorList)
        }
    },[editorComponent])

    setAlignment('editor')

    return (
        <div className='Editor'>
            <EditorContext.Provider value={{ toolsMap, setToolsMap, editorCode, setEditorCode, connectorList, setConnectorList, editorComponent, setEditorComponent }}>
                <SideBar editorCode={editorCode} editorComponent={editorComponent} connectorList={connectorList}  />
                <ToolsArea />
                <EditorComponentDisplay />
                <EditorComponentSideBar />
            </EditorContext.Provider>
        </div>
    )
}
