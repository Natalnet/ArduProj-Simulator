import { editorCodeCaller } from "../helpers/functionHelpers"
import { DataModelClass } from "./DataModelClass"

export class ComponentModelClass extends DataModelClass {

    connectors
    id
    position

    constructor(name, behavior, breadboard, part, connectors, id, position) {
        super(name, behavior, breadboard, part)
        this.connectors = connectors
        this.id = id
        this.position = position

    }

    doBehavior(input){
        
    let behaviorFunctions = editorCodeCaller(input, this.behavior)
    let mainFunc = new Function("input", behaviorFunctions.main)

    let output = mainFunc(input)

    return output
    }

}