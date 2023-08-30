require("dotenv").config();
const { Sequelize } = require("sequelize");

const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD,
    {
        host: DB_HOST,
        dialect: 'mysql',
        port: 5432,
        dialect: 'postgres',
        dialectOptions: {
            connectTimeout: 60000, // 1 minute
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        },
    }
);

// sequelize.sync();

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('\n====== Database connected ======\n')
//   })
//   .catch(err => {
//     console.error('\n====== Error:\n' + err + '\n======\n')
//   })

module.exports = sequelize;