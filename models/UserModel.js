const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
    },
    dp_url: {
        type: Sequelize.STRING,
    },
});

User.prototype.toJSON = function () {
    const values = { ...this.get() };
  
    // Exclude sensitive or unnecessary data
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
  
    return values;
};

module.exports = User;