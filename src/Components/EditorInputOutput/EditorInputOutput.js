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
                console.log(connector)
                if(connector.includes('connector')){
                    setInputValues({
                        ...inputValues,
                        [connector]: 0
                    })
                }
            })
        }
    }, [editorComponent])
    

    function hasEditorComponent(){
        return(
            console.log(inputValues)
           
        )
            
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
        }}>
            <h4>Input</h4>
            {editorComponent ? 
             Object.keys(inputValues).forEach(connector => {
                if(connector.includes('connector')){
                        <div>
                            <input
                            type="text"
                            placeholder={connector}
                            value={inputValues[connector]}
                            onChange={e => {
                                setInputValues({
                                    ...inputValues,
                                    [connector]: e.target.value
                                })
                            }}
                            />
                        
                        </div>
                }
            })
            : null}
        </div>
        <button
        style={{
            height: '40%',
        }}
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
