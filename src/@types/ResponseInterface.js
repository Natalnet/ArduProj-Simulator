export class ResponseInterce {
    type;
    value;
    frequency;
    dutycycle;

    constructor(type, value, frequency = null, dutycycle = null) {
        this.type = type;
        this.value = value;
        this.frequency = frequency;
        this.dutycycle = dutycycle;
    }
    /**
        type:digital || analogico || pwm
        value: (high and low)(1 e 0)(int) || float || float
        frequency: float // pwm only
        dutycycle: float // pwm only
     */
}
