const zio = require('./zio-motor-driver/zio-motor-driver');
const zioMotor = require('./zio-motor-driver/models/zio-motor')

motorsA = {MOTORA1: zio.MOTORA1, MOTORA2: zio.MOTORA2};

console.log(zio.MOTORA1)

// zio.setMotors(motorsA, 'forward', 255);

zio.allStop();
