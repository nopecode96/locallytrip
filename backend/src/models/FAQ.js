module.exports = (sequelize, DataTypes) => {
  const FAQ = sequelize.define('FAQ', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('general', 'booking', 'payment', 'host', 'traveller', 'technical'),
      defaultValue: 'general'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_featured'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'helpful_count'
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    tableName: 'faqs',
    underscored: true,
    paranoid: false,
    timestamps: true
  });

  return FAQ;
};
