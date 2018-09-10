var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685").Pca9685Driver;
 
/*
Zio PCA Motor Controller
    C. Thomas Brittain (c), MIT

    STANDBY is active HIGH.
*/
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

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 50,
    debug: true
};
pwm = new Pca9685Driver(options, function(err) {
    console.log(pwm);
    pwm.setDutyCycle(STBY1, 0.0)

    pwm.setDutyCycle(PWMA1, 0.6);
    pwm.setDutyCycle(A1IN1, 0.0);
    pwm.setDutyCycle(A1IN2, 1.0)
    
    pwm.setDutyCycle(PWMB1, 0.6);
    pwm.setDutyCycle(B1IN1, 0.0);
    pwm.setDutyCycle(B1IN2, 1.0)
    // console.log(err);
});
