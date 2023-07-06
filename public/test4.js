// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose


// the link to your model provided by Teachable Machine export panel
const URL = "/my-pose-model4/";
let model, webcam, ctx, labelContainer, maxPredictions;
let timeToDo;
let counterArray = [];
let action;
let second = 5000
let socket = io.connect();

let fallWarning = 30
let waveWarning = 10
let noBodyWarning = 30
let fallNotification = false
let waveNotification = false
let nobodyNotification = false

let disableNotification = false

let compareValue1 = 0
let countSecond1 = 0
let result1
let result2
let newKeys = {
    dTime1: "dTime",
    dDate1: "dDate",
    action: "action",
    countSecond1: "countSecond"
};
let dTime1 = moment().format('HH:mm')
let dDate1 = moment().format('YYYY/MM/D')

socket.on('connect', () => {
    console.log('socket.io connected to server, id:', socket.id)
})

async function getUserId() {
    let res = await fetch('/userdata')
    let json = await res.json()
    return json.id
}


fetch("/getinfo")
    .then((res) => res.json())
    .catch((err) => ({
        error: String(err),
    }))
    .then((json) => {
        if (json.error) {
            console.log(json.error);
            return;
        }
        fallWarning = json.warning_second
        if (fallWarning == 0) {
            disableNotification = true;
        }
    })


async function initCheckMovement() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 400;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    timeToDo = setInterval(calculateAction, second);



    let draw = window.requestAnimationFrame(loop);
    // window.cancelAnimationFrame(draw)
    // append/get elements to the DOM
    const canvas = document.getElementById("movementCanvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("movementLabel-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    // let str = prediction.map( v => v.className).join(" ")
    // let str2 = prediction.map( v => v.probability).join(" ")

    counterArray.push(prediction);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    // finally draw the poses
    drawPose(pose);
}

document.getElementById("stopBtnMove").addEventListener("click", () => {
    stopMoveCamera()
})

async function stopMoveCamera() {
    await webcam.stop();
    clearInterval(timeToDo);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}


// 
async function calculateAction() {
    // clearInterval(timetodo2)
    let result = (counterArray.map(v => v.map(v => parseFloat(v.probability.toFixed(2)))));
    let sum = result.reduce((acc, values) => {
        let max = Math.max(...values)
        let index = values.indexOf(max)
        acc[index] = acc[index] + 1
        return acc
    }, [0, 0, 0, 0, 0, 0])
    let max = Math.max(...sum)
    action = sum.indexOf(max)
    startmatch1(action)
    checkAction()
    let id = await getUserId()
    sendActionToServer({
        id,
        action
    })
    counterArray = [];
}

async function stopMoveCamera() {
    await webcam.stop();
    clearInterval(timeToDo);
}

// const ActionList = ["stand","stand"]
// function(){

// }

function checkAction() {
    if (action == 0) {
        console.log("stand")
    }
    if (action == 1) {
        console.log("sit")
    }
    if (action == 2) {
        console.log("bend")
    }
    if (action == 3) {
        console.log("wave")
    }
    if (action == 4) {
        console.log("fall")
    }
    if (action == 5) {
        console.log("noshow")
    }
    if (action == 6) {
        console.log("two people")
    }
}

function sendActionToServer({
    id,
    action
}) {
    fetch('/action', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            action
        }),
    }).then((res) => {
        return res.json()
    }).then(data => {
        console.log("serverBack" + data.action)
    })
}

initCheckMovement()


// function calculateFall(){
//     console.log("Hello");
//     let result = (counterArray.map(v => v.map(v => parseFloat(v.probability.toFixed(2)))));
//     let sum = result.reduce((acc,values)=>{
//         acc[0]=acc[0] + values[0];
//         acc[1]=acc[1] + values[1];
//         acc[2]=acc[2] + values[2];
//         acc[3]=acc[3] + values[3];
//         acc[4]=acc[4] + values[4];
//         acc[5]=acc[5] + values[5];
//         return acc
//     },[0,0,0,0,0,0])
//     console.log(sum)
//     let max = Math.max(...sum)
//     console.log(max)
//     let action = sum.indexOf(max)
//     console.log(action)
//     counterArray = [];
// }



