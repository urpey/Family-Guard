import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('action_array')
    await knex.schema.createTableIfNotExists(`action`,table=>{
        table.increments('id')
        table.integer('user_id').notNullable().references('users.id')
        table.integer('0').notNullable()
        table.integer('1').notNullable()
        table.integer('2').notNullable()
        table.integer('3').notNullable()
        table.integer('4').notNullable()
        table.integer('5').notNullable()
        table.timestamps(true,true)
    })
}


export async function down(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable('action_array'))) {
        await knex.schema.createTableIfNotExists(`action_array`,table=>{
            table.increments('id')
            table.integer('user_id').notNullable().references('users.id')
            table.specificType('actionArray','integer ARRAY').notNullable()
            table.timestamps(true,true)
        })
      }
      await knex.schema.dropTableIfExists('action')
}

