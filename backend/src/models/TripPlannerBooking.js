module.exports = (sequelize, DataTypes) => {
  const TripPlannerBooking = sequelize.define('TripPlannerBooking', {
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
    destination: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tripDuration: {
      type: DataTypes.INTEGER,
      field: 'trip_duration',
      allowNull: false,
      comment: 'Duration in days'
    },
    startDate: {
      type: DataTypes.DATEONLY,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATEONLY,
      field: 'end_date'
    },
    budgetRange: {
      type: DataTypes.STRING(50),
      field: 'budget_range'
    },
    travelStyle: {
      type: DataTypes.STRING(100),
      field: 'travel_style'
    },
    interests: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    revisionCount: {
      type: DataTypes.INTEGER,
      field: 'revision_count',
      defaultValue: 0
    },
    maxRevisions: {
      type: DataTypes.INTEGER,
      field: 'max_revisions',
      defaultValue: 2
    },
    pdfDeliveryMethod: {
      type: DataTypes.STRING(50),
      field: 'pdf_delivery_method',
      defaultValue: 'email'
    },
    planningNotes: {
      type: DataTypes.TEXT,
      field: 'planning_notes'
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
    tableName: 'trip_planner_bookings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  TripPlannerBooking.associate = function(models) {
    // Belongs to main booking
    TripPlannerBooking.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking'
    });
  };

  return TripPlannerBooking;
};
