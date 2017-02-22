var RollingSpider = require('rolling-spider');
var Leap = require('leapjs');

var ACTIVE = false;
var STEPS = 5;
var d = new RollingSpider({uuid:"xxxxxxxxxxxxxxxx"});

d.connect(function () {
    d.setup(function () {
        console.log('Configured for Rolling Spider! ', d.name);
        d.flatTrim();
        d.startPing();
        d.flatTrim();
        setTimeout(function () {
            console.log(d.name + ' => SESSION START');
            ACTIVE = true;
        }, 1000);
    });
});

var controller = new Leap.Controller({
    host: '192.168.0.4',
    port: 6437,
    //ラズパイでは'animationFrame'も'deviceFrame'も指定しない
    //frameEventName: 'animationFrame',
    enableGestures: true
});

controller.on('gesture', function (gesture) {
    switch (gesture.type) {
        case 'circle':
            onCircle(gesture);
            break;
        case 'swipe':
            onSwipe(gesture);
            break;
        case 'screenTap':
            onScreenTap(gesture);
            break;
        case 'keyTap':
            onKeyTap(gesture);
            break;
    }
});

function onCircle(gesture){
    if (gesture.state === 'stop') {
        if (Math.abs(gesture.normal[0]) > Math.abs(gesture.normal[2])){
            if (gesture.normal[0] > 0) {
                d.backFlip({ steps: STEPS });
                console.log('circle => backFlip');
            } else {
                d.frontFlip({ steps: STEPS });
                console.log('circle => frontFlip');
            }
        } else {
            if (gesture.normal[2] > 0) {
                d.leftFlip({ steps: STEPS });
                console.log('circle => leftFlip');
            } else {
                d.rightFlip({ steps: STEPS });
                console.log('circle => rightFlip');
            }
        }
    }
}

function onSwipe(gesture){
    if (gesture.state === 'stop') {
        var direction, swipeDirection;

        if(Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1])){
            if(Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[2])){
                direction = 'x';
            } else {
                direction = 'z';
            }
        } else {
            if(Math.abs(gesture.direction[1]) > Math.abs(gesture.direction[2])){
                direction = 'y';
            } else {
                direction = 'z';
            }
        }

        if (direction === 'x') {
            if(gesture.direction[0] > 0){
                swipeDirection = "right";
                d.tiltRight({ steps: STEPS });
            } else {
                swipeDirection = "left";
                d.tiltLeft({ steps: STEPS });
            }
        } else if (direction === 'y') {
            if(gesture.direction[1] > 0){
                swipeDirection = "up";
                d.up({ steps: STEPS });
            } else {
                swipeDirection = "down";
                d.down({ steps: STEPS });
            }
        } else if (direction === 'z'){
            if(gesture.direction[2] > 0){
                swipeDirection = "back";
                d.backward({ steps: STEPS });
            } else {
                swipeDirection = "front";
                d.forward({ steps: STEPS });
            }
        }
        console.log('swipe => '+swipeDirection);
    }
}

function onScreenTap(gesture){
    if (gesture.state === 'stop') {
        console.log('screenTap => landing');
        d.land();
    }
}

function onKeyTap(gesture){
    if (gesture.state === 'stop') {
        if (ACTIVE) {
            console.log('keyTap => takeOff');
            d.takeOff();
        }
    }
}
