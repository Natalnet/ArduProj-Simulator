import React from 'react'
import { EditorContext } from '../../Pages/Editor/Editor'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import { height } from '@mui/system';

export default function ToolsConnectorList(props) {

    const {
        connectorList, setConnectorList,
        connectorValues, setConnectorValues,
        pinsConfiguration, setPinsConfiguration
    } = React.useContext(EditorContext)



    return (
        <FormGroup
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 1,
                m: 1,
                flexWrap: 'wrap',
                gap: 1
            }}
        >
            {connectorList.map(c => {

                
                if (connectorValues[c.id].type == 'in' && props.name == 'outDisplay') {
                    return
                } else if (connectorValues[c.id].type == 'out' && props.name == 'inDisplay') {
                    return
                }

                const handleCheck = (e) => {
                    setConnectorValues({ ...connectorValues, [c.id]: { type: connectorValues[c.id].type, value: e.target.value } })
                }


                return (
                    <FormControlLabel
                        sx={{
                            flexShrink: 1
                        }}
                        control={
                            <TextField
                                id="outlined-basic"
                                label={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                                variant="outlined"
                                color="error"
                                defaultValue={0}
                                key={c.id}
                                sx={{
                                    width: '80%',
                                    height: '80%',
                                    position: 'relative',
                                    marginLeft: '2rem'
                                }} />}
                                value={connectorValues[c.id].value}
                                disabled={props.name == 'outDisplay'}
                        onChange={(event) => { handleCheck(event) }}
                    />
                )
            })}
        </FormGroup>

    )
}
