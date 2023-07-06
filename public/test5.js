const CountURL = "./tm-my-image-model/";
let visitorNotification = 10
let notification = false
let compareValue = 0
let countSecond = 0
let result
let dTime = moment().format('HH:mm')
let dDate = moment().format('YYYY/MM/D')
let timetodo2

let disableNotification1 = false


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
            disableNotification1 = true;
        }
    })


let countModel, CountWebcam, countLabelContainer, countMaxPredictions;
let counterArray2 = []
let timeToCount
let count
let moveCheck = true
let countCanvas = document.getElementById("countCanvas")
// Load the image model and setup the webcam
async function initCountPerson() {
    const modelURL = CountURL + "model.json";
    const metadataURL = CountURL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    countModel = await tmImage.load(modelURL, metadataURL);
    countMaxPredictions = countModel.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    const size = 400
    CountWebcam = new tmImage.Webcam(size, size, flip); // width, height, flip
    await CountWebcam.setup(); // request access to the webcam
    await CountWebcam.play();

    timeToCount = setInterval(calculateCount, 5000);
    window.requestAnimationFrame(countLoop);

    // append elements to the DOM
    countCanvas.appendChild(CountWebcam.canvas);
    countLabelContainer = document.getElementById("countLabel-container");
    for (let i = 0; i < countMaxPredictions; i++) { // and class labels
        countLabelContainer.appendChild(document.createElement("div"));
    }
}

async function countLoop() {
    CountWebcam.update(); // update the webcam frame
    await countPredict();
    window.requestAnimationFrame(countLoop);
}

// run the webcam image through the image model
async function countPredict() {
    // predict can take in an image, video or canvas html element
    const prediction = await countModel.predict(CountWebcam.canvas);

    counterArray2.push(prediction)
    for (let i = 0; i < countMaxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        countLabelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

function calculateCount() {
    let result = (counterArray2.map(v => v.map(v => parseFloat(v.probability.toFixed(2)))));
    let sum = result.reduce((acc, values) => {
        let max = Math.max(...values)
        let index = values.indexOf(max)
        acc[index] = acc[index] + 1
        return acc
    }, [0, 0])

    let max = Math.max(...sum)
    count = sum.indexOf(max)
    // add something here
    startMatch(count)
    // add something here
    console.log("count People" + count)
    checkCount(count)
    counterArray2 = [];
}


async function checkCount(count) {
    let id = await getUserId()
    if (count == 0 && moveCheck == false) {
        initCheckMovement()
        moveCheck = true
    }
    if (count == 1) {
        // add something
        stopMoveCamera()
        moveCheck = false
        sendToServerWhenTwo({
            id,
            action:6
        })
    }

}

async function stopCountCamera() {
    await CountWebcam.stop();
    countCanvas.removeChild(CountWebcam.canvas)
    clearInterval(timeToCount);
    stopMoveCamera()
}

initCountPerson()

// action obj {action_number: 1, second_count: 0}
// match same with previous number?
// same: add second count
// else: reset
// action_number = 1 && second_count >= visitorNotification
// fetch(action , second, time)
// clear second count
let actionList = [{actionNumber:3, count:0},{actionNumber:4, count:0}]
let action3 = {actionNumber:3, count:0}

let action4 = {actionNumber:4, count:0}
async function WTF(actionNumber) {


}

async function startMatch(action) {
    if (disableNotification == true) {
        return
    } else {
    if (action == 1) {
        countSecond += 5
        result = {
            dTime,
            dDate,
            action,
            countSecond
        }
        if (action == 1 && countSecond >= visitorNotification) {
            if (notification == false) {

                result.action= 4
                // console.log(result)

                const res = await fetch("/newNotification", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(
                        result
                    ),
                });
                const jsonResult = await res.json();
                if (jsonResult.error) {
                  return
                }
                console.log(jsonResult)
            }
            notification = true
            resetVisitorTimer()
            countSecond = 0
            dTime = moment().format('HH:mm')
            dDate = moment().format('YYYY/MM/D')
            result = {
                dTime,
                dDate,
                action,
                countSecond
            }
        }
    } else {
        // if (result !== undefined || second != 0){
        //     console.log(result)
        // }
        secountSecondcond = 5;
        dTime = moment().format('HH:mm')
        dDate = moment().format('YYYY/MM/D')
        result = {
            dTime,
            dDate,
            action,
            countSecond
        }
    }
    compareValue = action
}}

function resetVisitorTimer(){
    console.log("triggered visitor reset")
    setInterval(function(){
    notification = false
},(1000*30))
}


function sendToServerWhenTwo(
    {
        id,
        action
    }
) {
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
