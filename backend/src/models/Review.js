
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  experience_id: {
    type: DataTypes.INTEGER,
    field: 'experience_id',
    allowNull: false,
    references: {
      model: 'experiences',
      key: 'id'
    }
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    field: 'reviewer_id',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  booking_id: {
    type: DataTypes.INTEGER,
    field: 'booking_id',
    allowNull: false,
    references: {
      model: 'bookings',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    field: 'is_verified',
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('is_verified');
    }
  },
  created_at: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

  return Review;
};
