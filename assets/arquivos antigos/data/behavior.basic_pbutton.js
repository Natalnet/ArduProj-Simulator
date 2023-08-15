configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'interactive_component',
        events:[
            'mouseup',
            'mousedown'
          ],
        connector0pin: 'in-out',
        connector1pin: 'in-out',
        connector2pin: 'in-out',
        connector3pin: 'in-out'
    })
}

main(input){

    console.log('button')
    
    //Selecione as devidas cores em HEX
    var onColor = '#735348'
    var offColor = '#bea197'
    
    let events = input.events
    
    var output = {}
    output.connector0pin = {value:0}
    output.connector1pin = {value:0}
    output.connector2pin = {value:0}
    output.connector3pin = {value:0}
    
    if(!input.connector0pin){
        input.connector0pin = {}
        input.connector0pin.value = 0
    }
    if(!input.connector1pin){
        input.connector1pin = {}
        input.connector1pin.value = 0
    }
    if(!input.connector2pin){
        input.connector2pin = {}
        input.connector2pin.value = 0
    }
    if(!input.connector3pin){
        input.connector3pin = {}
        input.connector3pin.value = 0
    }
    
    if(events) {
        
        if(input.connector0pin.value > input.connector2pin.value) {
            output.connector2pin = {}
            output.connector2pin.value = input.connector0pin.value
            output.connector0pin.value = 0
        } else {
            output.connector0pin.value = input.connector2pin.value
            output.connector2pin.value = 0
        }
        if(input.connector1pin.value > input.connector3pin.value) {
            output.connector3pin.value = input.connector1pin.value
            output.connector1pin.value = 0
        } else {
            output.connector1pin.value = input.connector3pin.value
            output.connector3pin.value = 0
        }
    } else {
        if(input.connector0pin.value > input.connector1pin.value) {
            output.connector1pin.value = input.connector0pin.value
            output.connector0pin.value = 0
        } else {
            output.connector0pin.value = input.connector1pin.value
            output.connector1pin.value = 0
        }
        if(input.connector2pin.value > input.connector3pin.value) {
            output.connector3pin.value = input.connector2pin.value
            output.connector2pin.value = 0
        } else {
            output.connector2pin.value = input.connector3pin.value
            output.connector3pin.value = 0
        }
    }
    
    return output
}