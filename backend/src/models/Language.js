
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(5), // ISO 639-1/639-2
    allowNull: false,
    unique: true
  },
  nativeName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'native_name'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'languages',
  timestamps: true,
  underscored: true,
  paranoid: true
});


  return Language;
};
