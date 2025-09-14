module.exports = (sequelize, DataTypes) => {
  const UserCommunicationContact = sequelize.define('UserCommunicationContact', {
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
      },
      onDelete: 'CASCADE'
    },
    communicationAppId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'communication_app_id',
      references: {
        model: 'communication_apps',
        key: 'id'
      }
    },
    contactValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contact_value',
      comment: 'Username, phone number, or contact ID for the communication app'
    },
    isPreferred: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_preferred'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public',
      comment: 'Whether this contact is visible to other users'
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
    tableName: 'user_communication_contacts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'communication_app_id']
      }
    ]
  });

  UserCommunicationContact.associate = function(models) {
    UserCommunicationContact.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    UserCommunicationContact.belongsTo(models.CommunicationApp, {
      foreignKey: 'communication_app_id',
      as: 'app'
    });
  };

  return UserCommunicationContact;
};
