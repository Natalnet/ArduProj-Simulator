configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'interactive_component',
        events:[
            'mouseup',
            'mousedown'
          ],
        pins:{
        connector0pin: 'in-out',
        connector1pin: 'in-out',
        connector2pin: 'in-out',
        connector3pin: 'in-out'
        }
    })
}

main(input){

    console.log('button')
    
    //Selecione as devidas cores em HEX
    var onColor = '#735348'
    var offColor = '#bea197'
    
    if(!input.connector0pin){
        input.connector0pin = {value:0}
    }
    if(!input.connector1pin){
        input.connector1pin = {value:0}
    }
    if(!input.connector2pin){
        input.connector2pin = {value:0}
    }
    if(!input.connector3pin){
        input.connector3pin = {value:0}
    }
    
    var output = {
        connector0pin:{value:null},
        connector1pin:{value:null},
        connector2pin:{value:null},
        connector3pin:{value:null}
    }
    console.log('button2')
    
    if(input.events) {
        console.log('button3 events true')
        if(input.connector0pin.value + input.connector2pin.value !== 0){
            if(input.connector0pin.value > input.connector2pin.value) {
                output.connector2pin.value = input.connector0pin.value
            } else {
                output.connector0pin.value = input.connector2pin.value
            }
        }
        if(input.connector1pin.value + input.connector3pin.value !== 0){
            if(input.connector1pin.value > input.connector3pin.value) {
                output.connector3pin.value = input.connector1pin.value
            } else {
                output.connector1pin.value = input.connector3pin.value
            }
    }
    } else {
        console.log('button3')
        if(input.connector0pin.value + input.connector1pin.value !== 0){
            if(input.connector0pin.value > input.connector1pin.value) {
                output.connector1pin.value = input.connector0pin.value
            } else {
                output.connector0pin.value = input.connector1pin.value
            }
        }
        if(input.connector2pin.value + input.connector3pin.value !== 0){
            if(input.connector2pin.value > input.connector3pin.value) {
                output.connector3pin.value = input.connector2pin.value
            } else {
                output.connector2pin.value = input.connector3pin.value
            }
        }
    }
    
    Object.keys(output).forEach(connector => {
        console.log(output[connector])
            if(output[connector].value === null){
                output[connector] = null
            }
        })
    
    console.log('button4')
    
    return output
}