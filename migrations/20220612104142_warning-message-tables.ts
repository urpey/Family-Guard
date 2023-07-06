import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('message'))) {
    await knex.schema.createTable('message', table => {
      table.increments('id')
      table.string('content', 60).notNullable()
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('notification'))) {
    await knex.schema.createTable('notification', table => {
      table.increments('id')
      table.integer('users_id').unsigned().notNullable().references('users.id')
      table.integer('message_id').unsigned().notNullable().references('message.id')
      table.string('date', 60).notNullable()
      table.string('time', 60).notNullable()
      table.timestamps(false, true)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notification')
  await knex.schema.dropTableIfExists('message')
}