export class DataModelClass {

    componentName
    breadboard
    part
    behavior

    constructor(componentName, behavior, breadboard, part) {
        this.componentName = componentName
        this.behavior = behavior
        this.breadboard = breadboard
        this.part = part
    }

}