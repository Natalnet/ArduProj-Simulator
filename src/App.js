import './App.css';
import React, { useState } from 'react'
import SideBarIndex from './Components/SideBar/SideBarIndex';
import DragAreaIndex from './Components/DragArea/DragArea';
import Header from './Components/Header/Header';


export const AppContext = React.createContext(null)

function App() {

  

  //Todos os componentes presentes no drag and drop
  const [dragMap, setDragMap] = useState([])

  const [lines, setLines] = useState([])

  return (
    <div className="App" >
      <AppContext.Provider value={{dragMap, setDragMap, lines, setLines}}>
        <SideBarIndex/>
        <DragAreaIndex />
      </AppContext.Provider>
    </div>
  );
}

export default App;