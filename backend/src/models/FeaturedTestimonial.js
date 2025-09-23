const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FeaturedTestimonial = sequelize.define('FeaturedTestimonial', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      }
    ]
  });

  // No associations - this is standalone testimonials managed by admin
  FeaturedTestimonial.associate = (models) => {
    // No foreign key relationships for admin-managed testimonials
  };

  return FeaturedTestimonial;
};
