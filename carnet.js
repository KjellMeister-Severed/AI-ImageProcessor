let objectDetector;
let status;
let objects = [];
let video;
let canvas, ctx;
const width = 480;
const height = 360;
let missCounter = 5

window.addEventListener('DOMContentLoaded', init)

async function init() {
    video = await getVideo();
    objectDetector = await ml5.objectDetector('cocossd', startDetecting)
    canvas = createCanvas(width, height);
    ctx = canvas.getContext('2d');
}


function startDetecting() {
    console.log('model ready')
    detect();
}

function detect() {
    objectDetector.detect(video, function (err, results) {
        if (err) {
            return
        }

        objects = results

        if (results) {
            draw();

        }

        detect();
    });
}

function draw() {
    // Clear part of the canvas

    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {

        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

        ctx.beginPath();
        ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
    detectCar(objects)
}


async function getVideo() {

    const videoElement = document.createElement('video');
    videoElement.setAttribute("style", "display: none;");
    videoElement.width = width;
    videoElement.height = height;
    document.body.appendChild(videoElement);

    const capture = await navigator.mediaDevices.getUserMedia({video: true})
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement
}

function createCanvas(w, h) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    document.querySelector('.videoFeed').appendChild(canvas);
    return canvas;
}

function detectCar(object) {
    let classList = document.querySelector(".carDetected").classList
    console.log(classList)
    object.forEach((object) => {
        if (object.label === "car") {
            classList.replace('red', 'green')
            missCounter = 5
        }
    })
    if(missCounter <= 0 ){
        classList.replace('green', 'red')
    }
    missCounter -= 1
}