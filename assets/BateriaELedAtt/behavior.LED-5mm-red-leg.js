configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'generic_component',
        connector0pin: 'in',
        connector1pin: 'out'
    })
    
}

main(input){
    //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
    var led = document.getElementById(input.id).querySelector('#color_path32')
    
    //Selecione as devidas cores em HEX
    var onColor = '#e60000'
    var offColor = '#330000'
    
    if (input.value == 1) {
        led.setAttribute('fill', onColor)
    } else {
        led.setAttribute('fill', offColor)
    }
    
    console.log('luz')
    
    var output = {
        connector0pin:{value:0},
        connector1pin:{value:1}
    }
    
    return output
}