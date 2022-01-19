let detector;
let client;

const options = {
    clientId: "MQTT-AI-COMP-4545615",
    protocolId: 'MQTT',
    useSSL: true,
    username: "EdgeGroep-ai",
    password: "EdgeGroep6",
}

document.addEventListener("DOMContentLoaded", init)

function init() {
    detector = ml5.objectDetector('cocossd', () => {
         client  = mqtt.connect('wss://ffca62ab118149a9b9e2b927e3b7712d.s1.eu.hivemq.cloud:8884/mqtt', options)
         client.on('connect', function () {
             console.log('Connected')
         })
         client.on('message', function (topic, message) {
            findCar(message, () => {
                client.publish("/gate/toggle", "")
            }).then()
         });
        client.subscribe("/image")
    });
}

function gotDetections(error, results) {
    if (error) {
        console.error(error);
    }
    console.log(results)
    if(results.map(item => item.label).includes("car")){
        client.publish("/gate/toggle", "")
    }
}

async function createImage (base){
    let image = new Image();
    image.src = `data:image/jpg;base64,${base}`;
    return image;
}

async function findCar(image) {
    let img = await createImage(image)
    detector.detect(img, gotDetections);
}