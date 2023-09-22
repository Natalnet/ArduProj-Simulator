import { editorCodeCaller } from "../helpers/functionHelpers";
import { DataModelClass } from "./DataModelClass";

export class ComponentModelClass extends DataModelClass {
    connectors;
    id;
    position;
    config;

    constructor(name, behavior, breadboard, part, connectors, id, position) {
        super(name, behavior, breadboard, part);
        this.connectors = connectors;
        this.id = id;
        this.position = position;

        let behaviorFunctions = editorCodeCaller(undefined, behavior);
        this.config = behaviorFunctions.configPins;
    }

    doBehavior(input) {
        console.log(input);

        let output = {};

        if (this.config.type === "microcontroller") {
            //? Como que o runCode lida com os inputs

            let microcontrollerOutput = []; //? Colocaria o instance.getPinStates() aqui

            //! Esse codigo fica baseado na ordem, seria melhor se o runCode retornasse valores mais bem definidos
            Object.keys(this.config.pins).forEach((pin, index) => {
                if (microcontrollerOutput[index]) {
                    output[pin] = { value: null, type: "digital" }; //? todos os microcontroladores retornam um valor digital?
                    output[pin].value = microcontrollerOutput[index];
                }
            });
        } else {
            let behaviorFunctions = editorCodeCaller(input, this.behavior);

            let mainFunc = new Function("input", behaviorFunctions.main);

            output = mainFunc(input);
        }

        console.log(this.config);

        console.log(output);

        return output;
    }

    resetSvg() {
        document.getElementById(this.id).innerHTML = "";
    }
}
