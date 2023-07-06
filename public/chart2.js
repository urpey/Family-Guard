
let borderColor = 'rgb(255, 128, 0)'
let hoverColor = 'rgb(255, 255, 102)'
let hoverBorderColor = 'rgb(255, 255, 102)'

let a = 255;
let b = 178; //b =a-77
let c = 101; c//b-77
let z = 77

// for (let i = 0; i < 24; i++) {
//     let v = i + 1
//     if (v == 24) {
//         v = 0
//     }
//     let label = `${i}:00-${v}:00`;
// }

let d = 0.2


// const list = [
//     {
//         label:"00:00-01:00",
//         backgroundColor:`rgba(${a}, ${c}, ${c}, ${d})`
//     }
// ]

const list = []

for (let i = 0; i < 24; i++) {
    let v = i + 1
    if (v == 24) {
        v = 0
    }
    let label = `${i}:00-${v}:00`;
    let backgroundColor;
    if (i >= 12) {
        d = 0.8
    }


    if (i % 3 == 0) {
        let rcolor = a
        let array = [b, c]
        if (i % 4 == 0) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 1) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[1]}, ${d})`]
        }
        if (i % 4 == 2) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 3) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[1]}, ${d})`]
        }
    }
    if (i % 3 == 1) {
        let rcolor = b
        let array = [a, c]
        if (i % 4 == 0) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 1) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[1]}, ${d})`]
        }
        if (i % 4 == 2) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 3) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[1]}, ${d})`]
        }
    }
    if (i % 3 == 2) {
        let rcolor = c
        let array = [b, a]
        if (i % 4 == 0) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 1) {
            backgroundColor = [`rgba(${rcolor}, ${array[0]}, ${array[1]}, ${d})`]
        }
        if (i % 4 == 2) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[0]}, ${d})`]
        }
        if (i % 4 == 3) {
            backgroundColor = [`rgba(${rcolor}, ${array[1]}, ${array[1]}, ${d})`]
        }
    }


    list.push({ label, backgroundColor })

}


const labels = [
    'Stand',
    'Sit',
    'Bend',
    'Wave',
    'Fall',
    'No-show',
    'Two-People',
];

const data = {
    labels: labels,
    datasets: [
    ],

};

const config = {

    type: 'bar',
    data: data,
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Total time of movement - Daily report'
            },
        },
        responsive: true,
        indexAxis: 'y',
        scales: {

            x: {
                stacked: true,
            },
            y: {
                stacked: true
            }
        }
    }
};

// function tick() {
//get the mins of the current time
// var mins = new Date().getMinutes();
// if (mins == "00") {
fetch('/actions/').then(res => { return res.json() })
    .then(json => {
        console.log('json:', json);
        let date = new Date()
        let hour = date.getHours()
        for (let i = 0; i < hour && i < json.length; i++) {
            console.log(json[i]),
                // data.datasets.push({
                //     label: list[i].label,

                //     data: [
                //         Math.floor(json[i][0] * 5 / 60),
                //         Math.floor(json[i][1] * 5 / 60),
                //         Math.floor(json[i][2] * 5 / 60),
                //         Math.floor(json[i][3] * 5 / 60),
                //         Math.floor(json[i][4] * 5 / 60),
                //         Math.floor(json[i][5] * 5 / 60),
                //         Math.floor(json[i][6] * 5 / 60),
                //     ], //insert data here -- "total action time"
                //     backgroundColor: [
                //         list[i].backgroundColor,
                //         list[i].backgroundColor,
                //         list[i].backgroundColor,
                //         list[i].backgroundColor,
                //         list[i].backgroundColor,
                //         list[i].backgroundColor,

                //     ],
                //     borderColor: [
                //         borderColor,
                //         borderColor,
                //         borderColor,
                //         borderColor,
                //         borderColor,
                //         borderColor,
                //     ],
                //     borderWidth: 1
                // })
            data.datasets.push({
                label: list[i].label,
                data: [
                    Math.floor(json[i][0] * 5 / 60),
                    Math.floor(json[i][1] * 5 / 60),
                    Math.floor(json[i][2] * 5 / 60),
                    Math.floor(json[i][3] * 5 / 60),
                    Math.floor(json[i][4] * 5 / 60),
                    Math.floor(json[i][5] * 5 / 60),
                    Math.floor(json[i][6] * 5 / 60),
                ], //insert data here -- "total action time"
                backgroundColor: [
                    list[i].backgroundColor,
                    list[i].backgroundColor,
                    list[i].backgroundColor,
                    list[i].backgroundColor,
                    list[i].backgroundColor,
                    list[i].backgroundColor,

                ],
                borderColor: [
                    borderColor,
                    borderColor,
                    borderColor,
                    borderColor,
                    borderColor,
                    borderColor,
                ],
                hoverBackgroundColor: [
                    hoverColor,
                    hoverColor,
                    hoverColor,
                    hoverColor,
                    hoverColor,
                    hoverColor,
                ],
                hoverBorderColor: [
                    hoverBorderColor,
                    hoverBorderColor,
                    hoverBorderColor,
                    hoverBorderColor,
                    hoverBorderColor,
                    hoverBorderColor,
                    hoverBorderColor,
                ],
                borderWidth: 1
            })
        }

        const myChart = new Chart(
            document.getElementById('myChart'),
            config


        );
    })
    // }
    // console.log('Tick ' + mins);
// }



// setInterval(tick, 1000);


