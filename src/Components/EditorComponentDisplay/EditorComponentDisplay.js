import React from 'react'
import './EditorComponentDisplayStyle.css'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import SaveIcon from '@mui/icons-material/Save';
import { AppContext } from '../../App'

export default function EditorComponentDisplay() {

    const { editorComponent } = React.useContext(AppContext)

    const parser = new DOMParser();



    function hasEditorComponent() {
        if (editorComponent) {
            const doc = parser.parseFromString(editorComponent.breadboard, 'text/html')
            const svg = doc.getElementsByTagName('svg')[0]
            return(
            <svg
                className='Svg'
                width={svg.width.baseVal.value}
                height={svg.height.baseVal.value}
                dangerouslySetInnerHTML={{ __html: svg.innerHTML }}
            />)
        } else {
            return(
            <Typography variant="h5" component="div">
                Selecione um componente a esquerda.
            </Typography>)
        }
    }

    return (
        <div>
            <Card sx={{ maxWidth: 345 }} justifyContent="center">
                {hasEditorComponent()}
            </Card>
        </div>
    )
}
