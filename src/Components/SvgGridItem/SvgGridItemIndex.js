import React from 'react'
import './SvgGridItemStyle.css'
import {AppContext} from '../../App'
import uuid from 'react-uuid'

export default function SvgGridItemIndex( {svg, name, breadboard, part}) {

    
    const {setDragMap, dragMap} = React.useContext(AppContext)

    function dragMapHandler() {
        let tempMap = [...dragMap]
        let id = uuid()
        tempMap.push({componentName: name, breadboard:breadboard, part:part, id:id})

        setDragMap(tempMap)
    }

    //Não terminado
    const scaleFunc = () => {


        let minor
        if (svg.width.baseVal.value < svg.height.baseVal.value) {
            minor = svg.width.baseVal.value
        } else {
            minor = svg.height.baseVal.value
        }

        if (minor < 50) {
            return ('0 0 100 100')
        } else if (minor < 100) {
            return ("0 0 150 150")
        } else if (minor < 200){
            return ('0 0 250 250')
        } else if (minor < 300){
            return ('0 0 350 350')
        } else if (minor < 400){
            return ('0 0 450 450')
        } else {
            return ('0 0 500 500')
        }
    }
    
    console.log(svg.width.baseVal.value)

  return (
    <div className='ItemDiv' onClick={() => {dragMapHandler()}}>
        <div 
            className='SvgDiv'
            width={svg.width.baseVal.value}
            height={svg.height.baseVal.value}
            >
            <svg 
                className='Svg' 
                //viewBox={scaleFunc()}
                width={svg.width.baseVal.value}
                height={svg.height.baseVal.value}
                dangerouslySetInnerHTML={{__html: svg.innerHTML}}
            />
        </div>
    </div>
  )
}
