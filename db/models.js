async function createTable(pool) {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS buyers (
                id SERIAL PRIMARY KEY,
                token_address TEXT,
                wallet_address TEXT,
                classification TEXT,
                balance NUMERIC,
                transaction_count INT,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log('Table created (if not exist)');
    } catch (err) {
        console.error('Error creating table', err);
        throw err;
    }
}

module.exports = {
    createTable
};