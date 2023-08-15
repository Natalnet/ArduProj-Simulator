import { editorCodeCaller } from "../helpers/functionHelpers"

export class DataModelClass {

    componentName
    breadboard
    part
    behavior
    config

    constructor(componentName, behavior, breadboard, part) {
        this.componentName = componentName
        this.behavior = behavior
        this.breadboard = breadboard
        this.part = part
        /*
        let behaviorFunctions = editorCodeCaller(undefined, behavior)
        this.config = behaviorFunctions.configPins
        */
    }

}