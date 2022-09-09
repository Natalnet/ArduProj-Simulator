import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { purple } from '@mui/material/colors';
import { AppContext } from '../../App';

export default function RouterButton(pageAlignment) {

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
    setAlignment(newAlignment);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        size='small'
      >
        <ToggleButton component={Link} to={'/'} value="simulador">
          <PlayArrowRoundedIcon />
        </ToggleButton>
        <ToggleButton component={Link} to={'/editor'} value="editor">
          <CodeRoundedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  )
}
