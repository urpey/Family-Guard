import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('action',(table) => {
        table.dropColumn('created_at')
        table.dropColumn('updated_at')
        table.integer('6').notNullable()
    })
    await knex.schema.alterTable('action',(table) => {
        table.timestamps(true,true)
    })
    }






export async function down(knex: Knex): Promise<void> {
    if ((await knex.schema.hasTable('action'))) {
        await knex.schema.alterTable('action',(table) => {
            table.dropColumn('6')
        })
    }
}

