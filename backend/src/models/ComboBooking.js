module.exports = (sequelize, DataTypes) => {
  const ComboBooking = sequelize.define('ComboBooking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bookingId: {
      type: DataTypes.INTEGER,
      field: 'booking_id',
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    selectedServices: {
      type: DataTypes.JSONB,
      field: 'selected_services',
      allowNull: false,
      comment: 'Array of selected services: guide, photography'
    },
    guideDuration: {
      type: DataTypes.INTEGER,
      field: 'guide_duration',
      comment: 'Duration in hours'
    },
    photographyDuration: {
      type: DataTypes.INTEGER,
      field: 'photography_duration',
      comment: 'Duration in hours'
    },
    coordinationComplexity: {
      type: DataTypes.STRING(50),
      field: 'coordination_complexity',
      validate: {
        isIn: [['simple', 'moderate', 'complex']]
      }
    },
    teamCoordinationNotes: {
      type: DataTypes.TEXT,
      field: 'team_coordination_notes'
    },
    serviceTimeline: {
      type: DataTypes.JSONB,
      field: 'service_timeline',
      comment: 'Timeline showing when each service happens'
    },
    packageDiscount: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'package_discount',
      defaultValue: 0.00
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'combo_bookings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ComboBooking.associate = function(models) {
    // Belongs to main booking
    ComboBooking.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking'
    });
  };

  return ComboBooking;
};
