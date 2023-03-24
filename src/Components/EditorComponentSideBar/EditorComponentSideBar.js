import React, { useEffect, useState } from 'react'
import './EditorComponentSideBar.css'
import TextField from '@mui/material/TextField';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import { EditorContext } from '../../Pages/Editor/Editor';
import defaultLedCode from '../../helpers/defaultLedCode';
import { AppContext } from '../../App'



export default function EditorComponentSideBar() {

    const { data, setData} = React.useContext(AppContext)
    const { editorCode, setEditorCode, editorComponent, setEditorComponent} = React.useContext(EditorContext)

    function onChange(newValue) {
        setEditorCode(newValue)
        setEditorComponent({...editorComponent, behavior:newValue})
        console.log(data)
        let index = data.findIndex(component => {
            return(component.componentName === editorComponent.componentName)
        })
        let dataHolder = data
        dataHolder[index].behavior = newValue 
        setData(dataHolder)
    }

    return (
        <div className='EditorSideBar'>
            <div>
                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={editorCode}
                    onChange={onChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    height='95vh'
                    width='18rem'
                    wrapEnabled='true'
                    defaultValue={'editorCode'}
                />
            </div>
        </div>
    )
}
