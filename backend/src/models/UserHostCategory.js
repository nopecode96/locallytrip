module.exports = (sequelize, DataTypes) => {
  const UserHostCategory = sequelize.define('UserHostCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    hostCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'host_category_id',
      references: {
        model: 'host_categories',
        key: 'id'
      }
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_primary',
      comment: 'Indicates if this is the primary category for the host'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'user_host_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'host_category_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['host_category_id']
      },
      {
        fields: ['is_primary']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  UserHostCategory.associate = function(models) {
    UserHostCategory.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    UserHostCategory.belongsTo(models.HostCategory, {
      foreignKey: 'hostCategoryId',
      as: 'hostCategory'
    });
  };

  return UserHostCategory;
};
