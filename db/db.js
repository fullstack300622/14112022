require('dotenv').config();

const knex = require('knex').knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
});

module.exports = {
    knex
}
