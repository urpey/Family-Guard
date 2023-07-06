import { knex } from "./db";

type DataPack = {
  user_id: number;
  actionArray: Array<number>;
};

export class CameraService {
  private dataPack:DataPack;
  private arraySum = 0;

  constructor(){
    this.dataPack = {
      user_id: 1,
      actionArray: [],
    };
  }

  async insetData(actionArray: number[]) {
    try {
      await knex
        .insert({
          user_id: 1,
          0: actionArray[0],
          1: actionArray[1],
          2: actionArray[2],
          3: actionArray[3],
          4: actionArray[4],
          5: actionArray[5],
          6: actionArray[6],
          created_at: new Date(),
          updated_at: new Date(),
        })
        .into("action");
        console.log('camera-service.ts ---- insert data to database acton successfully')
    } catch (err) {
      console.log(err);
    }
  }

  insertDataToDatabase = async (actionArray: number[]) => {
    await this.insetData(actionArray);
  };

  async dataAnalysis(id:number,action:number){
    this.dataPack.user_id = id;
    this.dataPack.actionArray.push(action);

    let array = this.dataPack.actionArray;
    let result = array.reduce(
      (acc, action) => {
        acc[action] += 1;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
    );
    this.arraySum += result.length;
    if (this.arraySum == 42) {
      console.log(result);
      this.insertDataToDatabase(result);
      this.dataPack.actionArray = [];
      this.arraySum = 0;
    }
  }
}
