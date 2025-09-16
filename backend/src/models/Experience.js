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
    status: {
      type: DataTypes.ENUM('draft', 'pending_review', 'published', 'rejected', 'paused', 'suspended', 'deleted'),
      allowNull: false,
      defaultValue: 'draft',
      comment: 'Experience status: draft, pending_review, published, rejected, paused, suspended, deleted'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true,
      comment: 'Deprecated: Use status field instead. Kept for backward compatibility.'
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
    rejectionReason: {
      type: DataTypes.TEXT,
      field: 'rejection_reason',
      allowNull: true,
      comment: 'Admin feedback when experience is rejected'
    },
    rejectedAt: {
      type: DataTypes.DATE,
      field: 'rejected_at',
      allowNull: true,
      comment: 'Timestamp when experience was rejected by admin'
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

  // Static methods for status management
  Experience.STATUS = {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PUBLISHED: 'published',
    REJECTED: 'rejected',
    PAUSED: 'paused',
    SUSPENDED: 'suspended',
    DELETED: 'deleted'
  };

  // Static method to get experiences by status
  Experience.findByStatus = function(status, options = {}) {
    return this.findAll({
      where: { status },
      ...options
    });
  };

  // Static method to get bookable experiences
  Experience.findBookable = function(options = {}) {
    return this.findAll({
      where: { status: Experience.STATUS.PUBLISHED },
      ...options
    });
  };

  // Instance methods for status transitions
  Experience.prototype.canBeBooked = function() {
    return this.status === Experience.STATUS.PUBLISHED;
  };

  Experience.prototype.canBeDeleted = async function() {
    // Check if experience has active bookings
    const activeBookings = await this.countBookings({
      where: {
        status: ['confirmed', 'pending', 'in_progress']
      }
    });
    return activeBookings === 0;
  };

  Experience.prototype.softDelete = async function() {
    if (await this.canBeDeleted()) {
      return this.update({ status: Experience.STATUS.DELETED });
    } else {
      throw new Error('Cannot delete experience with active bookings. Use suspended status instead.');
    }
  };

  Experience.prototype.publishExperience = function() {
    if (this.status === Experience.STATUS.DRAFT || this.status === Experience.STATUS.PENDING_REVIEW || this.status === Experience.STATUS.REJECTED) {
      return this.update({ 
        status: Experience.STATUS.PUBLISHED,
        isActive: true,  // Keep backward compatibility
        rejectionReason: null,  // Clear rejection reason when published
        rejectedAt: null        // Clear rejection timestamp
      });
    }
    throw new Error(`Cannot publish experience from ${this.status} status`);
  };

  Experience.prototype.rejectExperience = function(reason) {
    if (this.status === Experience.STATUS.PENDING_REVIEW) {
      return this.update({ 
        status: Experience.STATUS.REJECTED,
        isActive: false,
        rejectionReason: reason || 'Experience does not meet publication standards',
        rejectedAt: new Date()
      });
    }
    throw new Error(`Cannot reject experience from ${this.status} status`);
  };

  Experience.prototype.resubmitAfterRejection = function() {
    if (this.status === Experience.STATUS.REJECTED) {
      return this.update({ 
        status: Experience.STATUS.PENDING_REVIEW,
        rejectionReason: null,  // Clear previous rejection reason
        rejectedAt: null        // Clear rejection timestamp  
      });
    }
    throw new Error(`Cannot resubmit experience from ${this.status} status`);
  };

  Experience.prototype.pauseExperience = function() {
    if (this.status === Experience.STATUS.PUBLISHED) {
      return this.update({ 
        status: Experience.STATUS.PAUSED,
        isActive: false  // Keep backward compatibility
      });
    }
    throw new Error(`Cannot pause experience from ${this.status} status`);
  };

  Experience.prototype.resumeExperience = function() {
    if (this.status === Experience.STATUS.PAUSED) {
      return this.update({ 
        status: Experience.STATUS.PUBLISHED,
        isActive: true  // Keep backward compatibility
      });
    }
    throw new Error(`Cannot resume experience from ${this.status} status`);
  };

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
