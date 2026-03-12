import { getPool } from "./DB.js";
import sql from 'mssql';

export async function getUserByUsername(username) {
    try {

        const pool = await getPool();
        const result = await pool.request()
            .input('username', sql.VarChar(20), username)
            .query(`SELECT *
                FROM RegisteredUsers 
                WHERE Username = @username`);
        return result.recordset[0];
    } catch (error) {
        console.error(error.message);
    }
}

export async function createUser(user) {

}