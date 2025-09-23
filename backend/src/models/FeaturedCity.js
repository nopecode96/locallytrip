const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FeaturedCity = sequelize.define('FeaturedCity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    badge: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'Popular Destination'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    featuredUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'featured_until'
    },
    featuredImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'featured_image_url'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'featured_cities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['city_id']
      },
      {
        fields: ['is_active', 'display_order']
      }
    ]
  });

  FeaturedCity.associate = (models) => {
    // FeaturedCity belongs to a City
    FeaturedCity.belongsTo(models.City, {
      foreignKey: 'cityId',
      as: 'city'
    });
  };

  return FeaturedCity;
};