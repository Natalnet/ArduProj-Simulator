import React from 'react'
import './EditorComponentSideBar.css'
import TextField from '@mui/material/TextField';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools"


export default function EditorComponentSideBar() {

    function onChange(newValue) {
        console.log("change", newValue);
    }

    return (
        <div className='EditorSideBar'>
            Editor
            <div>
                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    onChange={onChange}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                    height='27rem'
                    width='18rem'
                    wrapEnabled='true'
                />
            </div>
        </div>
    )
}
