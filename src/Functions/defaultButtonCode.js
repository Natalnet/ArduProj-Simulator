export default `configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        connector0: 'in',
        connector1: 'out',
        connector0: 'out',
        connector1: 'out',
    })
}

main(input){
    //Troque o '#color_path32' pelo Id correspondente do componente que você deseja alterar a cor
    var button = document.getElementById('displayedSvg').querySelector('[fill=#735348]')
    
    //Selecione as devidas cores em HEX
    var onColor = '#16100e'
    var offColor = '#735348'
    
    if (input.connector0.value == 1) {
        button.setAttribute('fill', onColor)
    } else {
        button.setAttribute('fill', offColor)
    }
    
    var output = {
        ...input
    }
    
    return output
}`