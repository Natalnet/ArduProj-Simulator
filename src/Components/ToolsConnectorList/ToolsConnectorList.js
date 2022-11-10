import React from 'react'
import { EditorContext } from '../../Pages/Editor/Editor'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function ToolsConnectorList(props) {

    const { connectorList } = React.useContext(EditorContext)

    return (
        <FormGroup>
            {connectorList.map(c => {
                return (
                    <FormControlLabel control={<Switch defaultChecked />} label={c.id.charAt(0).toUpperCase() + c.id.slice(1)} />
                )
            })}
        </FormGroup>

    )
}