async function startmatch1(action) {
    if (disableNotification == true) {
        return
    } else {
        if (action == compareValue1) {
            countSecond1 += 5
            result1 = {
                dTime1,
                dDate1,
                action,
                countSecond1
            }
            if (action == 4 && countSecond1 >= fallWarning) {
                if (fallNotification == false) {
                    result1.action = 1
                    // console.log(result)
                    result2 = result1
                    result2 = renameKeys(result2, newKeys);
                    console.log(result2)
                    const res = await fetch("/newNotification", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(
                            result2
                        ),
                    });
                    const jsonResult = await res.json();
                    if (jsonResult.error) {
                        return
                    }
                    resetFallTimer()
                    console.log(jsonResult)
                }
                fallNotification = true
                countSecond1 = 0
                dTime1 = moment().format('HH:mm')
                dDate1 = moment().format('YYYY/MM/D')
                result1 = {
                    dTime1,
                    dDate1,
                    action,
                    countSecond1
                }
            }

            if (action == 3 && countSecond1 >= waveWarning) {
                if (waveNotification == false) {
                    result1.action = 2
                    // console.log(result)
                    result2 = result1
                    result2 = renameKeys(result2, newKeys);
                    console.log(result2)
                    const res = await fetch("/newNotification", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(
                            result2
                        ),
                    });
                    const jsonResult = await res.json();
                    if (jsonResult.error) {
                        return
                    }
                    resetWaveTimer()
                    console.log(jsonResult)
                }
                waveNotification = true
                countSecond1 = 0
                dTime1 = moment().format('HH:mm')
                dDate1 = moment().format('YYYY/MM/D')
                result1 = {
                    dTime1,
                    dDate1,
                    action,
                    countSecond1
                }
            }

            if (action == 5 && countSecond1 >= noBodyWarning) {
                if (nobodyNotification == false) {
                    result1.action = 3
                    // console.log(result)
                    result2 = result1
                    result2 = renameKeys(result2, newKeys);
                    console.log(result2)
                    const res = await fetch("/newNotification", {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body: JSON.stringify(
                            result2
                        ),
                    });
                    const jsonResult = await res.json();
                    if (jsonResult.error) {
                        return
                    }
                    resetNobodyTimer()
                    console.log(jsonResult)
                }
                nobodyNotification = true
                countSecond1 = 0
                dTime1 = moment().format('HH:mm')
                dDate1 = moment().format('YYYY/MM/D')
                result1 = {
                    dTime1,
                    dDate1,
                    action,
                    countSecond1
                }
            }
        } else {
            countSecond1 = 5;
            dTime1 = moment().format('HH:mm')
            dDate1 = moment().format('YYYY/MM/D')
            result1 = {
                dTime1,
                dDate1,
                action,
                countSecond1
            }
        }
        compareValue1 = action
    }
}

function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map(key => {
        const newKey = newKeys[key] || key;
        return {
            [newKey]: obj[key]
        };
    });
    return Object.assign({}, ...keyValues);
}


function resetFallTimer() {
    console.log("triggered fall reset")
    setInterval(function () {
        fallNotification = false
    }, (1000 * 60 * 5))
}

function resetWaveTimer() {
    console.log("triggered fall reset")
    setInterval(function () {
        waveNotification = false
    }, (1000 * 60 * 5))
}

function resetNobodyTimer() {
    console.log("triggered fall reset")
    setInterval(function () {
        nobodyNotification = false
    }, (1000 * 60 * 30))
}


initCheckMovement()


// function calculateFall(){
//     console.log("Hello");
//     let result = (counterArray.map(v => v.map(v => parseFloat(v.probability.toFixed(2)))));
//     let sum = result.reduce((acc,values)=>{
//         acc[0]=acc[0] + values[0];
//         acc[1]=acc[1] + values[1];
//         acc[2]=acc[2] + values[2];
//         acc[3]=acc[3] + values[3];
//         acc[4]=acc[4] + values[4];
//         acc[5]=acc[5] + values[5];
//         return acc
//     },[0,0,0,0,0,0])
//     console.log(sum)
//     let max = Math.max(...sum)
//     console.log(max)
//     let action = sum.indexOf(max)
//     console.log(action)
//     counterArray = [];
// }