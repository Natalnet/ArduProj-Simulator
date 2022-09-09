import React from 'react'
import './SideBarStyle.css'
import DropZone from '../DropZone/DropZone';
import SvgGrid from '../SvgGrid/SvgGrid';
import { AppContext } from '../../App'
import { changeColor } from '../../Functions/Behavior';
import RouterButton from '../RouterButton/RouterButton';

export default function SideBar() {

    //Arquivos importados
    const [data, setData] = React.useState([])

    const { setDragMap, dragMap, alignment } = React.useContext(AppContext)

    const [entrada, setEntrada] = React.useState(0)

    function testButton() {
        console.log(entrada)
        changeColor(entrada, dragMap[0].id)
        if (entrada === 0) {
            setEntrada(1)
        } else { setEntrada(0) }
    }

    //Função que testa se a pagina esta no simulador ou editor e adiciona o dropzone baseado nisso
    const hasDropZone = (alignment) => {
        if (alignment == 'simulador') {
            return <DropZone data={data} setData={setData} />
        } else {
            return
        }
    }


    return (
        <div className="SideBar" >
            <RouterButton />
            {hasDropZone(alignment)}
            <SvgGrid data={data} />
            <button className='BtnTeste' onClick={() => { testButton() }}>Teste de LED</button>
        </div>
    )
}
