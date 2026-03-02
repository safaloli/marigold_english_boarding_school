require('dotenv').config()

const DbConfig = {
    mysql: {
        dbHost: process.env.DB_HOST,
        dbName: process.env.DB_NAME,
        dbUser: process.env.DB_USER,
        dbPassword: process.env.DB_PASSWORD
    }
}

module.exports = {
    DbConfig
}