import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import './DragComponentStyle.css'
import { AppContext } from '../../App'
import { lineFunc } from '../../helpers/linesHelpers'

export default function DragComponentIndex({ name, svg, part, id, updatePositionCallback, position }) {

    const { dragMap, setDragMap, lines, setLines, sectionsMap, setSectionsMap } = React.useContext(AppContext)

    const parser = new DOMParser();
    const connectorsDoc = parser.parseFromString(part, 'text/html')
    const svgComXML = parser.parseFromString(svg, 'text/html')
    const currentSvg = svgComXML.getElementsByTagName('svg')[0]


    //Função que seleciona os elementos no svg responsaveis pelos conectores e adiciona a classe 'connector' a eles
    function createSvgComponent() {
        for (let index = 0; connectorsDoc.getElementsByTagName('connector')[index]; index++) {

            let breadboardView = connectorsDoc.getElementsByTagName('breadboardView')[1]
            let p = breadboardView.querySelectorAll('[layer=breadboard]')[index]
            let connectorSvgId = p.getAttribute('svgId')

            //Elemento que é um conector baseado no part
            const svgConnector = currentSvg.getElementById(connectorSvgId)

            if (!svgConnector) break

            //Classe adicionada no conector
            svgConnector.setAttribute('class', 'connector')
            //Classe adicionada no conector
            svgConnector.setAttribute('id', `${connectorSvgId}/${id}`)

            svgConnector.setAttribute('pointer-events', 'fill')

            currentSvg.appendChild(svgConnector)

        }

        return (currentSvg.innerHTML)
    }

    const [{ x, y, width, height, offset, zIndex }, api] = useSpring(() => ({
        x: position[0],
        y: position[1],
        width: currentSvg.width.baseVal.value ? currentSvg.width.baseVal.value : currentSvg.height.baseVal.value,
        height: currentSvg.height.baseVal.value ? currentSvg.height.baseVal.value : currentSvg.width.baseVal.value,
        offset: position
    }))

    function DragComponent() {

        const bind = useDrag((params) => {
  
            // Função de inicialização do componente
            //! Bug: zindex não funciona
            api.start({
                zIndex: params.down ? 5 : 1,
                x: params.offset[0],
                y: params.offset[1]
            })

            //Função que atualiza a posição do componente
            api.set({
                x: params.offset[0],
                y: params.offset[1]
            })

            // Função para excluir o componente se ele for dropado na SideBar
            if (params.down === false) {
                let droppedOver = document.elementsFromPoint(params.xy[0], params.xy[1])

                let finder = droppedOver.find( element => {
                    return element.className === 'SideBar'
                })
                if (finder) {
                    removeComponent()
                }
                
            }

            // Função para criação de linhas ao realizar um clique longo num conector
            if (params.tap && params.elapsedTime >= 500 && params.event.target.className.baseVal === 'connector') {
                lineFunc(params.event.target, lines, setLines, dragMap, setDragMap, false, sectionsMap, setSectionsMap)
            }

            //Função para atualizar a posição da linha
            updatePositionCallback(params.currentTarget.id)

        },
            //? codigo morto? 
            ({ down, movement: [mx, my] }) => api.start({ x: down ? mx : 0, y: down ? my : 0, scale: down ? 1.2 : 1 })


        )
        return (
            <animated.div {...bind()} style={{ x, y, width, height, zIndex, pointerEvents: 'auto' }} id={`animatedDiv/${id}`} className='animatedSvgDiv' >

                <svg
                    className='dragSvg'
                    dangerouslySetInnerHTML={{ __html: createSvgComponent() }}
                    width={currentSvg.width.baseVal.value}
                    height={currentSvg.height.baseVal.value}
                    viewBox={currentSvg.viewBox}

                />

            </animated.div>)
    }

    function removeComponent() {
        //Aqui remove o componente do DragMap
        let filteredMap = dragMap.filter(item => {
            return item.id !== id
        })

        let removedComponent = dragMap.filter(item => {
            return item.id == id
        })[0]

        let toCleanList = []
        removedComponent.connectors.forEach((c) => {
            if (c.connectedTo) {
                toCleanList.push(c.connectedTo)
            }
        })

        
        // Aqui verificamos se algum dos componentes que não foram removidos estava conectado no componente removido e atualizamos seu campo connectedTo para null
        toCleanList.forEach((l) => {
            console.log(l)
            let splitedL = l.split('/')
            filteredMap.forEach((f) => {
                if (f.id === splitedL[1]) {
                    f.connectors.forEach((c) => {

                        if (!c.connectedTo) return
                        console.log(c)
                        let splitedC = c.connectedTo.split('/')
                        console.log(splitedC[1])
                        console.log(removedComponent.id)
                        if (splitedC[1] === removedComponent.id) {
                            console.log('nulll')
                            c.connectedTo = null
                        }
                    })
                }
            })
        })

        setDragMap(filteredMap)


        // Aqui remove o Leader Line
        let toRemoveLines = lines.filter((i) => {
            return i.startLine.split('/')[1] === id || i.endLine.split('/')[1] === id
        })
        toRemoveLines.forEach(i => {
            i.LeaderLine.remove()
        })


        //E aqui remove a linha do lines
        let filteredLines = lines.filter((i) => {
            return !(i.startLine.split('/')[1] === id || i.endLine.split('/')[1] === id)
        })

        setLines(filteredLines)
    }

    return (
        <div className='svgDiv' id={id} style={{ position: 'fixed', x: 400, y: -300, pointerEvents: 'none' }} onDoubleClick={() => { removeComponent() }}>
            {DragComponent()}
        </div>
    )
}
