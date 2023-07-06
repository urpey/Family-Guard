
import { knex } from "./db";


// async function insertToDataBase(result:number[]){
//     // await knex.schema.alterTable('action2',(table) => {
//     //     table.renameColumn('0' , 'stand')
//     //     table.renameColumn('1' , 'sit')
//     //     table.renameColumn('2' , 'bend')
//     //     table.renameColumn('3' , 'wave')
//     //     table.renameColumn('4' , 'fall')
//     //     table.renameColumn('5' , 'noShow')
//     //     table.renameColumn('6' , 'multiple')
//     // })
//   await knex
//       .insert([
//         {
//             user_id: 1,
//             0: result[0],
//             1: result[1],
//             2: result[2],
//             3: result[3],
//             4: result[4],
//             5: result[5],
//             6: result[6],
//             created_at: new Date(),
//             updated_at: new Date(),
//         },
//       ])
//       .into("action")

    //   await knex('action')
    //   .del()
    //   .where('id','=','2')
// }

// let result = [50,335,4,1,279,1,0]
//insertToDataBase(result)

function dataGenerator() {
  let ground: number[][] = []; // Initialize array
  for (var i = 0; i < 24; i++) {
    ground[i] = []; // Initialize inner array
    let maxValue = 720;
    for (var j = 0; j < 7; j++) {
      // i++ needs to be j++
      if (j == 6) {
        ground[i][j] = maxValue;
      } else {
        let newValue = Math.floor(Math.random() * 720);
        if (maxValue - newValue <= 0) {
          ground[i][j] = 0;
        } else {
          maxValue = maxValue - newValue;
          ground[i][j] = newValue;
        }
      }
    }
  }
  return ground;
}


function addHours(numOfHours:number, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  
    return date;
  }

const data = dataGenerator();
const startTime = new Date(2022,5,15);
//console.log( new Date(startTime.setHours(startTime.getHours()+1)));
const results = data.map((row,idx) => {
    const d = addHours(1,startTime)
    //console.log(d.toLocaleDateString("en-US"))
  return {
    user_id: 1,
    0: row[0],
    1: row[1],
    2: row[2],
    3: row[3],
    4: row[4],
    5: row[5],
    6: row[6],
    created_at:d.toLocaleString("en-US"),
    updated_at:d.toLocaleString("en-US"),
  };
});

knex("action").insert(results).then((data)=>{
console.log(data)
})