require('dotenv').config();
const { createTable } = require('./models');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI
});


pool.connect()
    .then(async () => {
        console.log('Connected to database');
        await createTable(pool);
    })
    .catch((err) => {
        console.error('Failed to connect to database', err);
    });

//Listen for unexpected errors AFTER startup
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
