
const initialMotionPlan = {direction: 'none', speed: 0, standBy: 0, acceleration: 0};
const initialMotorState = {direction: 'none', speed: 0, standBy: 0, reverseLeads: false}
function Motor(leadOnePin, leadTwoPin, pwmPin, standByPin, reverseLeads) {
    this.leadOnePin = leadOnePin; 
    this.leadTwoPin = leadTwoPin; 
    this.pwmPin = pwmPin;
    this.standByPin = standByPin;
    this.state = initialMotorState;
    this.motionPlan = initialMotionPlan;
}

module.exports = {
    Motor
}