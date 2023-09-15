configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'generic_component',
        pins:{
            connector0pin: 'in',
            connector1pin: 'out'
        }
    })
    
}

main(input){
    //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
    var led = document.getElementById(input.id).querySelector('#color_path32')
    
    //Selecione as devidas cores em HEX
    var onColor = '#e60000'
    var offColor = '#330000'
    if(input.connector0pin !== null){
        if (input.connector0pin.value == 1) {
            led.setAttribute('fill', onColor)
        } 
    } else {
            led.setAttribute('fill', offColor)
        }
    
    console.log('luz')
    
    if(input.connector0pin !== null){
            var output = {
            connector1pin:{value:input.connector0pin.value}
        }
    } else {
        var output = {
        connector1pin:null
    }
    }
    
    
    
    return output
}