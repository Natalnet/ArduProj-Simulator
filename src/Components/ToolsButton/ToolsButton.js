import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DeveloperBoardRoundedIcon from "@mui/icons-material/DeveloperBoardRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import { AppContext } from "../../App";

export default function ToolsButton({
    screen,
    setScreen,
    pagination,
    setPagination,
    data,
    PAGINATION_SETTINGS,
}) {
    const { alignment, setAlignment } = React.useContext(AppContext);

    const theme = createTheme({
        overrides: {
            palette: {
                primary: {
                    main: "#111322",
                },
                secondary: {
                    main: "#f44336",
                },
            },
        },
    });

    //Função de clique dos botões do simulator
    const handleSimulatorToolsChange = (event, newPagination) => {
        if (newPagination !== null) {
            if (newPagination === "left") {
                if (pagination + 1 === 1) return;
                setPagination((prevState) => {
                    return prevState - 1;
                });
            }
            if (newPagination === "right") {
                if (pagination + 1 >= data.length / PAGINATION_SETTINGS) return;
                setPagination((prevState) => {
                    return prevState + 1;
                });
            }
        }
    };

    //Função de clique dos botões do editor
    const handleEditorToolsChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setScreen(newAlignment);
        }
    };

    const simulatorRender = () => {
        return (
            <ToggleButtonGroup
                color="primary"
                value={screen}
                exclusive
                onChange={handleSimulatorToolsChange}
                aria-label="Platform"
                style={{
                    bottom: 0,
                }}
                fullWidth
            >
                <ToggleButton value="left">
                    <ArrowBackRoundedIcon />
                </ToggleButton>
                <ToggleButton value="right">
                    <ArrowForwardRoundedIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        );
    };

    const editorRender = () => {
        return (
            <ToggleButtonGroup
                color="primary"
                value={screen}
                exclusive
                onChange={handleEditorToolsChange}
                aria-label="Platform"
                style={{
                    position: "absolute",
                    bottom: 0,
                }}
                fullWidth
            >
                <ToggleButton value="components">
                    <DeveloperBoardRoundedIcon />
                </ToggleButton>
                <ToggleButton value="tools">
                    <PowerRoundedIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            {alignment === alignment //'simulador'
                ? //TODO ver possibilidade de parar de usar as tools ou muda-las
                  simulatorRender()
                : editorRender()}
        </ThemeProvider>
    );
}
