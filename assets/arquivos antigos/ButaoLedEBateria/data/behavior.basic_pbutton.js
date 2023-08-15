configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'interactive_component',
        events:[
            'click',
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
    
    let mouse = input.events.mouse
    
    var output = {}
    
    if(mouse[1] == 'click') {
        let button = mouse[2].target
            if(mouse[2].target.attributes[3].value == '6.132' && mouse[0] == true) {
                button.setAttribute('fill', onColor)
            } else {
                button.setAttribute('fill', offColor)
            }
        
        if(input.connector0pin.value > input.connector2pin.value) {
            output.connector2pin.value = input.connector0pin.value
        } else {
            output.connector0pin.value = input.connector2pin.value
        }
        if(input.connector1pin.value > input.connector3pin.value) {
            output.connector3pin.value = input.connector1pin.value
        } else {
            output.connector1pin.value = input.connector3pin.value
        }
    } else {
        if(input.connector0pin.value > input.connector1pin.value) {
            output.connector1pin.value = input.connector0pin.value
        } else {
            output.connector0pin.value = input.connector1pin.value
        }
        if(input.connector2pin.value > input.connector3pin.value) {
            output.connector3pin.value = input.connector2pin.value
        } else {
            output.connector2pin.value = input.connector3pin.value
        }
    }
    
    return output
}