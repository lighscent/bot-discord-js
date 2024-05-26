const db = require('./db');
const log = require('./logger');

const createTable = async () => {
    const conn = await db.getConnection();
    try {
        // 
        try {
            await conn.query(`
            CREATE TABLE IF NOT EXISTS example (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);
            log.info('✔️  Created table example');
        } catch (err) {
            log.error('❌  Failed to create table example');
            log.error(err);
        }

    } catch (err) {
        console.error(err);
    } finally {
        conn.release();
    }
};

createTable();