configPins(){
    //Configure as estradas e saidas do componente aqui.
    return({
        type:'power_source',
        connector0pin: 'in',
        connector1pin: 'out'
    })
    
}

main(input){
    
    var output = {
        connector0pin:{value:0},
        connector1pin:{value:1}
    }
    
    console.log('bateria')
    
    return output
}