var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
var ZioMotor = require('./models/zio-motor');


/*
Zio PCA Motor Controller
    C. Thomas Brittain (c), MIT

    standByPin is active HIGH.
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
const MOTORA1 = new ZioMotor.Motor(A1IN1, A1IN2, PWMA1, STBY1, false);
const MOTORB1 = new ZioMotor.Motor(B1IN1, B1IN2, PWMB1, STBY1, false);
const MOTORA2 = new ZioMotor.Motor(A2IN1, A2IN2, PWMA2, STBY2, false);
const MOTORB2 = new ZioMotor.Motor(B2IN1, B2IN2, PWMB2, STBY2, false);

const ALL_MOTORS = {MOTORA1: MOTORA1, MOTORB1: MOTORB1, MOTORA2: MOTORA2, MOTORB2: MOTORB2}

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: false
};

setMotor = function(motor, direction, speed) {
    var driverState = DRIVER_STANDBY;
    switch (direction) {
        case 'forward':
            if (!motor.state.reverseLeads) {
                leadOnePinState = HIGH;
                leadTwoPinState = LOW;
            } else {
                leadOnePinState = LOW;
                leadTwoPinState = HIGH;
            }
            driverState = DRIVER_ACTIVE;
            break;
        case 'reverse':
            if (!motor.state.reverseLeads) {
                leadOnePinState = LOW;
                leadTwoPinState = HIGH;
            } else {
                leadOnePinState = HIGH;
                leadTwoPinState = LOW;
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

    updateMotor(motor, speed, leadOnePinState, leadTwoPinState, driverState);
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

// Writes the new motor state.
updateMotor = function(motor, speed, leadOnePinState, leadTwoPinState, driverState) {
    pwm = new Pca9685Driver(options, function(err) {
        if (err) { return err; }
        pwm.setDutyCycle(motor.standByPin, driverState)
        pwm.setDutyCycle(motor.pwmPin, speed);
        pwm.setDutyCycle(motor.leadOnePin, leadOnePinState);
        pwm.setDutyCycle(motor.leadTwoPin, leadTwoPinState, undefined, () => {
            console.log('Finished.');
        });
    });
}

module.exports = {
    setMotors,
    allStop,
    ALL_MOTORS,
    MOTORA1,
    MOTORB1,
    MOTORA2,
    MOTORB2
}