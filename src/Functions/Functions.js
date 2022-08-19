import React from 'react'
import JSZip from 'jszip';
import LeaderLine from 'react-leader-line'

//Função responsavel por extrair arquivos do zip e adicionalos no data
export function unzipFile(file, data, setData) {
    return new Promise((resolve, reject) => {
        
    var jsZip = new JSZip

    //Variavel temporaria para onde é passada os arquivos
    //se você apenas referenciar o data, ele não vai mudar a referencia, logo não vai atualizar
    //o estado. O ruim é perdere memória =), para não fazer assim a gente teria que implementar
    //algum outro estado que sinalizasse ou forçasse o update
    let dataLet = [...data]

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

            console.log(cortado)

            //Condicional para dividir os arquivos entre Svgs, fzb e fzp
            if (cortado[3] === 'svg') {

              //componentName = cortado[2].slice(0,-(cortado[1].length))
              //componentName = componentName.substring(0,20)
              componentName = cortado[2]
              contentType = cortado[1]

            } else if (cortado[2] === 'fzp') {

              componentName = cortado[1].substring(0,20)
              contentType = 'part'

            } else {

              componentName = 'fzbList'
              contentType = cortado[0]

            }
            
            console.log(componentName)
            console.log(contentType)
            

            //Condional para testar se ja existe um objeto que condiz ao componente atual
            if (contentType === 'fzb') {

              //Nesse caso ja existe um objeto guardando os fzbs
              let index = dataLet.findIndex(e => e.componentName === 'fzbList')
              dataLet[index][contentType] = fileData

            } else if (dataLet.some(e => e.componentName === componentName)) {

              //Nesse caso ja existe um objeto guardando o componente atual então apenas adicionamos um novo svg nele

              let index = dataLet.findIndex(e => e.componentName === componentName)
              dataLet[index][contentType] = fileData

            } else {

              //Nesse caso ainda não existe um objeto que corresponda ao componente atual então é criado um 

              //Objeto temporario para guardar as variaveis de nome e o arquivo html convertido em texto
              let tempObj = {}
              tempObj.componentName = componentName
              tempObj[contentType] = fileData

              dataLet.push(tempObj)
            }
            
          })
          .then( () => {

            //Aqui transferimos para a variavel global
            setData(dataLet)
           
          })
        })
      })
    }

    bufferReader.readAsArrayBuffer(file)}
    )
  }

//Função que lida com os arquivos dropados 
export async function handleFileDrop(e, data, setData) {
    e.preventDefault();
    e.stopPropagation();

    //Arquivos dropados antes de serem lidos
    const droppedFiles = e.dataTransfer.files;

    //Para cada arquivo(i) dropado será realizado essa função onde nela os arquivos serão lidos e salvos na variavel files
    for (let i in droppedFiles) {
      let item = droppedFiles[i];
      if (typeof item === 'object') {

        //Função que extrai e adiciona os arquivos a variavel data
        await unzipFile(item, data, setData)  
      }
    }
    
  }


  export function lineFunc(target,lines,setLines) {

    let tempLines = lines
    
    if(Object.values(tempLines).some(l => l.id === 'Em aberto')) {
      
      let index = Object.values(tempLines).findIndex(l => {return l.endLine === undefined})
      
      tempLines[index].endLine = target.id
      tempLines[index].id = `line/${tempLines[index]['startLine']}/${tempLines[index]['endLine']}`
      tempLines[index].position = function() {this.position()}
      setLines(tempLines)
      makeLine(lines)
    } else {

      tempLines.push({startLine:`${target.id}`,id:'Em aberto'})
      setLines(tempLines)
      
    }
      
  }

  export function makeLine(lines) {
    if(!lines.some(l => l.id == 'Em aberto') && lines.length > 0) {

      let lastLine = lines[lines.length - 1]

        lines[lines.length - 1].LeaderLine = new LeaderLine(
        LeaderLine.pointAnchor(document.getElementById(lastLine.startLine), {
          x: '50%',
          y: '50%'
        }),
        LeaderLine.pointAnchor(document.getElementById(lastLine.endLine), {
          x: '50%',
          y: '50%'
        }),
        {
          path:'grid',
          startPlug:'disc',
          endPlug:'disc',
          color:'red',
          size:3,
          outline:true,
          outlineColor:'black'
        }
        )
       
    }
  }
