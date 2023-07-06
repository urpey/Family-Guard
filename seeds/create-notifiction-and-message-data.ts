import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("notification").del();
    await knex("message").del();

    // Inserts seed entries
    await knex("message").insert([
        { id: 1, content: 'Fall detected' },
        { id: 2, content: 'Wave detected' },
        { id: 3, content: 'No one at home for 30 minutes already'},
        { id: 4, content: 'Visitors detected' },
    ]);
};
