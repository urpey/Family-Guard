import {lightblue} from 'asciichart';
import {knex} from './db';
import {hashPassword, isPasswordMatch} from './hash';
import {registerForm} from './users-controller';

export type sessionUserData = {
    id: number
    username: string
  }


export class UsersService {
  async Login(username:string, password:string):Promise<Array<sessionUserData>|void> {
    try{
    const pw = await knex.select('password_hash').from('users').where('username', username);

    if (pw.length < 1) {
      return [];
    }
    const password_hash:string = pw[0].password_hash;
    const result = await isPasswordMatch({password, password_hash});
    if (!result) {
      return [];
    } else {
      const res:Array<sessionUserData> = await knex.select('id', 'username').from('users').where('username', username);
      return res;
    }
    } catch(err){console.log(err);}
  }
  async Register(registerForm:registerForm):Promise<Array<sessionUserData>|void> {
    const hashPW = await hashPassword(registerForm.password);
    try{
    const result:Array<sessionUserData> = await knex.insert({
      username: registerForm.username,
      password_hash: hashPW,
      email: registerForm.email,
      phone: registerForm.phone}).into('users').returning(['id', 'username']);
      
      //   await knex.schema.createTableIfNotExists(`action_user_id_${result[0].id}`,table=>{
      //     table.increments('id')
      //     table.specificType('actionArray','integer ARRAY')
      // })
    return result;
  } catch(err){console.log(err);}
  }
  async LoginViaGoogle(result:any) {
    const fillinname = result.email.slice(0, -10);
    try{
    const users = await knex.select('*').from('users').where('email', result.email);
    let user = users[0];
    if (!user) {
      await knex.insert({username: fillinname, password_hash: '', email: result.email}).into('users').returning('*');
      user = await knex.select('*').from('users').where('email', result.email);
      user=user[0];
    //   await knex.schema.createTableIfNotExists(`action_user_id_${user.id}`,table=>{
    //     table.increments('id')
    //     table.specificType('actionArray','integer ARRAY')
    // })

      return user;
    }
    return user;
  } catch(err){console.log(err);}
  }
}
