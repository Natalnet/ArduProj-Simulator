import React from 'react'
import './EditorComponentSideBar.css'
import TextField from '@mui/material/TextField';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"
import { EditorContext } from '../../Pages/Editor/Editor';
import defaultLedCode from '../../helpers/defaultLedCode';


export default function EditorComponentSideBar() {

    const { editorCode, setEditorCode } = React.useContext(EditorContext)


    function onChange(newValue) {
        setEditorCode(newValue)
    }

    return (
        <div className='EditorSideBar'>
            <div>
                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    onChange={onChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    height='95vh'
                    width='18rem'
                    wrapEnabled='true'
                    defaultValue={editorCode}
                />
            </div>
        </div>
    )
}
