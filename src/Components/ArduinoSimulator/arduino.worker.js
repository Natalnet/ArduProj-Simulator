//arduino.worker.js
/* eslint-disable */

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
    self.Module = {}    
    self.Module['onRuntimeInitialized'] = () => {
        finishedSetup = true;
        console.log("init finished");
        actPinValues = Module.getArduinoState(0);
        //postMessage({type: 'log', msg: "Initialization finished"});
    }

    self.notifyUpdate = () => {
        console.log('Pin values changed \n from \n ' + actPinValues + '\n to \n' + Module.getArduinoState(0));
        actPinValues = Module.getArduinoState(0);
        postMessage({type: 'stateUpdate', pinValues: actPinValues});
    }

    
    self.onmessage = (message) => {
        console.log(message.data);
        console.log(Module);
        if(message.data.start){
            console.log("running start")
            importScripts(message.data.start);
        }
        else if(Module.getArduinoState){
            if(finishedSetup){
                console.log('trying to get info from arduino ' + Module.getArduinoState(0));
                postMessage(Module.getArduinoState(0));
            }
            else{
                console.log('Response only available after runtime load ');
                postMessage('Error');
            }
        }
        else{
            console.log('Response only available after runtime load ' + Module);
        }
    };


    
    
    
};
/* eslint-enable */