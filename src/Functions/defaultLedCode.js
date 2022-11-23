export default `main(input){
    //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
    var led = document.getElementById('displayedSvg').querySelector('#color_path32')
    
    var inputTemp = false
    
    //Selecione as devidas cores em HEX
    var onColor = '#e60000'
    var offColor = '330000'
    
    console.log(input)
    
    if (inputTemp) {
        led.setAttribute('fill', onColor)
    } else {
        led.setAttribute('fill', offColor)
    }
    
    var output = {
        state: inputTemp
    }
    
    return output
}`