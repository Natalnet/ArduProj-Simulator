/* eslint no-restricted-globals: 0 */
//arduino.worker.js

import { pinchAction } from "@use-gesture/react";

/*
TODO: integrar com a solução que encapsula o run environment em uma função
      permite reunitilizar esse worker sem precisar chamar importScripts novamente
*/
export default () => {

    var finishedSetup = false;
    var actPinValues = '';
    var receivedPinValues = [];

    /*por algum motivo, quando usamos uma função para guardar o ambiente de execução
      o destino do arquivo wasm é perdido (antes apontava pra o backend, passa a apontar para o front)
      acho que daria para pensar em algum workaround usando o env*/
    let customWasModule = {}    

    self.notifyUpdate = () => {
        let actPinValues_ = customWasModule.getArduinoState(0);
        if(actPinValues !== actPinValues_){
            console.log('Pin values changed \n from \n ' + actPinValues + '\n to \n' + customWasModule.getArduinoState(0));
            actPinValues = actPinValues_;
            postMessage({type: 'stateUpdate', pinValues: actPinValues});
        }
    }

    self.getPinValues = () => {
        let receivedPinValuesStr = JSON.stringify(receivedPinValues);
        return receivedPinValuesStr;
    }

    self.digitalRead = (index, pin) => {
        return receivedPinValues[pin];
    }

    self.notifyFinished = () => {
        console.log('Arduino loop finished');
        postMessage({type: 'log_finished', msg: "Initialization finished"});
    }

    customWasModule.onRuntimeInitialized = () => {
        finishedSetup = true;
        console.log("init finished");
        actPinValues = customWasModule.getArduinoState(0);
        postMessage({type: 'log', msg: "Initialization finished"});
    }
    
    self.onmessage = (message) => {
        console.log(message.data);
        //console.log(Module);
        if(message.data.start){
            console.log("running start")
            importScripts('http://localhost:3000/exec.js'); // eslint-disable-line no-undef
            customWasModule.instantiateWasm = (imports, successCallback) => {
                let wasmBinary = new Uint8Array(message.data.start.data.slice(0));
                //console.log(`wasmbinary object`)
                WebAssembly.instantiate(wasmBinary, imports).then(
                    (webAssemblyInstance) => {
                        successCallback(webAssemblyInstance.instance, webAssemblyInstance.module)
                    }
                )
            }
            createArduinoEnv(customWasModule); // eslint-disable-line no-undef
        }
        else if(customWasModule.getArduinoState){
            if(finishedSetup){
                if(message.data.stop){
                    console.log('trying to stop arduino loop and the worker');
                    customWasModule.stopLoop();
                }
                else if(message.data.updatePins){
                    console.log(`updating pin values ${message.data.updatePins}`);
                    receivedPinValues = message.data.updatePins;
                }
                else{
                    console.log('trying to get info from arduino ' + customWasModule.getArduinoState(0));
                    postMessage(customWasModule.getArduinoState(0));
                }
            }
            else{
                console.log('Response only available after runtime load ');
                postMessage('Error');
            }
        }
        else{
            console.log('Response only available after runtime load ' + customWasModule);
        }
    };

    
};
/* eslint no-restricted-globals: 1 */