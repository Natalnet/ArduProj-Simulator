import React from 'react'
import { EditorContext } from '../../Pages/Editor/Editor';
import { editorCodeCaller } from '../../helpers/functionHelpers';

export default function EditorInputOutput() {

    const { editorComponent} = React.useContext(EditorContext)

    const [inputValues, setInputValues] = React.useState({})

    React.useEffect(() => {
        if(editorComponent){
            
            let behaviorFunctions = editorCodeCaller(undefined, editorComponent.behavior)
            let configOutput = behaviorFunctions.configPins
            Object.keys(configOutput).forEach(connector => {
                if(connector.includes('connector')){
                    console.log(connector)
                    setInputValues(inputValues + `, [${connector}]:{value:0}`)
                }
            })
        }
    }, [editorComponent])

    function getOutput(){
        
    }

  return (
    <div  
    style={{
        backgroundColor: 'hsla(233, 33%, 10%, 0.7)',
        position: 'absolute',
        bottom: 0,
        left: '22%',
        height: '30%',
        width:'41%',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    }} >
        <div 
        style={{
            width: '30%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
        }}>
            <h4>Input</h4>
            <input
                type="text"
                placeholder="input"
                value={inputValues}
                onChange={e => {setInputValues(e.target.value)}}    
            />
        </div>
        <button
        style={{
            height: '40%',
        }}
        onClick={getOutput}
        >Run</button>
        <div
        style={{
            width: '30%',
            height: '100%',
        }}>
            <h4>Output</h4>
        </div>
    </div>
  )
}
