module.exports = (sequelize, DataTypes) => {
  const ExperienceType = sequelize.define('ExperienceType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      field: 'image_url',
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      field: 'sort_order',
      defaultValue: 0
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
    tableName: 'experience_types',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['name']
      }
    ]
  });

  ExperienceType.associate = function(models) {
    // Association with Experience
    ExperienceType.hasMany(models.Experience, {
      foreignKey: 'experience_type_id',
      as: 'experiences'
    });
  };

  return ExperienceType;
};
