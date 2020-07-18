const { Sequelize, Model, DataTypes   } = require('sequelize');

const path = require('path');

var User = require("../models/index").User;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'data.sqlite3')
  });

const  testConnection = async () => {
    try {
        await sequelize.authenticate();
        //User.sync()

        const jane = await User.create({ firstName: "Jane", lastName : "second name", email : "shalithax@gmail.com", testName : "Shalitha" });

        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  }

  exports.testConnection = testConnection;