import './App.css';
import React, { useState } from 'react'
import { createNanoEvents } from 'nanoevents'

import { Route, BrowserRouter as Router, Routes, Switch } from 'react-router-dom';
import Editor from './Pages/Editor/Editor';
import Simulador from './Pages/Simulador/Simulador';

//import { led, bateria } from './@types/exportData';

export const AppContext = React.createContext(null)

function App() {

    //Todos os componentes presentes no drag and drop
    const [dragMap, setDragMap] = useState([])

    const [lines, setLines] = useState([])

    const [data, setData] = React.useState([])

    const [alignment, setAlignment] = React.useState('simulador')

    const [connectivityMtx, setConnectivityMtx] = useState({})

    const [eletronicMtx, setEletronicMtx] = useState(null)

    const [eletronicStateList, setEletronicStateList] = useState({})

    const [running, setRunning] = React.useState(false)



    

    return (
        <div className="App" >
            <AppContext.Provider value={{ data, setData, dragMap, setDragMap, lines, setLines, alignment, setAlignment, connectivityMtx, setConnectivityMtx, eletronicMtx, setEletronicMtx, eletronicStateList, setEletronicStateList, running, setRunning}}>
                <Routes>
                    <Route path='/' element={<Simulador />} />
                    <Route path='editor' element={<Editor />} />
                </Routes>
            </AppContext.Provider>
        </div>
    );
}

export default App;