import { Knex } from "knex";
import { hashPassword } from "../hash";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('action').del()
    await knex("users").del();
    await knex("movement").del();
    let hashedPW = await hashPassword('admin')
    // Inserts seed entries
    await knex("users").insert([
        { id: 1, username: "admin", password_hash: hashedPW, email: "admin@tecky.io", phone: 12345678, warning_second: 10},
    ]);
    await knex("movement").insert([
        { id: 1, pose: 'stand' },
        { id: 2, pose: 'sit' },
        { id: 3, pose: 'fall' },
        { id: 4, pose: 'bend' },
        { id: 5, pose: 'wave' },
        { id: 6, pose: 'noShow'},
        { id: 7, pose: 'multiple' },
    ]);

};

