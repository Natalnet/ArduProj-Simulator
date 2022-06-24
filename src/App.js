import './App.css';
import React, { useState } from 'react'
import SideBarIndex from './Components/SideBar/SideBarIndex';
import JSZip from 'jszip';
import DragAreaIndex from './Components/DragArea/DragAreaIndex';

export const AppContext = React.createContext(null)

function App() {

  //Lib para fazer o unzip
  var jsZip = new JSZip


  //Arquivos importados
  const [data, setData] = useState([])

  //Todos os componentes presentes no drag and drop
  const [dragMap, setDragMap] = useState([])

  //Função responsavel por extrair arquivos do zip e adicionalos no data
  function unzipFile(file) {
    return new Promise((resolve, reject) => {
    
    //Variavel temporaria para onde é passada os arquivos
    let dataLet = data

    //Aqui o arquivo é lido como um buffer
    const bufferReader = new FileReader()
    bufferReader.onload = () => {

      //Depois é extraído do .zip
      jsZip.loadAsync(bufferReader.result).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
          zip.files[filename].async('string').then(function (fileData) {

            //E adicionado a variavel temporaria formando um objeto composto pelo nome do arquivo e seu conteudo em texto

            let cortado = filename.split('.')
            let componentName
            let contentType

            //Condicional para dividir os arquivos entre Svgs, fzb e fzp
            if (cortado[3] == 'svg') {

              componentName = cortado[2].slice(0,-(cortado[1].length))
              componentName = componentName.substring(0,20)
              contentType = cortado[1]

            } else if (cortado[2] == 'fzp') {

              componentName = cortado[1].substring(0,20)
              contentType = 'part'

            } else {

              componentName = 'fzbList'
              contentType = cortado[0]

            }
            
            

            //Condional para testar se ja existe um objeto que condiz ao componente atual
            if (contentType == 'fzb') {

              //Nesse caso ja existe um objeto guardando os fzbs
              let index = dataLet.findIndex(e => e.componentName == 'fzbList')
              dataLet[index][contentType] = fileData

            } else if (dataLet.some(e => e.componentName ==componentName)) {

              //Nesse caso ja existe um objeto guardando o componente atual então apenas adicionamos um novo svg nele

              let index = dataLet.findIndex(e => e.componentName == componentName)
              dataLet[index][contentType] = fileData

            } else {

              //Nesse caso ainda não existe um objeto que corresponda ao componente atual então é criado um 

              //Objeto temporario para guardar as variaveis de nome e o arquivo html convertido em texto
              let tempObj = new Object
              tempObj.componentName = componentName
              tempObj[contentType] = fileData

              dataLet.push(tempObj)
              console.log(data)
            }
            
          })
          .then( () => {

            //Aqui transferimos para a variavel global
            setData(dataLet)
            console.log(data)
           
          })
        })
      })
    }

    bufferReader.readAsArrayBuffer(file)}
    )
  }

  //Função que lida com os arquivos dropados 
  async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    //Arquivos dropados antes de serem lidos
    const droppedFiles = e.dataTransfer.files;

    //Para cada arquivo(i) dropado será realizado essa função onde nela os arquivos serão lidos e salvos na variavel files
    for (let i in droppedFiles) {
      let item = droppedFiles[i];
      if (typeof item === 'object') {

        //Função que extrai e adiciona os arquivos a variavel data
        await unzipFile(item)  
      }
    }
  }

  return (
    <div className="App" >
      <AppContext.Provider value={{data, setData, dragMap, setDragMap}}>
        <SideBarIndex onDrop={handleDrop} />
        <DragAreaIndex />
      </AppContext.Provider>
    </div>
  );
}

export default App;