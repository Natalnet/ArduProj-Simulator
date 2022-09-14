import React from 'react'
import EditorComponentDisplay from '../../Components/EditorComponentDisplay/EditorComponentDisplay'
import EditorComponentSideBar from '../../Components/EditorComponentSideBar/EditorComponentSideBar'
import SideBar from '../../Components/SideBar/SideBar'
import './EditorStyle.css'

export default function Editor() {

    return (
        <div className='Editor'>
            <SideBar pageAligment={'editor'}/>
            <EditorComponentDisplay />
            <EditorComponentSideBar />
        </div>
    )
}
