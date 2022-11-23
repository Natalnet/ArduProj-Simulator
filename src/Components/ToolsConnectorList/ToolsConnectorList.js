import React from 'react'
import { EditorContext } from '../../Pages/Editor/Editor'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { height } from '@mui/system';

export default function ToolsConnectorList(props) {

    const { connectorList, setConnectorList, connectorValues, setConnectorValues } = React.useContext(EditorContext)



    return (
        <FormGroup>
            {connectorList.map(c => {

                const handleCheck = (e) => {
                    setConnectorValues({ ...connectorValues, [c.id]: e.target.value })
                }

                console.log(connectorValues)
                return (
                    <FormControlLabel control={
                        <TextField
                            id="outlined-basic"
                            label={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                            variant="outlined"
                            sx={{
                                width: '80%',
                                height: '80%',
                                position: 'relative',
                                marginLeft: '2rem'
                            }} />}
                        onChange={(event) => { handleCheck(event) }}
                    />
                )
            })}
        </FormGroup>

    )
}
