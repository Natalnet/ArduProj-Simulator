import React, { useContext } from 'react'
import './DropZoneStyle.css'
import { handleFileDrop } from '../../Functions/Functions';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';

export default function DropZoneIndex(props) {

  const drop = React.useRef(null)

  const [dragging, setDragging] = React.useState(false);

  //Hook para definir e excluir os eventListener no componentDidMount e componentAnmount
  React.useEffect(() => {
    drop.current.addEventListener('dragover', handleDragOver);
    drop.current.addEventListener('dragenter', handleDragEnter);
    drop.current.addEventListener('dragleave', handleDragLeave);
    drop.current.addEventListener('drop', handleDrop);

    /* //? É importante? 
      return () => {
      drop.current.removeEventListener('dragover', handleDragOver);
      drop.current.removeEventListener('drop', handleDrop);
      drop.current.removeEventListener('dragenter', handleDragEnter);
      drop.current.removeEventListener('dragleave', handleDragLeave);
    }; */
  }, [drop, handleFileDrop]);

  //Funções para previnir que orquivo seja aberto por outras funções do dispositivo
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  function handleDrop(e) {

    //Função que lida com os arquivos dropados 
    handleFileDrop(e, props.data, props.setData);

    setDragging(false);
  }

  return (
    <div className='DropZone' ref={drop}>
      {dragging ?
        <span className='DragOver'>
          Solte aqui.
        </span> :
        <span>
          <ArchiveRoundedIcon fontSize='large' />
        </span>
      }
    </div>
  )
}