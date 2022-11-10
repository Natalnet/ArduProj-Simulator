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
import { createConnectors } from '../../Functions/Functions';
import { EditorContext } from '../../Pages/Editor/Editor';

export default function EditorComponentDisplay() {

    const { editorComponent } = React.useContext(AppContext)
    const { connectorList, setConnectorList } = React.useContext(EditorContext)

    const parser = new DOMParser()

    const connectorListCallBack = React.useCallback(() => { }, []);

    const [localSvgData, setLocalSvgData] = React.useState()

    const teste = React.useRef()

    console.log(editorComponent)
    React.useEffect(() => {

    }, [editorComponent])


    function hasEditorComponent() {
        if (editorComponent) {
            var localSvgData = createConnectors(editorComponent.part, editorComponent.breadboard, 'displayedSvg')

            console.log(localSvgData.connectorList)


            //! ERRO VVV
            //! Quando eu chamo esse hook o componente rerenderiza e cria um loop infinito
            //React.useMemo(() => setConnectorList(localSvgData.connectorList), [localSvgData.connectorList])

            //setConnectorList(prev => { if (prev != localSvgData.connectorList) { return localSvgData.connectorList } })

            console.log(connectorList)

            return (
                <svg
                    className='Svg'
                    width={localSvgData.svg.width.baseVal.value}
                    height={localSvgData.svg.height.baseVal.value}
                    dangerouslySetInnerHTML={{ __html: localSvgData.svg.innerHTML }}
                    id='displayedSvg'
                />)
        } else {
            return (
                <Typography variant="h5" component="div">
                    Selecione um componente a esquerda.
                </Typography>)
        }
    }

    return (
        <div>
            <Card sx={{ maxWidth: 345, minWidth: 50, maxHeight: 345, minHeight: 50 }} justifyContent="center">
                {hasEditorComponent()}
            </Card>
        </div>

    )
}
