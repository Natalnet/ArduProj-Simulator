/* eslint no-restricted-globals: 0 */
//arduino.worker.js
/*
TODO: integrar com a solução que encapsula o run environment em uma função
      permite reunitilizar esse worker sem precisar chamar importScripts novamente
*/
export default () => {

    var finishedSetup = false;
    var actPinValues = '';

    /*por algum motivo, quando usamos uma função para guardar o ambiente de execução
      o destino do arquivo wasm é perdido (antes apontava pra o backend, passa a apontar para o front)
      acho que daria para pensar em algum workaround usando o env*/
    let customWasModule = {}    
    
    customWasModule.onRuntimeInitialized = () => {
        finishedSetup = true;
        console.log("init finished");
        actPinValues = customWasModule.getArduinoState(0);
        //postMessage({type: 'log', msg: "Initialization finished"});
    }

    self.notifyUpdate = () => {
        console.log('Pin values changed \n from \n ' + actPinValues + '\n to \n' + customWasModule.getArduinoState(0));
        actPinValues = customWasModule.getArduinoState(0);
        postMessage({type: 'stateUpdate', pinValues: actPinValues});
    }

    self.notifyFinished = () => {
        console.log('Arduino loop finished');
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