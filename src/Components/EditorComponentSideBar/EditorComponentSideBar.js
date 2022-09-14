import React from 'react'
import './EditorComponentSideBar.css'
import TextField from '@mui/material/TextField';

export default function EditorComponentSideBar() {
    return (
        <div className='EditorSideBar'>
            Editor
            <div>
                <TextField
                    id="outlined-multiline-static"
                    label="Codigo"
                    multiline
                    fullWidth
                    color='success'
                    focused
                    rows={17}
                    defaultValue="Escreva aqui o comportamento"
                />
            </div>
        </div>
    )
}
