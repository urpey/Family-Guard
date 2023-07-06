import { time } from "console";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('action')
    await knex.schema.createTableIfNotExists(`action_array`,table=>{
        table.increments('id')
        table.integer('user_id').notNullable().references('users.id')
        table.specificType('actionArray','integer ARRAY').notNullable()
        table.timestamps(true,true)
    })
}



export async function down(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable('action'))) {
        await knex.schema.createTable('action', table => {
          table.increments('id')
          table.integer('users_id').unsigned().notNullable().references('users.id')
          table.integer('movement_id').unsigned().notNullable().references('movement.id')
          table.timestamp('start_time').notNullable()
          table.timestamp('end_time').notNullable()
          table.timestamps(false, true)
        })
      }
      await knex.schema.dropTableIfExists('action_array')
}

