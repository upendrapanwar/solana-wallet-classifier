const Redis = require("ioredis");
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URI);

redis.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis;