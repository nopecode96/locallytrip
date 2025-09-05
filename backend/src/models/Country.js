module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(3), // ISO 3166-1 alpha-2/3
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'countries',
    timestamps: true,
    underscored: true,
    paranoid: false
  });

  return Country;
};
