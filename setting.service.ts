import { Knex } from "knex";
import { User } from "./setting";
import {knex} from "./db"

export class SettingService {
  constructor() {}

  async get(user_id: any) {
    let userInfo = await knex
      .from("users")
      .select("id", "username", "email", "phone", "warning_second")
      .where("id", user_id)
      if (userInfo.length == 0) {
        return new Error('User not found');
      }
    return userInfo[0];
  }

  async update(input: { user_id: any; phone: string; email: string }) {
    let updateInfo = await knex
      .from("users")
      .update({
        phone: input.phone,
        email: input.email,
      })
      .where("id", input.user_id)
      .returning(["id", "username", "email", "phone", "warning_second"]);
    return updateInfo[0];
  }

  async setWarning(input: { user_id: any; second: any}) {
    console.log(input.second)
    let updateSecond = await knex
      .from("users")
      .update({
        warning_second: input.second,
      })
      .where("id", input.user_id)
      .returning(["id", "username", "email", "phone", "warning_second"]);
    return updateSecond;
  }
}
