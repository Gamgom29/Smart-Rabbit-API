const { DataTypes} = require('sequelize');

const sequelize = require('../utils/database');
const validator = require('validator');

const order = sequelize.define('orders',{
    userId:{
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id'
        }
    },
    pickDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    recieverName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    recieverCity:{
        type: DataTypes.STRING,
        allowNull: false
    },
    recieverNeighborhood:{
        type: DataTypes.STRING,
        allowNull: false
    },
    recieverStreet:{
        type: DataTypes.STRING,
        allowNull: false
    },
    recieverPhone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productCategory:{
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    }

});



module.exports = order;