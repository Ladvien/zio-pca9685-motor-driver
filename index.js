var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
 
/*
Zio PCA Motor Controller
    C. Thomas Brittain (c), MIT

    STANDBY is active HIGH.
*/

// Zio PCA9685 pins
const PWMA1 = 0;
const A1IN1 = 1;
const A1IN2 = 2;
const STBY1 = 3;
const B1IN1 = 4;
const B1IN2 = 5;
const PWMB1 = 6;
const PWMA2 = 7;
const A2IN1 = 8;
const A2IN2 = 9;
const STBY2 = 10;
const B2IN1 = 11;
const B2IN2 = 12;
const PWMB2 = 13;
const IO14  = 14;
const IO15  = 15;

// Utilities
const HIGH = 1;
const LOW = 0;
const MAX_SPEED = 255;
const MIN_SPEED = 0;
const DRIVER_STANDBY = LOW;
const DRIVER_ACTIVE = HIGH;

// Objects repsenting individual motors
const MOTORA1 = {leadOne: A1IN1, leadTwo: A1IN2, pwmPin: PWMA1, standby: STBY1, reverseLeads: false};
const MOTORB1 = {leadOne: B1IN1, leadTwo: B1IN2, pwmPin: PWMB1, standby: STBY1, reverseLeads: false};
const MOTORA2 = {leadOne: A2IN1, leadTwo: A2IN2, pwmPin: PWMA2, standby: STBY2, reverseLeads: false};
const MOTORB2 = {leadOne: B2IN1, leadTwo: B2IN2, pwmPin: PWMB2, standby: STBY2, reverseLeads: false};

const ALL_MOTORS = {MOTORA1: MOTORA1, MOTORB1: MOTORB1, MOTORA2: MOTORA2, MOTORB2: MOTORB2}

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

setMotor = function(motor, direction, speed) {
    
    var leadOne = LOW;
    var leadTwo = HIGH;
    var driverState = DRIVER_STANDBY;
    console.log(motor.reverseLeads);
    switch (direction) {
        case 'forward':
            if (!motor.reverseLeads) {
                leadOneState = HIGH;
                leadTwoState = LOW;
            } else {
                leadOneState = LOW;
                leadTwoState = HIGH;
            }
            driverState = DRIVER_ACTIVE;
            break;
        case 'reverse':
            if (!motor.reverseLeads) {
                leadOneState = LOW;
                leadTwoState = HIGH;
            } else {
                leadOneState = HIGH;
                leadTwoState = LOW;
            }
            driverState = DRIVER_ACTIVE;
            break;
        case 'brake':
            break;
        default:
            console.log('No direction was provided. *Rimshot*');
    }

    // Convert 0-255 to percentage.
    let = speed /= MAX_SPEED;

    updateMotor(motor, speed, leadOneState, leadTwoState, driverState);
}

setMotors = function(motors, direction, speed) {
    for (motor in motors) {
        setMotor(motors[motor], direction, speed);
    }
}


allStop = function() {
    for (motor in ALL_MOTORS) {
        updateMotor(ALL_MOTORS[motor], MIN_SPEED, LOW, LOW, DRIVER_STANDBY);
    }
}

// motorsA('forward', 120);
updateMotor = function(motor, speed, leadOneState, leadTwoState, driverState) {
    pwm = new Pca9685Driver(options, function(err) {
        if (err) { return err; }
        pwm.setDutyCycle(motor.standby, driverState)
        pwm.setDutyCycle(motor.pwmPin, speed);
        pwm.setDutyCycle(motor.leadOne, leadOneState);
        pwm.setDutyCycle(motor.leadTwo, leadTwoState)
    });
}
allStop();
MOTORA1.reverseLeads = true;
console.log(MOTORA1);
motorSetOne = {MOTORA1: MOTORA1, MOTORA2: MOTORA2};
setMotors(motorSetOne, 'reverse', 255);