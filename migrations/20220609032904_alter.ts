import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable('users')) {
        await knex.schema.alterTable('users',(table)=>{
            table.unique(['username'])
            table.integer('phone').notNullable().defaultTo(0).alter()
            table.integer('warning_second').notNullable().defaultTo(10).alter()
            table.string('phone',25).alter()
        })
    }
}


export async function down(knex: Knex): Promise<void> {
    if(await knex.schema.hasTable('users')){
        await knex.schema.alterTable('users',(table)=>{
            table.dropUnique(['username'])
            table.integer('phone').notNullable().alter()
            table.integer('warning_second').notNullable().alter()
            table.integer('phone').alter()
        })
    }
}


