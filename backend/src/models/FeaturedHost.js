const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const FeaturedHost = sequelize.define('FeaturedHost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'host_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    featuredUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'featured_until'
    },
    highlightText: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'highlight_text'
    },
    featuredImageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'featured_image_url'
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
    }
  }, {
    tableName: 'featured_hosts',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: ['is_active', 'display_order']
      },
      {
        fields: ['host_id']
      }
    ]
  });

  // Define associations
  FeaturedHost.associate = (models) => {
    // FeaturedHost belongs to a User (host)
    FeaturedHost.belongsTo(models.User, {
      foreignKey: 'host_id',
      as: 'host',
      onDelete: 'CASCADE'
    });
  };

  return FeaturedHost;
};
