import React from 'react'
import EditorComponentDisplay from '../../Components/EditorComponentDisplay/EditorComponentDisplay'
import EditorComponentSideBar from '../../Components/EditorComponentSideBar/EditorComponentSideBar'
import SideBar from '../../Components/SideBar/SideBar'
import ToolsArea from '../../Components/ToolsArea/ToolsArea'
import './EditorStyle.css'
import { AppContext } from '../../App'
import defaultLedCode from '../../Functions/defaultLedCode'
import { createConnectors, editorCodeCaller } from '../../Functions/Functions'
import defaultButtonCode from '../../Functions/defaultButtonCode'

export const EditorContext = React.createContext(null)

export default function Editor() {

    const { setAlignment } = React.useContext(AppContext)

    const [toolsMap, setToolsMap] = React.useState([])

    const [editorCode, setEditorCode] = React.useState(defaultButtonCode)

    const [connectorList, setConnectorList] = React.useState()

    const [connectorValues, setConnectorValues] = React.useState({})

    const [editorComponent, setEditorComponent] = React.useState()

    const [pinsConfiguration, setPinsConfiguration] = React.useState()



    React.useEffect(() => {
        if (editorComponent) {

            //Codigo para atualizar os connectors quando o componente é selecionado
            let connectorsHolder = createConnectors(editorComponent.part, editorComponent.breadboard, 'displayedSvg').connectorList

            setConnectorList(connectorsHolder)

            let valuesHolder = {}
            connectorsHolder.forEach(element => {
                valuesHolder[element.id] = {
                    value: 0,
                    type: 'inalterado'
                }
            })

            //Codigo para chamar o configPins assim que o componente é selecionado
            let configHolder = editorCodeCaller(valuesHolder, editorCode).configPins


            Object.keys(configHolder).map((c) => {
                if (c == 'events') {
                    Object.keys(configHolder.events).map((e) => {
                        valuesHolder = { ...valuesHolder, events: {...valuesHolder.events ,[e]: [false, configHolder.events[e], undefined] } }
                    })
                    
                } else {
                    valuesHolder = { ...valuesHolder, [c]: { value: valuesHolder[c].value, type: configHolder[c] } }
                }
                
            })
            

            if (configHolder.events) {
                let componentCall = document.getElementById('displayedSvg')
                
                Object.keys(configHolder.events).map((k) => {
                    componentCall.addEventListener(configHolder.events[k], e => {
                        let arrHolder = valuesHolder.events[k]
                        arrHolder[0] = !arrHolder[0]
                        arrHolder[2] = e
                        console.log(e)
                        valuesHolder.events[k] = arrHolder
                        setConnectorValues(valuesHolder)
                    })
                })
                
            }
            console.log(valuesHolder)
            setConnectorValues(valuesHolder)
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
            </EditorContext.Provider>
        </div>
    )
}
