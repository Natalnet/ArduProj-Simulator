export function addConnectortToMatrix(componentId, connectorList, connectorMtx, connectorMtxMap) {


    let tempConnectorMtx = connectorMtx
    let tempConnectorMtxMap = connectorMtxMap


    //! trocar o array por um objeto
    //! trocar true ou false por 1 e 0

    // Aqui é criada a matriz de conectividade
    // Os valores iniciais são sempre falsos 
    // No caso dela ser nula é passado uma matriz com colunas e linhas do tamanho do primeiro componente adicionado
    if (connectorMtx.length === 0) {
        let row = Array(connectorList.length).fill(0)
        tempConnectorMtx = Array(connectorList.length).fill(row)
    } else {
        // Caso ela não seja nula é copiado a parte ja preenchida da matriz e adicionado a suas linhas valores falsos representando os novos connectors

        for (let index = 0; index < connectorMtx.length; index++) {

            let inicialArray = tempConnectorMtx[index]
            let finalArray = Array(connectorList.length).fill(0)
            tempConnectorMtx[index] = [...inicialArray, ...finalArray]

        }

        // E depois é adicionado as colunas desses novos connectors a matriz

        let maxLength = (connectorMtx.length + connectorList.length)
        for (let index = connectorMtx.length; index < maxLength; index++ ) {
            let row = Array(maxLength).fill(0)
            tempConnectorMtx[index] = row
        }
    }

    // Por fim é feito o array do map adicionando os connectors novos a um array ja existente
    connectorList.forEach(connector => {
        tempConnectorMtxMap.push(`${connector.svgId}/${componentId}`)
    })


    return ({ matrix: tempConnectorMtx, maping: tempConnectorMtxMap })

}