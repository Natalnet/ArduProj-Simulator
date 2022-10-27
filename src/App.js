import './App.css';
import React, { useState } from 'react'
import SideBar from './Components/SideBar/SideBar';
import DragArea from './Components/DragArea/DragArea';

import { Route, BrowserRouter as Router, Routes, Switch } from 'react-router-dom';
import Home from './Pages/Simulador/Simulador';
import Editor from './Pages/Editor/Editor';
import Simulador from './Pages/Simulador/Simulador';


export const AppContext = React.createContext(null)

function App() {

    //Todos os componentes presentes no drag and drop
    const [dragMap, setDragMap] = useState([])

    const [lines, setLines] = useState([])

    const [data, setData] = React.useState([])

    const [alignment, setAlignment] = React.useState('simulador')

    const [editorComponent, setEditorComponent] = React.useState()

    return (
        <div className="App" >
            <AppContext.Provider value={{ data, setData, dragMap, setDragMap, lines, setLines, editorComponent, setEditorComponent, alignment, setAlignment }}>
                <Routes>
                    <Route path='/' element={<Simulador />} />
                    <Route path='editor' element={<Editor />} />
                </Routes>
            </AppContext.Provider>
        </div>
    );
}

export default App;