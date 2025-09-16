
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
    type: DataTypes.STRING(200),  // Sesuaikan dengan VARCHAR(200) di schema
    field: 'location_name',       // Field di database bernama location_name
    allowNull: true
  }
}, {
  tableName: 'experience_itineraries',  // Sesuaikan dengan schema yang ada
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,  // Tabel tidak punya kolom updated_at
  indexes: [
    {
      fields: ['experience_id', 'step_number']
    }
  ]
});


  return ExperienceItinerary;
};
