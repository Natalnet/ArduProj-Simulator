import React from 'react'
import { AppContext } from '../../App'

export default function MatrizDisplay() {

    const { connectivityMtxMap, connectivityMtx, eletronicMtx, setEletronicMtx, running, setRunning } = React.useContext(AppContext)
    
  return (
    <>
        {eletronicMtx ? 
        <div
        style={{
            padding: '10px',
            position: 'fixed',
            bottom: '0',
            right: '0',
            width: '20%',
            height: '40%',
            backgroundColor: 'hsla(233, 33%, 10%, 0.7)',
            borderRadius: '10% 0 0 0',
            display: 'grid',
            gridTemplateColumns: `repeat(${Object.keys(eletronicMtx).length+1}, 1fr)`,
            gridTemplateRows: `repeat(${Object.keys(eletronicMtx).length+1}, 1fr)`,
        }}
        >
            {Object.keys(eletronicMtx).map((connector, index) => {
                return (
                <div
                    style={{
                        overflow: 'hidden',
                        gridRow: index+2,
                        gridColumn: 1,
                        border: '2px solid hsla(233, 33%, 30%, 0.7)'
                    }}
                >
                    {connector}
                </div>
                )
            })}
            {Object.keys(eletronicMtx).map((connector, index) => {
                return (
                <div
                    style={{
                        overflow: 'hidden',
                        gridRow: 1,
                        gridColumn: index+2,
                        border: '2px solid hsla(233, 33%, 30%, 0.7)'
                    }}
                >
                    {connector}
                </div>
                )
            })}
            {Object.keys(eletronicMtx).map((outerConnector, outerIndex) => {
                return (
                Object.keys(eletronicMtx).map((innerConnector, innerIndex) => {
                    return (
                        <div
                        style={{
                            overflow: 'hidden',
                            gridRow: innerIndex+2,
                            gridColumn: outerIndex+2,
                            border: '2px solid hsla(233, 33%, 50%, 0.7)'
                        }}
                        >
                           {`${eletronicMtx[outerConnector][innerConnector]}`}
                        </div>
                    )
                })
                )
            })}
        </div>
        : 
        null
        }
        
    </>
  )
}
