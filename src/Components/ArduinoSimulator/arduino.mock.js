/* eslint no-restricted-globals: 0 */
//arduino.worker.js
/*
TODO: integrar com a solução que encapsula o run environment em uma função
      permite reunitilizar esse worker sem precisar chamar importScripts novamente
*/
export default () => {
    var finishedSetup = false;
    var actPinValues = '';
    var shouldStop = false;


    function simulate(){
        console.log("simulating");
        postMessage({type: 'stateUpdate', pinValues: '[1,1,1,0,0]'});
        if (!shouldStop)
            setTimeout(simulate, 1000);
    }
    

    
    self.onmessage = (message) => {
        console.log(message.data);
        //console.log(Module);
        if(message.data.start){
            console.log("running start");
            setTimeout(simulate, 1000);
            finishedSetup = true;
        }
        else if(finishedSetup){
            if(message.data.stop){
                console.log('trying to stop arduino loop and the worker');
                shouldStop = true;
            }
        }
        else{
            console.log('Response only available after runtime load ');
            postMessage('Error');
        }
    };

    
};
/* eslint no-restricted-globals: 1 */