// action obj {action_number: 1, second_count: 0}
// match same with previous number?
// same: add second count
// else: reset
// action_number = 1 && second_count >= visitorNotification
// fetch(action , second, time)
// clear second count

let dangerActionList = [3,4]
let lastActionNumber = 0
let counter = 0
// let action3 = {actionNumber:3, count:0}

// let action4 = {actionNumber:4, count:0}
// call every 5 seconds
// notify according to user's warning second 
async function WTF(actionNumber, warningSecond) {
    const counterLimit =  warningSecond / 5
    if (!dangerActionList.includes(actionNumber)) return
    if (actionNumber != lastActionNumber) {
        lastActionNumber = actionNumber
        counter = 1
        return
    }
    if (actionNumber == lastActionNumber) counter ++ 
    if (counter >= counterLimit) {
        notify()
        counter = 0 
        return
    }


// 


}

WTF(3, 10)

function checkLastAction(actionNumber) {
    return actionNumber == lastActionNumber ? true : false
}
