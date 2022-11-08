import React from 'react'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import GestureRoundedIcon from '@mui/icons-material/GestureRounded';
import './ToolsGridStyle.css'
import { EditorContext } from '../../Pages/Editor/Editor';
import uuid from 'react-uuid'

export default function ToolsGrid() {

    const {toolsMap, setToolsMap} = React.useContext(EditorContext)

    const tools = [
        {

            name: 'digital',
            sigla: 'D',
            color: 'orangered',
            type:'wire',
            icon: <ArrowRightAltRoundedIcon fontSize='large' />

        },
        {

            name: 'analogico',
            sigla: 'A',
            color: 'black',
            type:'wire',
            icon: <GestureRoundedIcon fontSize='large' />

        },
        {

            name: 'f',
            sigla: 'F',
            color: 'blue',
            type:'screen',
            icon: <TuneRoundedIcon fontSize='large' />

        },
        {

            name: 'display',
            sigla: 'Di',
            color: 'green',
            type:'screen',
            icon: <TuneRoundedIcon fontSize='large' />

        }
    ]

    function toolsMapHandler(component) {
        
            let tempMap = [...toolsMap]
            let id = uuid()
            tempMap.push({componentName: component.name, color:component.color,type:component.type, icon:component.icon, id:id})

            setToolsMap(tempMap)

            console.log(toolsMap)
    }

    return (
        <div className='Grid'>
            {tools.map((t, index) => {
                return (
                    <div
                        className='ItemDiv'
                        key={index}
                        style={{
                            backgroundColor: t.color,
                            height: '5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onClick={() => {toolsMapHandler(t)} }
                    >
                        <span>
                            {t.icon}
                        </span>
                    </div>
                )
            })}
        </div >

    )
}
