import React from 'react'
import JSZip from 'jszip'
import LeaderLine from 'react-leader-line'
import { getSpeedDialIconUtilityClass } from '@mui/material'

//Função responsavel por extrair arquivos do zip e adicionalos no data
export function unzipFile(file, data, setData) {
    return new Promise((resolve, reject) => {
    
        
    var jsZip = new JSZip

    //Variavel temporaria para onde é passada os arquivos
    //se você apenas referenciar o data, ele não vai mudar a referencia, logo não vai atualizar
    //o estado. O ruim é perdere memória =), para não fazer assim a gente teria que implementar
    //algum outro estado que sinalizasse ou forçasse o update

    //console.log(data)
    let dataLet = [...data]
    //console.log(dataLet)

    //Aqui o arquivo é lido como um buffer
    const bufferReader = new FileReader()
   
    bufferReader.onload = () => {
  
      //Depois é extraído do .zip
      jsZip.loadAsync(bufferReader.result).then(function (zip) {
        
        Object.keys(zip.files).forEach(function (filename) {
        
          zip.files[filename].async('string').then(function (fileData) {

            /* 
            ! O formato do nome do arquivo deverá ser tipoDeComponente.nome.formatoDoArquivo
            ! Ex: breadboard.arduinoUnoV3.svg
            ! Os arquvios fzb serão excessão devendo ser da seguinte forma:
            ! nome.fzb
            */

            //E adicionado a variavel temporaria formando um objeto composto pelo nome do arquivo e seu conteudo em texto

            let cortado = filename.split('.')
            
            let componentName
            let contentType

            //Condicional para dividir os arquivos entre Svgs, fzb e fzp
            if (!cortado[1]){

                //A primeira leitura será sempre um arquivo vazio com o nome da pasta
                return 0

            } else if (cortado[2] === 'svg' || cortado[2] === 'fzp') {

              //componentName = cortado[2].slice(0,-(cortado[1].length))
              //componentName = componentName.substring(0,20)
              componentName = cortado[1].substring(0,20)

              var directoryName = cortado[0].split('/')

              //? O filename pode possuir ou não o nome da pasta onde ele esta inserido por isso esse teste. Não sei ao certo o que define isso.
              if(directoryName[1]){
                contentType = directoryName[1]
              } else {
                contentType = directoryName[0]
              }

            } else {

              componentName = `${cortado[0]}_fzbList`
              contentType = cortado[1]

            }
            

            //Condional para testar se ja existe um objeto que condiz ao componente atual
            if (contentType === 'fzb') {

              /* Nesse caso ja existe um objeto guardando os fzbs
              let index = dataLet.findIndex(e => e.componentName === `${cortado[0]}_fzbList`)
              dataLet[index][contentType] = fileData
              */

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
            
            setData([...dataLet])
           
            
          })
        })
      })
    }

    bufferReader.readAsArrayBuffer(file)}
    )
  }

//Função que lida com os arquivos dropados 
export async function handleFileDrop(e, data, setData) {
  
    e.preventDefault()
    e.stopPropagation()

    //Arquivos dropados antes de serem lidos
    const droppedFiles = e.dataTransfer.files

    //Para cada arquivo(i) dropado será realizado essa função onde nela os arquivos serão lidos e salvos na variavel files
    for (let i in droppedFiles) {
      let item = droppedFiles[i]
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


  export function createConnectors (partComponent, breadboard, id) {

    const parser = new DOMParser();
    const partComponentText = parser.parseFromString(partComponent, 'text/html')
    const svgComXML = parser.parseFromString(breadboard, 'text/html')
    const svgPuro = svgComXML.getElementsByTagName('svg')[0]
    var connectorList = []

    for (let index = 0; partComponentText.getElementsByTagName('connector')[index]; index++) {

      let connector = partComponentText.getElementsByTagName('connector')[index]
      
      let breadboardView = partComponentText.getElementsByTagName('breadboardView')[1]
      let p = breadboardView.querySelectorAll('[layer=breadboard]')[index]
      let connectorSvgId = p.getAttribute('svgId')

      //Elemento que é um conector baseado no part
      const svgConnector = svgPuro.getElementById(connectorSvgId)

      //Classe adicionada no conector
      svgConnector.setAttribute('class','connector')
      //Classe adicionada no conector
      svgConnector.setAttribute('id',`${connectorSvgId}/${id}`)

      svgConnector.setAttribute('pointer-events','fill')

      svgConnector.parentElement.appendChild(svgConnector)



      connectorList.push({
        id:connector.getAttribute('id'),
        svgId:p.getAttribute('svgId'),
        type:connector.getAttribute('type'),
        name:connector.getAttribute('name'),
        value: false
      })
      
      //? Arrumar bug dos highlight - Em progresso
      /* 
      svgConnector.removeAttribute('style')

      svgConnector.setAttribute('fill','none') 

      svgConnector.parentElement.insertBefore(svgConnector, null)
      */
    }
    //console.log(svgPuro)

    return({
      svg:svgPuro,
      connectorList:connectorList})
  }
