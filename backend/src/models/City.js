module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'country_id',
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      field: 'image_url',
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'cities',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  City.associate = function(models) {
    // City belongs to country
    City.belongsTo(models.Country, {
      foreignKey: 'countryId',
      as: 'country'
    });

    // City has many users
    City.hasMany(models.User, {
      foreignKey: 'cityId',
      as: 'users'
    });

    // City has many experiences
    City.hasMany(models.Experience, {
      foreignKey: 'cityId',
      as: 'experiences'
    });

    // City has many stories
    City.hasMany(models.Story, {
      foreignKey: 'cityId',
      as: 'stories'
    });
  };

  return City;
};
