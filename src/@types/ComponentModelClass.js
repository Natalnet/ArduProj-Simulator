export class ComponentModelClass {

    name
    svg
    breadboard
    part
    connectorArray
    behavior

    constructor(name, svg, breadboard, part) {
        this.name = name
        this.svg = svg
        this.breadboard = breadboard
        this.part = part
    }

    createConnectors(partComponent, breadboard, id) {

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
    
            if (!svgConnector) {
                break
            }
    
            //Classe adicionada no conector
            svgConnector.setAttribute('class', 'connector')
            //Classe adicionada no conector
            svgConnector.setAttribute('id', `${connectorSvgId}/${id}`)
    
            svgConnector.setAttribute('pointer-events', 'fill')
    
            svgConnector.parentElement.appendChild(svgConnector)
    
    
    
            connectorList.push({
                id: connector.getAttribute('id'),
                svgId: p.getAttribute('svgId'),
                type: connector.getAttribute('type'),
                name: connector.getAttribute('name'),
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
    
        return ({
            svg: svgPuro,
            connectorList: connectorList
        })
    }

}