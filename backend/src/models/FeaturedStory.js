const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FeaturedStory = sequelize.define('FeaturedStory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'story_id'
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
      defaultValue: 'Featured Story'
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
    tableName: 'featured_stories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['story_id']
      },
      {
        fields: ['is_active', 'display_order']
      }
    ]
  });

  FeaturedStory.associate = (models) => {
    // FeaturedStory belongs to a Story
    FeaturedStory.belongsTo(models.Story, {
      foreignKey: 'storyId',
      as: 'story'
    });
  };

  return FeaturedStory;
};