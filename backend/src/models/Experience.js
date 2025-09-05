module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      field: 'short_description'
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'host_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id',
      references: {
        model: 'host_categories',
        key: 'id'
      }
    },
    experienceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'experience_type_id',
      references: {
        model: 'experience_types',
        key: 'id'
      }
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'city_id',
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    pricePerPackage: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'package_price',
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'IDR'
    },
    duration: {
      type: DataTypes.INTEGER,
      field: 'duration_hours',
      allowNull: true,
      defaultValue: 4
    },
    maxGuests: {
      type: DataTypes.INTEGER,
      field: 'max_participants',
      allowNull: true,
      defaultValue: 10
    },
    minGuests: {
      type: DataTypes.INTEGER,
      field: 'min_participants',
      allowNull: true,
      defaultValue: 1
    },
    difficulty: {
      type: DataTypes.STRING(20),
      field: 'difficulty_level',
      allowNull: true
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Flexible field that can store array or string for images'
    },
    included: {
      type: DataTypes.JSONB,
      field: 'included_items',
      allowNull: true
    },
    excluded: {
      type: DataTypes.JSONB,
      field: 'excluded_items',
      allowNull: true
    },
    meetingPoint: {
      type: DataTypes.TEXT,
      field: 'meeting_point',
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
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      field: 'is_featured',
      defaultValue: false
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      field: 'rating_average',
      defaultValue: 0
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      field: 'rating_count',
      defaultValue: 0
    },
    bookingCount: {
      type: DataTypes.INTEGER,
      field: 'booking_count',
      defaultValue: 0
    },
    hostSpecificData: {
      type: DataTypes.JSONB,
      field: 'host_specific_data',
      allowNull: true,
      comment: 'Category-specific data (photography equipment, trip planning scope, etc.)'
    },
    deliverables: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'What guests receive (photos, PDF itinerary, certificates, etc.)'
    },
    equipmentUsed: {
      type: DataTypes.JSONB,
      field: 'equipment_used',
      allowNull: true,
      comment: 'Equipment used for photography/videography services'
    },
    endingPoint: {
      type: DataTypes.TEXT,
      field: 'ending_point',
      allowNull: true,
      comment: 'Where the experience ends (different from meeting point)'
    },
    walkingDistance: {
      type: DataTypes.DECIMAL(5, 2),
      field: 'walking_distance_km',
      allowNull: true,
      comment: 'Total walking distance in kilometers'
    },
    fitnessLevel: {
      type: DataTypes.STRING(20),
      field: 'fitness_level',
      allowNull: true,
      comment: 'Physical fitness requirement'
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
    tableName: 'experiences',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Associations
  Experience.associate = (models) => {
    Experience.belongsTo(models.User, {
      foreignKey: 'hostId',
      as: 'host'
    });
    
    Experience.belongsTo(models.HostCategory, {
      foreignKey: 'categoryId',
      as: 'category'
    });
    
    Experience.belongsTo(models.ExperienceType, {
      foreignKey: 'experienceTypeId',
      as: 'experienceType'
    });
    
    Experience.belongsTo(models.City, {
      foreignKey: 'cityId',
      as: 'city'
    });
    
    Experience.hasMany(models.ExperienceItinerary, {
      foreignKey: 'experienceId',
      as: 'itineraries'
    });
    
    Experience.hasMany(models.Booking, {
      foreignKey: 'experienceId',
      as: 'bookings'
    });
    
    Experience.hasMany(models.Review, {
      foreignKey: 'experienceId',
      as: 'reviews'
    });
  };

  return Experience;
};
