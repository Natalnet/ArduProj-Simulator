export function addConnectortToMatrix(componentId, connectorList, connectorMtx, connectorMtxMap) {


    let tempConnectorMtx = connectorMtx
    let tempConnectorMtxMap = connectorMtxMap


    // Aqui é criada a matriz de conectividade
    // Os valores iniciais são sempre falsos 
    //? Confirmar se é melhor falso ou null
    // No caso dela ser nula é passado uma matriz com colunas e linhas do tamanho do primeiro componente adicionado
    if (connectorMtx.length === 0) {
        let row = Array(connectorList.length).fill(false)
        tempConnectorMtx = Array(connectorList.length).fill(row)
    } else {
        // Caso ela não seja nula é copiado a 
        console.log('entrou')
        for (let index = 0; index < connectorMtx.length; index++) {
            connectorList.forEach(element => {
                tempConnectorMtx[index].push(false)
            });
        }
        console.log('check 1')
        console.log(connectorMtx.length)
        console.log(connectorList.length)
        for (let index = connectorMtx.length; index < (connectorMtx.length + connectorList.length); index++) {
            let row = Array(connectorMtx.length + connectorList.length).fill(false)
            //! ERRO AQUI GERANDO LOOP INFINITO
            tempConnectorMtx[index] = row
            //!
            console.log(index)
        }
        console.log('check 2')
    }



    connectorList.forEach(connector => {
        tempConnectorMtxMap.push(`${connector.svgId}/${componentId}`)
    })

    console.log(tempConnectorMtx)

    return ({ matrix: tempConnectorMtx, maping: tempConnectorMtxMap })

}