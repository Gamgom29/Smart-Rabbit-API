const { DataTypes} = require('sequelize');

const sequelize = require('../utils/database');
const validator = require('validator');

const customer = sequelize.define('customers',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationalId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    nationalIdPhotoFace:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'photo'
        
    },
    nationalIdPhotoBack:{
        type: DataTypes.STRING,
        allowNull: false,        
        defaultValue:'photo'
    },
    taxNumberPhoto:{
        type: DataTypes.STRING,
        allowNull: false, 
        defaultValue:'photo'
    },
    taxNumber:{
        type: DataTypes.BIGINT,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate:{
            isEmail:{msg:'Invalid email address'}
        }
    },
    city:{
        type: DataTypes.STRING,
        allowNull: false
    },
    neighbourhood:{
        type: DataTypes.STRING,
        allowNull: false
    },
    productType:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Token:{
        type: DataTypes.STRING,
    }

});
module.exports = customer;
