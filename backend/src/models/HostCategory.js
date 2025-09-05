
module.exports = (sequelize, DataTypes) => {
  const HostCategory = sequelize.define('HostCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(7),
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
    tableName: 'host_categories',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  HostCategory.associate = function(models) {
    // HostCategory has many experiences
    HostCategory.hasMany(models.Experience, {
      foreignKey: 'categoryId',
      as: 'experiences'
    });
  };

  return HostCategory;
};
