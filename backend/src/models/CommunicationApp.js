module.exports = (sequelize, DataTypes) => {
  const CommunicationApp = sequelize.define('CommunicationApp', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'display_name'
    },
    iconUrl: {
      type: DataTypes.STRING(255),
      field: 'icon_url'
    },
    urlPattern: {
      type: DataTypes.STRING(255),
      field: 'url_pattern',
      comment: 'Pattern to generate contact links, use {username}, {phone}, etc as placeholders'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order'
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
    tableName: 'communication_apps',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CommunicationApp.associate = function(models) {
    CommunicationApp.hasMany(models.UserCommunicationContact, {
      foreignKey: 'communication_app_id',
      as: 'userContacts'
    });
  };

  return CommunicationApp;
};
