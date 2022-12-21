export default `//configPinsCode
configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        connector0: 'in-out',
        connector1: 'in-out',
        connector2: 'in-out',
        connector3: 'in-out',
        events:{
            mouse:'click',
            keyboard:'keydown'
          }
        // o event listener tem q ser criado a partir da config pins e alterar o input enviado a main 
    })
}

//mainCode
main(input){

    //Selecione as devidas cores em HEX
    var onColor = '#735348'
    var offColor = '#bea197'

    if(input.events){
        
        let mouse = input.events.mouse
        let keyboard = input.events.keyboard

        if (mouse[1] == 'click') {
            let button = mouse[2].target
            if(mouse[2].target.attributes[3].value == '6.132' && mouse[0] == true) {
                button.setAttribute('fill', onColor)
            } else {
                button.setAttribute('fill', offColor)
            }
        } 
    }
    

    //Não sei a relação de connector do botão então não vou mudar o output
    var output = {
        ...input
    }
    
    return output
}`