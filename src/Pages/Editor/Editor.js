import React from 'react'
import EditorComponentDisplay from '../../Components/EditorComponentDisplay/EditorComponentDisplay'
import EditorComponentSideBar from '../../Components/EditorComponentSideBar/EditorComponentSideBar'
import EditorInputOutput from '../../Components/EditorInputOutput/EditorInputOutput'
import SideBar from '../../Components/SideBar/SideBar'
import ToolsArea from '../../Components/ToolsArea/ToolsArea'
import './EditorStyle.css'
import { AppContext } from '../../App'
import defaultLedCode from '../../helpers/defaultLedCode'
import { createConnectors, editorCodeCaller } from '../../helpers/functionHelpers'
import defaultButtonCode from '../../helpers/defaultButtonCode'

export const EditorContext = React.createContext(null)

export default function Editor() {

    const { setAlignment } = React.useContext(AppContext)

    const [toolsMap, setToolsMap] = React.useState([])

    const [editorCode, setEditorCode] = React.useState('')

    const [connectorList, setConnectorList] = React.useState()

    const [connectorValues, setConnectorValues] = React.useState({})

    const [editorComponent, setEditorComponent] = React.useState()

    const [pinsConfiguration, setPinsConfiguration] = React.useState()



    React.useEffect(() => {
        try {
            if (editorComponent) {

                //Codigo para atualizar os connectors quando o componente é selecionado
                let connectorsHolder = createConnectors(editorComponent.part, editorComponent.breadboard, 'displayedSvg', editorComponent.componentName, editorComponent.behavior).connectorList

                setConnectorList(connectorsHolder)

            }
        }
        catch (error) {
            console.log(error)
        }
    }, [editorComponent])


    setAlignment('editor')

    return (
        <div className='Editor'>
            <EditorContext.Provider value={{
                toolsMap, setToolsMap,
                editorCode, setEditorCode,
                connectorList, setConnectorList,
                editorComponent, setEditorComponent,
                connectorValues, setConnectorValues,
                pinsConfiguration, setPinsConfiguration
            }}>
                <SideBar
                    editorCode={editorCode}
                    editorComponent={editorComponent}
                    connectorList={connectorList}
                    connectorValues={connectorValues}
                    pinsConfiguration={pinsConfiguration}
                    setPinsConfiguration={setPinsConfiguration}
                    setConnectorValues={setConnectorValues}
                />
                <ToolsArea />
                <EditorComponentDisplay />
                <EditorComponentSideBar />
                <EditorInputOutput />
            </EditorContext.Provider>
        </div>
    )
}
