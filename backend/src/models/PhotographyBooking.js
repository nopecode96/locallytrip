module.exports = (sequelize, DataTypes) => {
  const PhotographyBooking = sequelize.define('PhotographyBooking', {
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
    packageType: {
      type: DataTypes.STRING(100),
      field: 'package_type',
      allowNull: false,
      validate: {
        isIn: [['basic', 'standard', 'premium']]
      }
    },
    photographyStyle: {
      type: DataTypes.STRING(100),
      field: 'photography_style',
      allowNull: false,
      validate: {
        isIn: [['pre-wedding', 'family', 'city', 'portrait', 'lifestyle', 'documentary']]
      }
    },
    sessionDuration: {
      type: DataTypes.INTEGER,
      field: 'session_duration',
      allowNull: false,
      comment: 'Duration in minutes'
    },
    numberOfPhotos: {
      type: DataTypes.INTEGER,
      field: 'number_of_photos',
      allowNull: false
    },
    editedPhotosCount: {
      type: DataTypes.INTEGER,
      field: 'edited_photos_count',
      allowNull: false
    },
    rawPhotosIncluded: {
      type: DataTypes.BOOLEAN,
      field: 'raw_photos_included',
      defaultValue: false
    },
    outfitChanges: {
      type: DataTypes.INTEGER,
      field: 'outfit_changes',
      defaultValue: 1
    },
    preferredLocations: {
      type: DataTypes.JSONB,
      field: 'preferred_locations'
    },
    backupDate: {
      type: DataTypes.DATEONLY,
      field: 'backup_date'
    },
    editingTimelineDays: {
      type: DataTypes.INTEGER,
      field: 'editing_timeline_days',
      defaultValue: 7
    },
    deliveryFormat: {
      type: DataTypes.STRING(50),
      field: 'delivery_format',
      defaultValue: 'digital_gallery'
    },
    printRights: {
      type: DataTypes.BOOLEAN,
      field: 'print_rights',
      defaultValue: true
    },
    commercialUse: {
      type: DataTypes.BOOLEAN,
      field: 'commercial_use',
      defaultValue: false
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
    tableName: 'photography_bookings',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  PhotographyBooking.associate = function(models) {
    // Belongs to main booking
    PhotographyBooking.belongsTo(models.Booking, {
      foreignKey: 'booking_id',
      as: 'booking'
    });
  };

  return PhotographyBooking;
};
