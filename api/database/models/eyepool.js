'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EyePool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EyePool.init({
    id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      validate:{
        notNull:{
          args:true,
          msg:"id is not null"
        }
      }
    },
    description: {
      type:DataTypes.TEXT,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'EyePool',
  });
  return EyePool;
};