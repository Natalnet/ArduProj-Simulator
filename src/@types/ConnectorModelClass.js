export class ConnectorModelClass {

    id
    name
    svgId
    type
    value
    connectedTo
    connectorConfig
    fullId

    constructor(id, name, svgId, type, value, connectedTo, connectorConfig, fullId) {
        this.id = id
        this.name = name
        this.svgId = svgId
        this.type = type
        this.value = value
        this.connectedTo = connectedTo
        this.connectorConfig = connectorConfig
        this.fullId = fullId
    }

}