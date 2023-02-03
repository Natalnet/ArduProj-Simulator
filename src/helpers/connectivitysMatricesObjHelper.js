export function addConnectortToMatrix(componentId, connectorList, connectorMtx, connectorMtxMap) {


    let tempConnectorMtx = connectorMtx
    let tempConnectorMtxMap = connectorMtxMap

    // Aqui é criada a matriz de conectividade
    // Os valores iniciais são sempre falsos 
    // No caso dela ser nula é passado uma matriz com colunas e linhas do tamanho do primeiro componente adicionado
    if (Object.keys(connectorMtx).length === 0) {
        let row = {}

        connectorList.map(connector => {
            console.log(connector)
            row = { ...row, [`${connector.svgId}/${componentId}`]: 0 }
        })

        connectorList.map(connector => {
            tempConnectorMtx = { ...tempConnectorMtx, [`${connector.svgId}/${componentId}`]: row }
        })
    } else {
        // Caso ela não seja nula é copiado a parte ja preenchida da matriz e adicionado a suas linhas valores falsos representando os novos connectors

        var row = {}

        Object.keys(tempConnectorMtx).map( k => {
            for (let index = 0; index < connectorList.length; index++) {
                tempConnectorMtx[k] = { ...tempConnectorMtx[k], [`${connectorList[index].svgId}/${componentId}`]: 0 }
                row = tempConnectorMtx[k]
            }
        })

        // E depois é adicionado as colunas desses novos connectors a matriz

        for (let index = 0; index < connectorList.length; index++) {
            console.log(row)
            Object.keys(row).forEach(k => row[k] = 0)
            
            tempConnectorMtx = { ...tempConnectorMtx, [`${connectorList[index].svgId}/${componentId}`]: row }
        }
    }

    // Por fim é feito o array do map adicionando os connectors novos a um array ja existente
    connectorList.forEach(connector => {
        tempConnectorMtxMap.push(`${connector.svgId}/${componentId}`)
    })

    console.log(tempConnectorMtx)
    console.log(tempConnectorMtxMap)

    return ({ matrix: tempConnectorMtx, maping: tempConnectorMtxMap })

}