export default `configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        connector0: 'in',
        connector1: 'out'
    })
    
}

main(input){
    //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
    var led = document.getElementById('displayedSvg').querySelector('#color_path32')
    
    var inputTemp = false
    
    //Selecione as devidas cores em HEX
    var onColor = '#e60000'
    var offColor = '330000'
    
    if (input.connector0 == 1) {
        led.setAttribute('fill', onColor)
    } else {
        led.setAttribute('fill', offColor)
    }
    
    var output = {
        ...input,
        ['connector1']: {
            value:input.connector0.value,
            type:input.connector1.type
    }}
    
    return output
}`