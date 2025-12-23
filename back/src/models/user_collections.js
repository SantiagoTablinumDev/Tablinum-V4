const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('user_collections', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    especimenes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    bochones: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    extra1: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra2: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra3: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra4: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra5: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra6: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
    extra7: {
      type: DataTypes.TEXT,
      defaultValue: "Sin Datos",
    },
  }, {
    timestamps: true,
    createdAt: false,   // desactiva createdAt
    updatedAt: true,    // mantiene updatedAt
  });
};