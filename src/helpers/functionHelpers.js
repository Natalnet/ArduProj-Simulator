import JSZip from 'jszip'
import { DataModelClass } from '../@types/DataModelClass'
import { ConnectorModelClass } from '../@types/ConnectorModelClass'
//Função responsavel por extrair arquivos do zip e adicionalos no data
export function unzipFile(file, data, setData, dragMap, setDragMap, lines, setLines, connectivityMtx, setConnectivityMtx) {
    return new Promise((resolve, reject) => {


        var jsZip = new JSZip

        //Variavel temporaria para onde é passada os arquivos
        //se você apenas referenciar o data, ele não vai mudar a referencia, logo não vai atualizar
        //o estado. O ruim é perdere memória =), para não fazer assim a gente teria que implementar
        //algum outro estado que sinalizasse ou forçasse o update

        
        let tempData = [...data]
        let tempDragMap = []
        let tempLines = []
        let tempConnectivityMtx = []

        //Aqui o arquivo é lido como um buffer
        const bufferReader = new FileReader()

        bufferReader.onload = () => {

            //Depois é extraído do .zip
            jsZip.loadAsync(bufferReader.result).then(function (zip) {

                Object.keys(zip.files).forEach(function (filename) {

                    zip.files[filename].async('string').then(function (fileData) {
                        
                        if(filename.split('/')[0] === 'data') {
                            
                            
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
                            if (!cortado[1]) {

                                //A primeira leitura será sempre um arquivo vazio com o nome da pasta
                                return 0

                            } else if (cortado[2] === 'svg' || cortado[2] === 'fzp' || cortado[2] === 'js') {

                                //componentName = cortado[2].slice(0,-(cortado[1].length))
                                //componentName = componentName.substring(0,20)
                                componentName = cortado[1].substring(0, 20)

                                var directoryName = cortado[0].split('/')

                                //? O filename pode possuir ou não o nome da pasta onde ele esta inserido por isso esse teste. Não sei ao certo o que define isso.
                                if (directoryName[1]) {
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
                                let index = tempData.findIndex(e => e.componentName === `${cortado[0]}_fzbList`)
                                tempData[index][contentType] = fileData
                                */

                            } else if (tempData.some(e => e.componentName === componentName)) {

                                //Nesse caso ja existe um objeto guardando o componente atual então apenas adicionamos um novo svg nele
                                
                                let index = tempData.findIndex(e => e.componentName === componentName)
                                tempData[index][contentType] = fileData
                            } else {
                                //Nesse caso ainda não existe um objeto que corresponda ao componente atual então é criado um 
                                //Objeto temporario para guardar as variaveis de nome e o arquivo html convertido em texto
                                let tempObj = new DataModelClass
                                tempObj.componentName = componentName
                                tempObj[contentType] = fileData

                                tempData.push(tempObj)
                            }

                        } else if(filename.split('/')[0] === 'dragMap'){

                            tempDragMap.push(JSON.parse(fileData))
                            
                        } else if(filename.split('/')[0] === 'lines'){

                            tempLines.push(JSON.parse(fileData))

                        } else if(filename.split('/')[0] === 'connectivityMtx'){

                            tempConnectivityMtx.push(JSON.parse(fileData))

                        } 

                       
                    })
                        .then(() => {
                            console.log(tempData)
                            //Aqui transferimos para a variavel global
                            setData([...tempData])
                            setDragMap([...tempDragMap])
                            setLines([...tempLines])
                            setConnectivityMtx(tempConnectivityMtx)

                        })
                })
            })
        }

        bufferReader.readAsArrayBuffer(file)
    }
    )
}

//Função que lida com os arquivos dropados 
export async function handleFileDrop(e, data, setData, dragMap, setDragMap, lines, setLines, connectivityMtx, setConnectivityMtx) {

    e.preventDefault()
    e.stopPropagation()

    //Arquivos dropados antes de serem lidos
    const droppedFiles = e.dataTransfer.files

    //Para cada arquivo(i) dropado será realizado essa função onde nela os arquivos serão lidos e salvos na variavel files
    for (let i in droppedFiles) {
        let item = droppedFiles[i]
        if (typeof item === 'object') {
            //Função que extrai e adiciona os arquivos a variavel data
            await unzipFile(item, data, setData, dragMap, setDragMap, lines, setLines, connectivityMtx, setConnectivityMtx)
        }
    }

}



export function createConnectors(partComponent, breadboard, id, dragComponentName, behavior) {

    const parser = new DOMParser();
    const partComponentText = parser.parseFromString(partComponent, 'text/html')
    const svgComXML = parser.parseFromString(breadboard, 'text/html')
    const svgPuro = svgComXML.getElementsByTagName('svg')[0]
    var connectorList = []

    let behaviorFunctions = editorCodeCaller(undefined, behavior)
    let configOutput = behaviorFunctions.configPins

    for (let index = 0; partComponentText.getElementsByTagName('connector')[index]; index++) {

        let connector = partComponentText.getElementsByTagName('connector')[index]

        let breadboardView = partComponentText.getElementsByTagName('breadboardView')[1]
        let p = breadboardView.querySelectorAll('[layer=breadboard]')[index]
        let connectorSvgId = p.getAttribute('svgId')

        //Elemento que é um conector baseado no part
        const svgConnector = svgPuro.getElementById(connectorSvgId)

        if (!svgConnector) {
            break
        }

        let connectorConfig = configOutput[p.getAttribute('svgId')]

        let connectorClass = new ConnectorModelClass(connector.getAttribute('id'), connector.getAttribute('name'), p.getAttribute('svgId'), connector.getAttribute('type'), null, [], connectorConfig, `${dragComponentName}/${connectorSvgId}/${id}`)

        connectorList.push(connectorClass)
        
    }

    return ({
        svg: svgPuro,
        connectorList: connectorList
    })
}


export function editorCodeCaller(input = undefined, editorCode) {

    let splitedCode = editorCode.split('main(input){')

    let mainCode = splitedCode[1].slice(0,-1)

    let configCode = splitedCode[0].slice(13,-6)

    let configPins = new Function(configCode)

    if (!input) {
        let configHolder = configPins()
        return ({ main: undefined, configPins: configHolder })
    }

    let mainFunc = new Function("input", mainCode)

    let mainCodeF = mainFunc(input)
    let configHolder = configPins()



    return ({ main: mainCode, configPins: configCode })
}

export function updateConnectorsValues(valuesHolder, editorCode) {

    let configHolder = editorCodeCaller(valuesHolder, editorCode).configPins

    Object.keys(configHolder).map((c) => {
        if (c == 'events') {
            /*
            Object.keys(configHolder.events).map((e) => {
                valuesHolder = { ...valuesHolder, events: { ...valuesHolder.events, [e]: [false, configHolder.events[e], undefined] } }
            })
*/
        } else {
            valuesHolder = { ...valuesHolder, [c]: { value: valuesHolder[c].value, type: configHolder[c] } }
        }

    })

    return valuesHolder
}
