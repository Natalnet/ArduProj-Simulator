import './App.css';
import React, { useState } from 'react'

import { Route, BrowserRouter as Router, Routes, Switch } from 'react-router-dom';
import Editor from './Pages/Editor/Editor';
import Simulador from './Pages/Simulador/Simulador';


export const AppContext = React.createContext(null)

function App() {

    //Todos os componentes presentes no drag and drop
    const [dragMap, setDragMap] = useState([])

    const [lines, setLines] = useState([])

    const [data, setData] = React.useState([])

    const [alignment, setAlignment] = React.useState('simulador')

    const [connectivityMtx, setConnectivityMtx] = useState([])

    const [connectivityMtxMap, setConnectivityMtxMap] = useState([])



    return (
        <div className="App" >
            <AppContext.Provider value={{ data, setData, dragMap, setDragMap, lines, setLines, alignment, setAlignment, connectivityMtx, setConnectivityMtx, connectivityMtxMap, setConnectivityMtxMap }}>
                <Routes>
                    <Route path='/' element={<Simulador />} />
                    <Route path='editor' element={<Editor />} />
                </Routes>
            </AppContext.Provider>
        </div>
    );
}

export default App;