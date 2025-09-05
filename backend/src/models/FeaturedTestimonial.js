const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FeaturedTestimonial = sequelize.define('FeaturedTestimonial', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reviewer_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    experienceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'experience_id',
      references: {
        model: 'experiences',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    testimonialText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'testimonial_text'
    },
    reviewerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'reviewer_name'
    },
    reviewerLocation: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'reviewer_location'
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
    tableName: 'featured_testimonials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['is_active', 'display_order']
      },
      {
        fields: ['reviewer_id']
      },
      {
        fields: ['experience_id']
      }
    ]
  });

  // Define associations
  FeaturedTestimonial.associate = (models) => {
    // FeaturedTestimonial belongs to a User (reviewer)
    FeaturedTestimonial.belongsTo(models.User, {
      foreignKey: 'reviewer_id',
      as: 'reviewer',
      onDelete: 'CASCADE'
    });

    // FeaturedTestimonial belongs to an Experience (optional)
    FeaturedTestimonial.belongsTo(models.Experience, {
      foreignKey: 'experience_id',
      as: 'experience',
      onDelete: 'SET NULL'
    });
  };

  return FeaturedTestimonial;
};
