import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('users'))) {
    await knex.schema.createTable('users', table => {
      table.increments('id')
      table.string('username', 25).notNullable()
      table.string('password_hash', 60)
      table.string('email', 64).notNullable()
      table.integer('phone').notNullable()
      table.integer('warning_second').notNullable()
      table.string('camera', 128)
      table.timestamps(false, true)
    })
  }

  if (!(await knex.schema.hasTable('movement'))) {
    await knex.schema.createTable('movement', table => {
      table.increments('id')
      table.string('pose', 60).notNullable()
      table.timestamps(false, true)
    })
  }

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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('action')
  await knex.schema.dropTableIfExists('movement')
  await knex.schema.dropTableIfExists('users')
}
