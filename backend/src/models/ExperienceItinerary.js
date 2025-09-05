
module.exports = (sequelize, DataTypes) => {
  const ExperienceItinerary = sequelize.define('ExperienceItinerary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  experienceId: {
    type: DataTypes.INTEGER,
    field: 'experience_id',
    allowNull: false,
    references: {
      model: 'experiences',
      key: 'id'
    }
  },
  stepNumber: {
    type: DataTypes.INTEGER,
    field: 'step_number',
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    field: 'duration_minutes',
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'experience_itinerary',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['experience_id', 'step_number']
    }
  ]
});


  return ExperienceItinerary;
};
