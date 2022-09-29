import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import DeveloperBoardRoundedIcon from '@mui/icons-material/DeveloperBoardRounded';
import PowerRoundedIcon from '@mui/icons-material/PowerRounded';
import { purple } from '@mui/material/colors';
import { AppContext } from '../../App';

export default function ToolsButton({screen, setScreen}) {

  const { alignment, setAlignment } = React.useContext(AppContext)

  const theme = createTheme({
    overrides:{
      palette: {
        primary: {
          main: '#111322',
        },
        secondary: {
          main: '#f44336',
        },
      }
    }
  });

  //Função de clique dos botões
  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setScreen(newAlignment);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color="primary"
        value={screen}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        style={{
          width:'fit-content',
          justifySelf:'center'
        }}
      >
        <ToggleButton value="components">
          <DeveloperBoardRoundedIcon />
        </ToggleButton>
        <ToggleButton value="tools">
          <PowerRoundedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  )
}
