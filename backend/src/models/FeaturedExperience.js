const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FeaturedExperience = sequelize.define('FeaturedExperience', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    experienceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'experience_id'
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
      defaultValue: 'Featured'
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
    tableName: 'featured_experiences',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['experience_id']
      },
      {
        fields: ['is_active', 'display_order']
      }
    ]
  });

  FeaturedExperience.associate = (models) => {
    // FeaturedExperience belongs to an Experience
    FeaturedExperience.belongsTo(models.Experience, {
      foreignKey: 'experienceId',
      as: 'experience'
    });
  };

  return FeaturedExperience;
};