import { Knex } from "knex";
import { User } from "./setting";
import { knex } from "./db";

export class NotificationService {
  constructor() {}

  async get(user_id: any) {
    let userInfo = await knex
      .from("notification")
      .select("id", "message_id", "date", "time")
      .where("users_id", user_id)
      if (userInfo.length == 0) {
        return new Error('User not found');
      }
    return userInfo;
  }


  async post(input: {
    user_id: any;
    action: number;
    dDate: string;
    dTime: string;
  }) {

    let updateInfo = await knex
      .insert([
        {
            users_id: input.user_id,
            message_id: input.action,
            date: input.dDate,
            time: input.dTime,
        },
      ])
      .into("notification")
      .returning(["id", "users_id", "message_id", "date", "time"]);
    return updateInfo[0];
  }

}
