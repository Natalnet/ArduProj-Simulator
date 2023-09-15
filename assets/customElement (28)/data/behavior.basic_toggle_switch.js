configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type: 'generic_component',
        pins:{
            connector0pin: 'in',
            connector1pin: 'in',
            connector2pin: 'out'
        }
    })
    
}

main(input){
    
    var output = {connector2pin: null}
    
    console.log('ANDcomponent')
   
    if(input.connector0pin !== null && input.connector1pin !== null){
        if (input.connector0pin.value == 1 && input.connector1pin.value == 1) {
            output.connector2pin = {value:1}
        } 
    } 
    
    return output
}